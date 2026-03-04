import { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend, PieChart, Pie, Cell,
} from 'recharts';
import { Download, Filter, TrendingUp, BarChart2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';

const DEPT_PAYROLL = [
    { dept: 'Engineering', ctc: 8640000, employees: 48, avgSalary: 180000 },
    { dept: 'Sales', dept2: 'Sales', ctc: 2080000, employees: 32, avgSalary: 65000 },
    { dept: 'Marketing', ctc: 1540000, employees: 22, avgSalary: 70000 },
    { dept: 'HR', ctc: 1080000, employees: 18, avgSalary: 60000 },
    { dept: 'Finance', ctc: 1680000, employees: 24, avgSalary: 70000 },
    { dept: 'Operations', ctc: 540000, employees: 12, avgSalary: 45000 },
];

const MONTHLY_TREND = [
    { month: 'Oct', gross: 28500, net: 24800, employees: 142 },
    { month: 'Nov', gross: 29200, net: 25400, employees: 145 },
    { month: 'Dec', gross: 31000, net: 26800, employees: 148 },
    { month: 'Jan', gross: 29800, net: 25900, employees: 150 },
    { month: 'Feb', gross: 32400, net: 28100, employees: 153 },
    { month: 'Mar', gross: 31500, net: 27200, employees: 156 },
];

const CTC_DATA = [
    { id: 'EMP001', name: 'Arjun Kumar', dept: 'Engineering', ctc: 1800000, basic: 900000, hra: 360000, other: 540000 },
    { id: 'EMP002', name: 'Priya Nair', dept: 'HR', ctc: 900000, basic: 450000, hra: 180000, other: 270000 },
    { id: 'EMP005', name: 'Vikram Patel', dept: 'Engineering', ctc: 1500000, basic: 750000, hra: 300000, other: 450000 },
    { id: 'EMP007', name: 'Ravi Krishnan', dept: 'Engineering', ctc: 2200000, basic: 1100000, hra: 440000, other: 660000 },
    { id: 'EMP006', name: 'Anita Sharma', dept: 'Marketing', ctc: 960000, basic: 480000, hra: 192000, other: 288000 },
];

const PIE_COLORS = ['#2563eb', '#7c3aed', '#0891b2', '#16a34a', '#d97706', '#dc2626'];

const fmtL = (n) => `₹${(n / 100000).toFixed(1)}L`;
const fmtK = (n) => `₹${(n / 1000).toFixed(0)}K`;
const fmtINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: '#1e293b', borderRadius: 10, padding: '10px 14px', border: '1px solid #334155' }}>
            <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 6 }}>{label}</p>
            {payload.map((p) => (
                <p key={p.dataKey} style={{ color: p.color, fontSize: 13, fontWeight: 600 }}>
                    {p.dataKey}: {fmtL(p.value * 100)}
                </p>
            ))}
        </div>
    );
};

const REPORT_TYPES = ['Department Report', 'Monthly Trend', 'CTC Analysis', 'Statutory Summary'];

