import { useState } from 'react';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Users, DollarSign, AlertCircle, Clock, TrendingUp, ArrowUpRight, ArrowDownRight, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MONTHLY_DATA = [
    { month: 'Oct', payroll: 2850000, employees: 142 },
    { month: 'Nov', payroll: 2920000, employees: 145 },
    { month: 'Dec', payroll: 3100000, employees: 148 },
    { month: 'Jan', payroll: 2980000, employees: 150 },
    { month: 'Feb', payroll: 3240000, employees: 153 },
    { month: 'Mar', payroll: 3150000, employees: 156 },
];

const DEPT_DATA = [
    { dept: 'Engineering', ctc: 1820000, headcount: 48 },
    { dept: 'Sales', ctc: 650000, headcount: 32 },
    { dept: 'Marketing', ctc: 420000, headcount: 22 },
    { dept: 'HR', ctc: 310000, headcount: 18 },
    { dept: 'Finance', ctc: 480000, headcount: 24 },
    { dept: 'Operations', ctc: 270000, headcount: 12 },
];

const PIE_DATA = [
    { name: 'Basic Salary', value: 50 },
    { name: 'HRA', value: 20 },
    { name: 'Allowances', value: 15 },
    { name: 'PF Deduction', value: 8 },
    { name: 'Tax', value: 7 },
];
const PIE_COLORS = ['#2563eb', '#7c3aed', '#0891b2', '#dc2626', '#d97706'];

const PENDING = [
    { id: 1, name: 'Priya Nair', action: 'Salary Revision', dept: 'HR', date: '01 Mar 2026', status: 'pending' },
    { id: 2, name: 'Karan Singh', action: 'Bonus Approval', dept: 'Sales', date: '28 Feb 2026', status: 'pending' },
    { id: 3, name: 'Anita Mehra', action: 'Expense Reimbursement', dept: 'Finance', date: '27 Feb 2026', status: 'pending' },
];

const ALERTS = [
    { id: 1, type: 'warning', msg: 'ESI filing due in 3 days', date: '05 Mar 2026' },
    { id: 2, type: 'error', msg: 'PF payment overdue for Feb 2026', date: '01 Mar 2026' },
    { id: 3, type: 'info', msg: 'Income Tax Q4 deadline approaching', date: '31 Mar 2026' },
];

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const fmtShort = (n) => n >= 10000000 ? `₹${(n / 10000000).toFixed(1)}Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n}`;

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: '#1e293b', borderRadius: 10, padding: '10px 14px', border: '1px solid #334155' }}>
            <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 6 }}>{label}</p>
            {payload.map((p) => (
                <p key={p.dataKey} style={{ color: p.color, fontSize: 13, fontWeight: 600 }}>
                    {p.dataKey === 'payroll' ? fmtShort(p.value) : p.value} {p.dataKey === 'payroll' ? '' : 'employees'}
                </p>
            ))}
        </div>
    );
};

