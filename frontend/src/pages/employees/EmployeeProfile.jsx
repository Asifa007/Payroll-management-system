import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, DollarSign, Edit2, Download } from 'lucide-react';
import Button from '../../components/common/Button';

const EMPLOYEES = {
    EMP001: {
        id: 'EMP001', name: 'Arjun Kumar', email: 'arjun@acme.com', phone: '9876543210',
        dept: 'Engineering', designation: 'Senior Engineer', type: 'Full-Time',
        ctc: 1800000, status: 'Active', doj: '2023-01-15', gender: 'Male',
        address: 'No. 12, 5th Main, Koramangala, Bengaluru - 560034',
        uan: 'UAN100012345', pfNumber: 'KA/BNG/123456', pan: 'ABCPQ1234R',
        bank: 'HDFC Bank', accountNo: '50100012345678', ifsc: 'HDFC0001234',
        salary: { basic: 750000, hra: 300000, specialAllowance: 540000, pf: 90000, tax: 120000 },
        payslips: [
            { month: 'Feb 2026', gross: 140000, deductions: 18000, net: 122000, status: 'Paid' },
            { month: 'Jan 2026', gross: 140000, deductions: 18500, net: 121500, status: 'Paid' },
            { month: 'Dec 2025', gross: 145000, deductions: 18000, net: 127000, status: 'Paid' },
        ],
    },
};

const SAMPLE = {
    id: 'EMP', name: 'Employee', email: 'employee@acme.com', phone: '9876500000',
    dept: 'General', designation: 'Executive', type: 'Full-Time',
    ctc: 600000, status: 'Active', doj: '2024-01-01', gender: 'Male',
    address: 'Bengaluru, Karnataka', uan: 'UAN100000000', pfNumber: 'KA/BNG/000000',
    pan: 'XXXXX0000X', bank: 'SBI', accountNo: '00000000000', ifsc: 'SBIN0000000',
    salary: { basic: 250000, hra: 100000, specialAllowance: 150000, pf: 30000, tax: 20000 },
    payslips: [],
};

const fmtL = (n) => `₹${(n / 100000).toFixed(2)}L`;
const fmtM = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const InfoRow = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f1f5f9' }}>
        <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 13, color: '#1e293b', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{value || '—'}</span>
    </div>
);

export default function EmployeeProfile() {
    const { id } = useParams();
    const emp = EMPLOYEES[id] || { ...SAMPLE, id };

    const gross = Object.values(emp.salary).slice(0, 3).reduce((a, b) => a + b, 0);
    const deductions = Object.values(emp.salary).slice(3).reduce((a, b) => a + b, 0);

    return (
        <div className="page-container">
            <div className="page-header">
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <Link to="/employees">
                        <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 13, fontWeight: 600 }}>
                            <ArrowLeft size={15} /> Back
                        </button>
                    </Link>
                    <div>
                        <h1 className="page-title">Employee Profile</h1>
                        <p className="page-subtitle">{emp.id} · {emp.dept}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Button variant="secondary" icon={Edit2}>Edit Profile</Button>
                    <Button icon={Download}>Download Profile</Button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16 }}>
                {/* Left Column: Profile Card */}
                <div>
                    <div className="card" style={{ padding: 24, textAlign: 'center', marginBottom: 16 }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 auto 14px',
                            boxShadow: '0 4px 20px rgba(37,99,235,0.3)',
                        }}>
                            {emp.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a' }}>{emp.name}</h2>
                        <p style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>{emp.designation}</p>
                        <span className={`badge ${emp.status === 'Active' ? 'badge-green' : 'badge-red'}`} style={{ marginTop: 10 }}>
                            {emp.status}
                        </span>
                        <hr className="divider" style={{ margin: '16px 0' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
                            {[
                                { icon: Mail, val: emp.email },
                                { icon: Phone, val: emp.phone },
                                { icon: Briefcase, val: emp.dept },
                                { icon: Calendar, val: `Joined: ${emp.doj}` },
                                { icon: MapPin, val: emp.address },
                            ].map(({ icon: Icon, val }) => (
                                <div key={val} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                                    <Icon size={14} color="#94a3b8" style={{ flexShrink: 0, marginTop: 2 }} />
                                    <span style={{ fontSize: 12.5, color: '#64748b' }}>{val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Salary Summary */}
                    <div className="card" style={{ padding: 20 }}>
                        <p style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Salary Summary</p>
                        {[
                            { label: 'Annual CTC', val: fmtL(emp.ctc), color: '#2563eb' },
                            { label: 'Monthly Gross', val: fmtM(gross / 12), color: '#16a34a' },
                            { label: 'Monthly Deductions', val: fmtM(deductions / 12), color: '#dc2626' },
                            { label: 'Monthly Net', val: fmtM((gross - deductions) / 12), color: '#7c3aed' },
                        ].map((s) => (
                            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f1f5f9' }}>
                                <span style={{ fontSize: 12.5, color: '#64748b' }}>{s.label}</span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Details Tabs */}
                <div className="card">
                    <div style={{ padding: '0 20px' }}>
                        <div className="tabs">
                            {['Personal', 'Bank & PF', 'Salary Breakup', 'Payslips'].map((t, i) => (
                                <button key={t} className={`tab-btn ${i === 0 ? 'active' : ''}`}>{t}</button>
                            ))}
                        </div>
                    </div>

                    {/* Personal Info */}
                    <div style={{ padding: 20 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                            <div>
                                <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', marginBottom: 8 }}>Personal Details</p>
                                <InfoRow label="Employee ID" value={emp.id} />
                                <InfoRow label="Full Name" value={emp.name} />
                                <InfoRow label="Gender" value={emp.gender} />
                                <InfoRow label="Email" value={emp.email} />
                                <InfoRow label="Phone" value={emp.phone} />
                                <InfoRow label="PAN" value={emp.pan} />
                            </div>
                            <div>
                                <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', marginBottom: 8 }}>Employment</p>
                                <InfoRow label="Department" value={emp.dept} />
                                <InfoRow label="Designation" value={emp.designation} />
                                <InfoRow label="Type" value={emp.type} />
                                <InfoRow label="Date of Joining" value={emp.doj} />
                                <InfoRow label="UAN" value={emp.uan} />
                                <InfoRow label="PF Number" value={emp.pfNumber} />
                            </div>
                        </div>

                        {/* Payslips Preview */}
                        <div style={{ marginTop: 24 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Recent Payslips</p>
                            {emp.payslips.length === 0 ? (
                                <p style={{ fontSize: 13, color: '#94a3b8' }}>No payslips generated yet.</p>
                            ) : (
                                <table className="data-table">
                                    <thead>
                                        <tr><th>MONTH</th><th>GROSS</th><th>DEDUCTIONS</th><th>NET PAY</th><th>STATUS</th><th>ACTION</th></tr>
                                    </thead>
                                    <tbody>
                                        {emp.payslips.map((p) => (
                                            <tr key={p.month}>
                                                <td style={{ fontWeight: 600 }}>{p.month}</td>
                                                <td>{fmtM(p.gross)}</td>
                                                <td style={{ color: '#dc2626' }}>{fmtM(p.deductions)}</td>
                                                <td style={{ color: '#16a34a', fontWeight: 700 }}>{fmtM(p.net)}</td>
                                                <td><span className="badge badge-green">{p.status}</span></td>
                                                <td>
                                                    <button style={{ background: '#eff6ff', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', color: '#2563eb', fontSize: 12.5, fontWeight: 600 }}>
                                                        Download
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
