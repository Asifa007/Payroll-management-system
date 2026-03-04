import { useState } from 'react';
import { Download, Eye, FileText, DollarSign, CreditCard, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';

const fmtINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const ESS_DATA = {
    employee: {
        name: 'Arjun Kumar',
        id: 'EMP001',
        dept: 'Engineering',
        designation: 'Senior Engineer',
        doj: '15 Jan 2023',
        manager: 'Ravi Krishnan',
        pan: 'ABCPQ1234R',
        uan: 'UAN100012345',
        bank: 'HDFC Bank — XXXX5678',
    },
    salary: {
        basic: 62500, hra: 25000, special: 52500, lta: 5000, gross: 145000,
        pf: 7500, esi: 0, pt: 200, tds: 12000, net: 125300,
        ctcAnnual: 1800000,
    },
    payslips: [
        { month: 'Feb 2026', gross: 145000, net: 125300, status: 'Paid' },
        { month: 'Jan 2026', gross: 143500, net: 123800, status: 'Paid' },
        { month: 'Dec 2025', gross: 145000, net: 125300, status: 'Paid' },
    ],
    tax: {
        regime: 'New Regime',
        annualIncome: 1800000,
        totalTax: 180000,
        ytdTDS: 135000,
        remaining: 45000,
    },
};

export default function EmployeeSelfService() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedSlip, setSelectedSlip] = useState(null);

    const d = ESS_DATA;

    return (
        <div className="page-container">
            <div className="page-header">
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20, fontWeight: 700, color: '#fff',
                        boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
                    }}>
                        {d.employee.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                        <h1 className="page-title">Welcome, {user?.name || d.employee.name}!</h1>
                        <p className="page-subtitle">{d.employee.designation} · {d.employee.dept} · {d.employee.id}</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
                {[
                    { label: 'Monthly Gross', val: fmtINR(d.salary.gross), icon: TrendingUp, color: '#16a34a', bg: '#f0fdf4' },
                    { label: 'Take Home Pay', val: fmtINR(d.salary.net), icon: CreditCard, color: '#2563eb', bg: '#eff6ff' },
                    { label: 'Annual CTC', val: `₹${(d.salary.ctcAnnual / 100000).toFixed(1)}L`, icon: DollarSign, color: '#7c3aed', bg: '#f3e8ff' },
                    { label: 'YTD TDS Paid', val: fmtINR(d.tax.ytdTDS), icon: FileText, color: '#d97706', bg: '#fffbeb' },
                ].map((s) => (
                    <div key={s.label} className="kpi-card" style={{ padding: '16px 18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <p style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>{s.label}</p>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <s.icon size={16} color={s.color} />
                            </div>
                        </div>
                        <p style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{s.val}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="card">
                <div style={{ padding: '0 20px', borderBottom: '1px solid #e2e8f0' }}>
                    <div className="tabs">
                        {[
                            { key: 'overview', label: 'My Profile' },
                            { key: 'salary', label: 'Salary Breakup' },
                            { key: 'payslips', label: 'My Payslips' },
                            { key: 'tax', label: 'Tax Details' },
                        ].map((t) => (
                            <button key={t.key} className={`tab-btn ${activeTab === t.key ? 'active' : ''}`}
                                onClick={() => setActiveTab(t.key)}>
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ padding: 20 }}>
                    {/* Profile */}
                    {activeTab === 'overview' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                            <div>
                                <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 10 }}>Personal Information</p>
                                {[
                                    ['Employee ID', d.employee.id],
                                    ['Department', d.employee.dept],
                                    ['Designation', d.employee.designation],
                                    ['Date of Joining', d.employee.doj],
                                    ['Reporting Manager', d.employee.manager],
                                ].map(([k, v]) => (
                                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                                        <span style={{ fontSize: 13, color: '#94a3b8' }}>{k}</span>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{v}</span>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 10 }}>Tax & Bank</p>
                                {[
                                    ['PAN', d.employee.pan],
                                    ['UAN (PF)', d.employee.uan],
                                    ['Bank Account', d.employee.bank],
                                    ['Tax Regime', d.tax.regime],
                                ].map(([k, v]) => (
                                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                                        <span style={{ fontSize: 13, color: '#94a3b8' }}>{k}</span>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Salary Breakup */}
                    {activeTab === 'salary' && (
                        <div style={{ maxWidth: 520 }}>
                            <p style={{ fontSize: 14, fontWeight: 700, color: '#16a34a', marginBottom: 10 }}>Monthly Earnings</p>
                            {[
                                { name: 'Basic Salary', val: d.salary.basic },
                                { name: 'House Rent Allowance', val: d.salary.hra },
                                { name: 'Special Allowance', val: d.salary.special },
                                { name: 'Leave Travel Allowance', val: d.salary.lta },
                            ].map((e) => (
                                <div key={e.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f1f5f9' }}>
                                    <span style={{ fontSize: 13.5, color: '#64748b' }}>{e.name}</span>
                                    <span style={{ fontSize: 13.5, fontWeight: 700, color: '#16a34a' }}>{fmtINR(e.val)}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 700, fontSize: 14, borderTop: '2px solid #e2e8f0', marginTop: 4 }}>
                                <span>Gross Earnings</span>
                                <span style={{ color: '#16a34a' }}>{fmtINR(d.salary.gross)}</span>
                            </div>
                            <p style={{ fontSize: 14, fontWeight: 700, color: '#dc2626', marginTop: 20, marginBottom: 10 }}>Monthly Deductions</p>
                            {[
                                { name: 'Provident Fund', val: d.salary.pf },
                                { name: 'ESI', val: d.salary.esi },
                                { name: 'Professional Tax', val: d.salary.pt },
                                { name: 'Income Tax (TDS)', val: d.salary.tds },
                            ].map((e) => (
                                <div key={e.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f1f5f9' }}>
                                    <span style={{ fontSize: 13.5, color: '#64748b' }}>{e.name}</span>
                                    <span style={{ fontSize: 13.5, fontWeight: 700, color: '#dc2626' }}>− {fmtINR(e.val)}</span>
                                </div>
                            ))}
                            <div style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', borderRadius: 12, padding: '16px 20px', marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600 }}>Net Take Home</span>
                                <span style={{ color: '#fff', fontSize: 24, fontWeight: 800 }}>{fmtINR(d.salary.net)}</span>
                            </div>
                        </div>
                    )}

                    {/* Payslips */}
                    {activeTab === 'payslips' && (
                        <div>
                            <table className="data-table">
                                <thead>
                                    <tr><th>MONTH</th><th>GROSS</th><th>NET PAY</th><th>STATUS</th><th>ACTIONS</th></tr>
                                </thead>
                                <tbody>
                                    {d.payslips.map((p) => (
                                        <tr key={p.month}>
                                            <td style={{ fontWeight: 600 }}>{p.month}</td>
                                            <td>{fmtINR(p.gross)}</td>
                                            <td style={{ fontWeight: 700, color: '#16a34a' }}>{fmtINR(p.net)}</td>
                                            <td><span className="badge badge-green">{p.status}</span></td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 6 }}>
                                                    <button onClick={() => setSelectedSlip(p)} style={{ background: '#eff6ff', border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', color: '#2563eb', fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <Eye size={12} /> View
                                                    </button>
                                                    <button onClick={() => toast.info('PDF download initiated!')} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', color: '#64748b', fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <Download size={12} /> PDF
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Tax Details */}
                    {activeTab === 'tax' && (
                        <div style={{ maxWidth: 480 }}>
                            <div style={{ background: '#f8fafc', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                                {[
                                    { label: 'Tax Regime', val: d.tax.regime, color: '#2563eb' },
                                    { label: 'Annual Gross Income', val: fmtINR(d.tax.annualIncome), color: '#1e293b' },
                                    { label: 'Total Tax Liability', val: fmtINR(d.tax.totalTax), color: '#dc2626' },
                                    { label: 'YTD TDS Deducted', val: fmtINR(d.tax.ytdTDS), color: '#d97706' },
                                    { label: 'Remaining Tax (Projected)', val: fmtINR(d.tax.remaining), color: '#64748b' },
                                    { label: 'Monthly TDS', val: fmtINR(d.tax.totalTax / 12), color: '#7c3aed' },
                                ].map((r) => (
                                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                                        <span style={{ fontSize: 13.5, color: '#64748b' }}>{r.label}</span>
                                        <span style={{ fontSize: 13.5, fontWeight: 700, color: r.color }}>{r.val}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: 14, padding: '12px 16px', background: '#eff6ff', borderRadius: 10, border: '1px solid #bfdbfe' }}>
                                <p style={{ fontSize: 13, color: '#1d4ed8', fontWeight: 600 }}>📋 Form 16 will be issued by 15th June 2026 for FY 2025-26.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick View Payslip Modal */}
            <Modal isOpen={!!selectedSlip} onClose={() => setSelectedSlip(null)} title={`Payslip — ${selectedSlip?.month}`}
                footer={<><Button variant="secondary" onClick={() => setSelectedSlip(null)}>Close</Button><Button icon={Download} onClick={() => toast.info('PDF download initiated!')}>Download</Button></>}
            >
                {selectedSlip && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                            <span>Gross Salary</span><span style={{ fontWeight: 700, color: '#16a34a' }}>{fmtINR(selectedSlip.gross)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                            <span>Deductions</span><span style={{ fontWeight: 700, color: '#dc2626' }}>− {fmtINR(selectedSlip.gross - selectedSlip.net)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 15, fontWeight: 700 }}>
                            <span>Net Pay</span><span style={{ color: '#2563eb' }}>{fmtINR(selectedSlip.net)}</span>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