export default function Dashboard() {
    const { user } = useAuth();

    const KPI_CARDS = [
        {
            label: 'Total Employees', value: '156', change: '+4', positive: true,
            icon: Users, color: '#2563eb', bg: '#eff6ff', sub: 'Active headcount',
        },
        {
            label: 'Total Payroll Cost', value: '₹31.5L', change: '+2.8%', positive: true,
            icon: DollarSign, color: '#16a34a', bg: '#f0fdf4', sub: 'March 2026',
        },
        {
            label: 'Pending Approvals', value: '8', change: '+3', positive: false,
            icon: Clock, color: '#d97706', bg: '#fffbeb', sub: 'Requires action',
        },
        {
            label: 'Compliance Alerts', value: '2', change: '1 critical', positive: false,
            icon: AlertCircle, color: '#dc2626', bg: '#fef2f2', sub: 'Tax & filings',
        },
    ];

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Welcome back, {user?.name}! Here's your payroll overview for March 2026.</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <span className="badge badge-green" style={{ fontSize: 12, padding: '6px 12px' }}>
                        <span className="status-dot green" style={{ marginRight: 6 }} />
                        Payroll Active
                    </span>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
                {KPI_CARDS.map((card) => (
                    <div key={card.label} className="kpi-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ fontSize: 12.5, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                                    {card.label}
                                </p>
                                <p style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{card.value}</p>
                                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{card.sub}</p>
                            </div>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <card.icon size={22} color={card.color} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                            {card.positive ? <ArrowUpRight size={14} color="#16a34a" /> : <ArrowDownRight size={14} color="#dc2626" />}
                            <span style={{ fontSize: 12.5, color: card.positive ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{card.change}</span>
                            <span style={{ fontSize: 12, color: '#94a3b8' }}>vs last month</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
                {/* Monthly Payroll Trend */}
                <div className="card" style={{ padding: 20 }}>
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Monthly Payroll Trend</h3>
                            <p style={{ fontSize: 12.5, color: '#94a3b8' }}>Last 6 months payroll cost</p>
                        </div>
                        <span className="badge badge-blue">2025-26 FY</span>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={MONTHLY_DATA}>
                            <defs>
                                <linearGradient id="payrollGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={fmtShort} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="payroll" stroke="#2563eb" strokeWidth={2.5} fill="url(#payrollGrad)" dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Salary Breakup Pie */}
                <div className="card" style={{ padding: 20 }}>
                    <div style={{ marginBottom: 16 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Salary Components</h3>
                        <p style={{ fontSize: 12.5, color: '#94a3b8' }}>Average CTC breakup</p>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                                dataKey="value" paddingAngle={3}>
                                {PIE_DATA.map((_, i) => (
                                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(v) => `${v}%`} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                        {PIE_DATA.map((d, i) => (
                            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: '#64748b' }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i], flexShrink: 0 }} />
                                {d.name} ({d.value}%)
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                {/* Dept-wise Payroll */}
                <div className="card" style={{ padding: 20 }}>
                    <div style={{ marginBottom: 16 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Department-wise Payroll</h3>
                        <p style={{ fontSize: 12.5, color: '#94a3b8' }}>Total CTC per department</p>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={DEPT_DATA} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                            <XAxis type="number" tickFormatter={fmtShort} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="dept" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} width={80} />
                            <Tooltip formatter={(v) => fmtShort(v)} />
                            <Bar dataKey="ctc" fill="#2563eb" radius={[0, 4, 4, 0]}>
                                {DEPT_DATA.map((_, i) => (
                                    <Cell key={i} fill={`hsl(${220 + i * 15}, 80%, ${55 - i * 3}%)`} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Compliance Alerts + Pending */}
                <div className="card" style={{ padding: 20 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Compliance Alerts</h3>
                    <p style={{ fontSize: 12.5, color: '#94a3b8', marginBottom: 14 }}>Statutory obligations to act on</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {ALERTS.map((a) => {
                            const colors = { warning: '#d97706', error: '#dc2626', info: '#2563eb' };
                            const bgs = { warning: '#fffbeb', error: '#fef2f2', info: '#eff6ff' };
                            return (
                                <div key={a.id} style={{
                                    background: bgs[a.type], borderRadius: 8, padding: '10px 12px',
                                    display: 'flex', gap: 10, alignItems: 'flex-start',
                                    borderLeft: `3px solid ${colors[a.type]}`,
                                }}>
                                    <AlertCircle size={15} color={colors[a.type]} style={{ flexShrink: 0, marginTop: 1 }} />
                                    <div>
                                        <p style={{ fontSize: 12.5, color: '#334155', fontWeight: 600 }}>{a.msg}</p>
                                        <p style={{ fontSize: 11.5, color: '#94a3b8' }}>Due: {a.date}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Pending Approvals Table */}
            <div className="card">
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Pending Approvals</h3>
                        <p style={{ fontSize: 12.5, color: '#94a3b8' }}>Awaiting your action</p>
                    </div>
                    <span className="badge badge-yellow">{PENDING.length} pending</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>EMPLOYEE</th>
                                <th>ACTION</th>
                                <th>DEPARTMENT</th>
                                <th>DATE</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {PENDING.map((p) => (
                                <tr key={p.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                                            <div style={{
                                                width: 32, height: 32, borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 12, fontWeight: 700, color: '#fff',
                                            }}>
                                                {p.name.split(' ').map((x) => x[0]).join('')}
                                            </div>
                                            <span style={{ fontWeight: 600, color: '#1e293b' }}>{p.name}</span>
                                        </div>
                                    </td>
                                    <td>{p.action}</td>
                                    <td><span className="badge badge-slate">{p.dept}</span></td>
                                    <td style={{ color: '#64748b' }}>{p.date}</td>
                                    <td><span className="badge badge-yellow">Pending</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', color: '#16a34a', fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <CheckCircle size={13} /> Approve
                                            </button>
                                            <button style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', color: '#dc2626', fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <XCircle size={13} /> Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