export default function Reports() {
    const [activeReport, setActiveReport] = useState('Department Report');

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Reports & Analytics</h1>
                    <p className="page-subtitle">Payroll analytics and compliance reports for FY 2025-26.</p>
                </div>
                <Button icon={Download} variant="secondary" onClick={() => toast.info('CSV export initiated!')}>
                    Export CSV
                </Button>
            </div>

            {/* Report Type Tabs */}
            <div className="card" style={{ padding: '4px 12px', marginBottom: 16, display: 'inline-flex' }}>
                {REPORT_TYPES.map((r) => (
                    <button key={r} onClick={() => setActiveReport(r)}
                        className={`tab-btn ${activeReport === r ? 'active' : ''}`}>
                        {r}
                    </button>
                ))}
            </div>

            {activeReport === 'Department Report' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Dept Bar Chart */}
                    <div className="card" style={{ padding: 20 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Department-wise Total Payroll</h3>
                        <p style={{ fontSize: 12.5, color: '#94a3b8', marginBottom: 16 }}>Monthly total CTC per department</p>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={DEPT_PAYROLL}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="dept" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <YAxis tickFormatter={fmtL} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <Tooltip formatter={(v) => fmtL(v)} />
                                <Bar dataKey="ctc" radius={[6, 6, 0, 0]}>
                                    {DEPT_PAYROLL.map((_, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Dept Summary Table */}
                    <div className="card">
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Department Summary Table</h3>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="data-table">
                                <thead>
                                    <tr><th>DEPARTMENT</th><th>HEADCOUNT</th><th>TOTAL CTC</th><th>AVG SALARY</th><th>% OF TOTAL</th></tr>
                                </thead>
                                <tbody>
                                    {DEPT_PAYROLL.map((d) => {
                                        const totalCTC = DEPT_PAYROLL.reduce((s, x) => s + x.ctc, 0);
                                        const pct = ((d.ctc / totalCTC) * 100).toFixed(1);
                                        return (
                                            <tr key={d.dept}>
                                                <td style={{ fontWeight: 600 }}>{d.dept}</td>
                                                <td>{d.employees}</td>
                                                <td style={{ fontWeight: 600, color: '#2563eb' }}>{fmtL(d.ctc)}</td>
                                                <td>{fmtINR(d.avgSalary)}</td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                        <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 99 }}>
                                                            <div style={{ width: `${pct}%`, height: '100%', background: '#2563eb', borderRadius: 99 }} />
                                                        </div>
                                                        <span style={{ fontSize: 12.5, fontWeight: 600, color: '#334155', minWidth: 36 }}>{pct}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeReport === 'Monthly Trend' && (
                <div className="card" style={{ padding: 20 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Monthly Payroll Trend (Oct 25 — Mar 26)</h3>
                    <ResponsiveContainer width="100%" height={320}>
                        <LineChart data={MONTHLY_TREND}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={fmtK} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <Tooltip formatter={(v) => fmtL(v * 100)} />
                            <Legend />
                            <Line type="monotone" dataKey="gross" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 5, fill: '#2563eb' }} name="Gross Payroll" />
                            <Line type="monotone" dataKey="net" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 5, fill: '#16a34a' }} name="Net Payroll" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {activeReport === 'CTC Analysis' && (
                <div className="card">
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>CTC Analysis Table</h3>
                        <p style={{ fontSize: 12.5, color: '#94a3b8' }}>Salary components breakdown per employee</p>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr><th>EMPLOYEE</th><th>DEPARTMENT</th><th>ANNUAL CTC</th><th>BASIC (50%)</th><th>HRA (20%)</th><th>OTHER</th></tr>
                            </thead>
                            <tbody>
                                {CTC_DATA.map((e) => (
                                    <tr key={e.id}>
                                        <td>
                                            <p style={{ fontWeight: 600 }}>{e.name}</p>
                                            <p style={{ fontSize: 11.5, color: '#94a3b8' }}>{e.id}</p>
                                        </td>
                                        <td><span className="badge badge-blue">{e.dept}</span></td>
                                        <td style={{ fontWeight: 700, color: '#2563eb' }}>{fmtL(e.ctc)}</td>
                                        <td>{fmtL(e.basic)}</td>
                                        <td>{fmtL(e.hra)}</td>
                                        <td>{fmtL(e.other)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeReport === 'Statutory Summary' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {[
                        { title: 'PF Contributions (Mar 2026)', items: [{ label: 'Employee PF', val: '₹2,34,000' }, { label: 'Employer PF', val: '₹2,34,000' }, { label: 'Total EPF', val: '₹4,68,000' }, { label: 'EPS Contribution', val: '₹82,500' }], color: '#2563eb' },
                        { title: 'ESI Contributions (Mar 2026)', items: [{ label: 'Employee ESI', val: '₹18,450' }, { label: 'Employer ESI', val: '₹80,250' }, { label: 'Total ESI', val: '₹98,700' }, { label: 'Eligible Employees', val: '64' }], color: '#7c3aed' },
                        { title: 'Professional Tax (Mar 2026)', items: [{ label: 'Total PT Collected', val: '₹31,200' }, { label: 'Employees Covered', val: '156' }, { label: 'Filing Due', val: '21 Apr 2026' }], color: '#16a34a' },
                        { title: 'TDS Summary (Q4 FY26)', items: [{ label: 'Total TDS Deducted', val: '₹14,82,000' }, { label: 'Quarterly Deposit', val: '₹14,82,000' }, { label: 'Form 24Q Due', val: '15 May 2026' }], color: '#d97706' },
                    ].map((sec) => (
                        <div key={sec.title} className="card" style={{ padding: 20 }}>
                            <h3 style={{ fontSize: 14, fontWeight: 700, color: sec.color, marginBottom: 14 }}>{sec.title}</h3>
                            {sec.items.map((item) => (
                                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                                    <span style={{ fontSize: 13, color: '#64748b' }}>{item.label}</span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{item.val}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
