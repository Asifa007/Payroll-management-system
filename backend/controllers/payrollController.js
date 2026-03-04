const Payroll = require('../models/Payroll');
const Payslip = require('../models/Payslip');
const Employee = require('../models/Employee');
const SalaryStructure = require('../models/SalaryStructure');
const Attendance = require('../models/Attendance');
const TaxDeclaration = require('../models/TaxDeclaration');
const { calculateEmployeePayroll } = require('../utils/salaryCalculator');
const { createAuditLog } = require('../utils/auditLogger');

// @desc Run payroll for a month
// @route POST /api/payroll/run
// @access Private/Payroll Admin
const runPayroll = async (req, res) => {
  try {
    const { month, year, employeeIds } = req.body;

    if (!month || !year) {
      return res.status(400).json({ success: false, message: 'Month and year are required' });
    }

    // Check if payroll already exists
    let payroll = await Payroll.findOne({
      month: parseInt(month),
      year: parseInt(year),
      organization: req.user.organization
    });

    if (payroll && payroll.status === 'approved') {
      return res.status(400).json({ success: false, message: 'Payroll already approved for this period' });
    }

    // Get active employees
    const empFilter = { organization: req.user.organization, status: 'active' };
    if (employeeIds && employeeIds.length > 0) {
      empFilter._id = { $in: employeeIds };
    }

    const employees = await Employee.find(empFilter).populate('salaryStructureId');
    if (!employees.length) {
      return res.status(400).json({ success: false, message: 'No active employees found' });
    }

    const payrollEntries = [];
    let totalGross = 0, totalDeductions = 0, totalNetPay = 0, totalPF = 0, totalESI = 0, totalTax = 0;

    for (const employee of employees) {
      if (!employee.salaryStructureId) continue;

      // Get attendance data for this month
      const attendanceRecords = await Attendance.find({
        employeeId: employee._id,
        month: parseInt(month),
        year: parseInt(year)
      });

      const attendanceSummary = {
        presentDays: attendanceRecords.filter(r => ['Present', 'Work_From_Home'].includes(r.status)).length,
        lopDays: attendanceRecords.filter(r => r.isLop).length,
        overtimeHours: attendanceRecords.reduce((s, r) => s + (r.overtimeHours || 0), 0)
      };

      // Get tax declaration
      const fy = month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
      const taxDecl = await TaxDeclaration.findOne({ employeeId: employee._id, financialYear: fy });

      const calculated = calculateEmployeePayroll(employee, employee.salaryStructureId, attendanceSummary, taxDecl);

      payrollEntries.push({
        employeeId: employee._id,
        salaryStructureId: employee.salaryStructureId._id,
        ...calculated,
        status: 'processed'
      });

      totalGross += calculated.grossSalary;
      totalDeductions += calculated.deductions.totalDeductions;
      totalNetPay += calculated.netSalary;
      totalPF += calculated.deductions.pf;
      totalESI += calculated.deductions.esi;
      totalTax += calculated.deductions.incomeTax;
    }

    // Create or update payroll
    if (payroll) {
      payroll.payrollEntries = payrollEntries;
      payroll.status = 'pending_approval';
      payroll.summary = {
        totalEmployees: payrollEntries.length,
        totalGross: Math.round(totalGross),
        totalDeductions: Math.round(totalDeductions),
        totalNetPay: Math.round(totalNetPay),
        totalPF: Math.round(totalPF),
        totalESI: Math.round(totalESI),
        totalTax: Math.round(totalTax)
      };
      payroll.createdBy = req.user._id;
      await payroll.save();
    } else {
      payroll = await Payroll.create({
        month: parseInt(month),
        year: parseInt(year),
        payrollEntries,
        summary: {
          totalEmployees: payrollEntries.length,
          totalGross: Math.round(totalGross),
          totalDeductions: Math.round(totalDeductions),
          totalNetPay: Math.round(totalNetPay),
          totalPF: Math.round(totalPF),
          totalESI: Math.round(totalESI),
          totalTax: Math.round(totalTax)
        },
        status: 'pending_approval',
        organization: req.user.organization,
        createdBy: req.user._id
      });
    }

    await createAuditLog({
      action: 'PAYROLL_RUN',
      module: 'payroll',
      performedBy: req.user._id,
      performedByName: req.user.name,
      targetId: payroll._id,
      targetType: 'Payroll',
      changes: { month, year, totalEmployees: payrollEntries.length },
      req
    });

    res.status(201).json({
      success: true,
      message: `Payroll processed for ${payrollEntries.length} employees`,
      data: payroll
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Approve payroll
// @route PUT /api/payroll/:id/approve
// @access Private/Payroll Admin
const approvePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) return res.status(404).json({ success: false, message: 'Payroll not found' });

    if (payroll.status !== 'pending_approval') {
      return res.status(400).json({ success: false, message: `Cannot approve payroll with status: ${payroll.status}` });
    }

    payroll.status = 'approved';
    payroll.approvedBy = req.user._id;
    payroll.approvedAt = new Date();
    await payroll.save();

    // Generate payslips for all employees
    for (const entry of payroll.payrollEntries) {
      const employee = await Employee.findById(entry.employeeId);
      if (!employee) continue;

      await Payslip.findOneAndUpdate(
        { employeeId: entry.employeeId, month: payroll.month, year: payroll.year },
        {
          employeeId: entry.employeeId,
          payrollId: payroll._id,
          month: payroll.month,
          year: payroll.year,
          employeeDetails: {
            name: employee.name,
            employeeCode: employee.employeeCode,
            designation: employee.designation,
            department: employee.department,
            panNumber: employee.panNumber,
            uanNumber: employee.uanNumber,
            bankAccount: employee.bankAccount?.accountNumber,
            dateOfJoining: employee.joiningDate
          },
          earnings: entry.earnings,
          deductions: entry.deductions,
          attendance: entry.attendance,
          grossSalary: entry.grossSalary,
          netSalary: entry.netSalary,
          organization: payroll.organization
        },
        { upsert: true, new: true }
      );
    }

    await createAuditLog({
      action: 'PAYROLL_APPROVED',
      module: 'payroll',
      performedBy: req.user._id,
      performedByName: req.user.name,
      targetId: payroll._id,
      targetType: 'Payroll',
      req
    });

    res.json({ success: true, message: 'Payroll approved and payslips generated', data: payroll });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all payroll records
// @route GET /api/payroll
// @access Private/Admin
const getPayrolls = async (req, res) => {
  try {
    const { year, status } = req.query;
    const filter = { organization: req.user.organization };

    if (year) filter.year = parseInt(year);
    if (status) filter.status = status;

    const payrolls = await Payroll.find(filter)
      .populate('createdBy', 'name')
      .populate('approvedBy', 'name')
      .sort({ year: -1, month: -1 });

    res.json({ success: true, data: payrolls, count: payrolls.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get payroll by employee
// @route GET /api/payroll/:employeeId
// @access Private
const getEmployeePayroll = async (req, res) => {
  try {
    const { year } = req.query;
    const filter = {
      'payrollEntries.employeeId': req.params.employeeId,
      organization: req.user.organization
    };
    if (year) filter.year = parseInt(year);

    const payrolls = await Payroll.find(filter).sort({ year: -1, month: -1 });

    const result = payrolls.map(p => {
      const entry = p.payrollEntries.find(e => e.employeeId.toString() === req.params.employeeId);
      return { month: p.month, year: p.year, status: p.status, payrollId: p._id, ...entry?.toObject?.() };
    });

    res.json({ success: true, data: result, count: result.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single payroll detail
// @route GET /api/payroll/detail/:id
// @access Private
const getPayrollDetail = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id)
      .populate('payrollEntries.employeeId', 'name employeeCode department designation')
      .populate('createdBy', 'name')
      .populate('approvedBy', 'name');

    if (!payroll) return res.status(404).json({ success: false, message: 'Payroll not found' });

    res.json({ success: true, data: payroll });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Mark payroll as paid
// @route PUT /api/payroll/:id/pay
// @access Private/Payroll Admin
const markPayrollPaid = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      { status: 'paid', paymentDate: new Date() },
      { new: true }
    );
    if (!payroll) return res.status(404).json({ success: false, message: 'Payroll not found' });

    res.json({ success: true, message: 'Payroll marked as paid', data: payroll });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { runPayroll, approvePayroll, getPayrolls, getEmployeePayroll, getPayrollDetail, markPayrollPaid };
