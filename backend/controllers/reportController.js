const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const Payslip = require('../models/Payslip');

// Helper to convert to CSV
const toCSV = (data, fields) => {
  const header = fields.join(',');
  const rows = data.map(row => fields.map(f => {
    const val = f.split('.').reduce((o, k) => o?.[k], row);
    return `"${val ?? ''}"`;
  }).join(','));
  return [header, ...rows].join('\n');
};

// @desc PF Report
// @route GET /api/reports/pf
// @access Private/Admin
const getPFReport = async (req, res) => {
  try {
    const { month, year, format } = req.query;
    const currentDate = new Date();
    const targetMonth = parseInt(month) || currentDate.getMonth() + 1;
    const targetYear = parseInt(year) || currentDate.getFullYear();

    const payroll = await Payroll.findOne({
      month: targetMonth,
      year: targetYear,
      organization: req.user.organization
    });

    if (!payroll) return res.status(404).json({ success: false, message: 'Payroll not found for this period' });

    const pfData = [];
    for (const entry of payroll.payrollEntries) {
      const employee = await Employee.findById(entry.employeeId).select('name employeeCode uanNumber panNumber');
      if (!employee) continue;
      pfData.push({
        employeeCode: employee.employeeCode,
        name: employee.name,
        uanNumber: employee.uanNumber || 'N/A',
        panNumber: employee.panNumber || 'N/A',
        basicWages: entry.earnings?.basic || 0,
        employeeContribution: entry.deductions?.pf || 0,
        employerContribution: entry.deductions?.pf || 0,
        totalPF: (entry.deductions?.pf || 0) * 2
      });
    }

    if (format === 'csv') {
      const csv = toCSV(pfData, ['employeeCode', 'name', 'uanNumber', 'basicWages', 'employeeContribution', 'employerContribution', 'totalPF']);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=pf_report_${targetMonth}_${targetYear}.csv`);
      return res.send(csv);
    }

    res.json({
      success: true,
      data: pfData,
      period: { month: targetMonth, year: targetYear },
      totals: {
        totalEmployeeContribution: pfData.reduce((s, r) => s + r.employeeContribution, 0),
        totalEmployerContribution: pfData.reduce((s, r) => s + r.employerContribution, 0),
        totalPF: pfData.reduce((s, r) => s + r.totalPF, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc ESI Report
// @route GET /api/reports/esi
// @access Private/Admin
const getESIReport = async (req, res) => {
  try {
    const { month, year, format } = req.query;
    const currentDate = new Date();
    const targetMonth = parseInt(month) || currentDate.getMonth() + 1;
    const targetYear = parseInt(year) || currentDate.getFullYear();

    const payroll = await Payroll.findOne({
      month: targetMonth,
      year: targetYear,
      organization: req.user.organization
    });

    if (!payroll) return res.status(404).json({ success: false, message: 'Payroll not found for this period' });

    const esiData = [];
    for (const entry of payroll.payrollEntries) {
      if (!entry.deductions?.esi || entry.deductions.esi === 0) continue;
      const employee = await Employee.findById(entry.employeeId).select('name employeeCode esiNumber');
      if (!employee) continue;
      esiData.push({
        employeeCode: employee.employeeCode,
        name: employee.name,
        esiNumber: employee.esiNumber || 'N/A',
        grossWages: entry.grossSalary || 0,
        employeeContribution: entry.deductions.esi || 0,
        employerContribution: Math.round((entry.grossSalary || 0) * 0.0325)
      });
    }

    if (format === 'csv') {
      const csv = toCSV(esiData, ['employeeCode', 'name', 'esiNumber', 'grossWages', 'employeeContribution', 'employerContribution']);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=esi_report_${targetMonth}_${targetYear}.csv`);
      return res.send(csv);
    }

    res.json({ success: true, data: esiData, period: { month: targetMonth, year: targetYear } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Tax/TDS Report
// @route GET /api/reports/tax
// @access Private/Admin
const getTaxReport = async (req, res) => {
  try {
    const { month, year, format } = req.query;
    const currentDate = new Date();
    const targetMonth = parseInt(month) || currentDate.getMonth() + 1;
    const targetYear = parseInt(year) || currentDate.getFullYear();

    const payroll = await Payroll.findOne({
      month: targetMonth,
      year: targetYear,
      organization: req.user.organization
    });

    if (!payroll) return res.status(404).json({ success: false, message: 'Payroll not found for this period' });

    const taxData = [];
    for (const entry of payroll.payrollEntries) {
      const employee = await Employee.findById(entry.employeeId).select('name employeeCode panNumber');
      if (!employee) continue;
      taxData.push({
        employeeCode: employee.employeeCode,
        name: employee.name,
        panNumber: employee.panNumber || 'N/A',
        grossSalary: entry.grossSalary || 0,
        tdsDeducted: entry.deductions?.incomeTax || 0
      });
    }

    if (format === 'csv') {
      const csv = toCSV(taxData, ['employeeCode', 'name', 'panNumber', 'grossSalary', 'tdsDeducted']);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=tax_report_${targetMonth}_${targetYear}.csv`);
      return res.send(csv);
    }

    res.json({ success: true, data: taxData, period: { month: targetMonth, year: targetYear } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPFReport, getESIReport, getTaxReport };
