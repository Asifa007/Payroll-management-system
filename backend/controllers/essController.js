const Payslip = require('../models/Payslip');
const Employee = require('../models/Employee');
const SalaryStructure = require('../models/SalaryStructure');
const { calculateSalaryComponents } = require('../utils/salaryCalculator');

// @desc Get own payslips (ESS)
// @route GET /api/ess/payslips
// @access Private/Employee
const getMyPayslips = async (req, res) => {
  try {
    if (!req.user.employeeId) {
      return res.status(400).json({ success: false, message: 'No employee profile linked to this account' });
    }

    const { year } = req.query;
    const filter = { employeeId: req.user.employeeId };
    if (year) filter.year = parseInt(year);

    const payslips = await Payslip.find(filter).sort({ year: -1, month: -1 });
    res.json({ success: true, data: payslips, count: payslips.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get own salary breakup (ESS)
// @route GET /api/ess/salary-breakup
// @access Private/Employee
const getMySalaryBreakup = async (req, res) => {
  try {
    if (!req.user.employeeId) {
      return res.status(400).json({ success: false, message: 'No employee profile linked to this account' });
    }

    const employee = await Employee.findById(req.user.employeeId).populate('salaryStructureId');

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee profile not found' });
    }

    if (!employee.salaryStructureId) {
      return res.status(404).json({ success: false, message: 'No salary structure assigned' });
    }

    const components = calculateSalaryComponents(employee.salaryStructureId);

    res.json({
      success: true,
      data: {
        employee: {
          name: employee.name,
          employeeCode: employee.employeeCode,
          designation: employee.designation,
          department: employee.department,
          joiningDate: employee.joiningDate,
          taxRegime: employee.taxRegime
        },
        salaryStructure: employee.salaryStructureId.name,
        ctc: employee.salaryStructureId.ctc,
        components
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get employee profile (ESS)
// @route GET /api/ess/profile
// @access Private/Employee
const getMyProfile = async (req, res) => {
  try {
    if (!req.user.employeeId) {
      return res.status(400).json({ success: false, message: 'No employee profile linked' });
    }

    const employee = await Employee.findById(req.user.employeeId)
      .populate('salaryStructureId', 'name ctc')
      .populate('reportingManager', 'name designation');

    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMyPayslips, getMySalaryBreakup, getMyProfile };
