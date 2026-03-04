import { useState } from 'react';
import { Search, Download, FileText, Eye } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { toast } from 'react-toastify';

const PAYSLIPS = [
    { id: 'EMP001', name: 'Arjun Kumar', dept: 'Engineering', month: 'February 2026', gross: 145000, pf: 7500, esi: 0, pt: 200, tds: 12000, lop: 0, ot: 4500, net: 129800, basic: 62500, hra: 25000, special: 52500, lta: 5000, status: 'Paid' },
    { id: 'EMP002', name: 'Priya Nair', dept: 'HR', month: 'February 2026', gross: 72000, pf: 4500, esi: 540, pt: 200, tds: 3500, lop: 0, ot: 0, net: 63260, basic: 37500, hra: 15000, special: 16500, lta: 3000, status: 'Paid' },
    { id: 'EMP003', name: 'Rahul Verma', dept: 'Sales', month: 'February 2026', gross: 55000, pf: 3600, esi: 413, pt: 200, tds: 1500, lop: 3200, ot: 1200, net: 47287, basic: 30000, hra: 12000, special: 11000, lta: 2000, status: 'Paid' },
];

const fmtINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

function PayslipModal({ slip, onClose }) {
    if (!slip) return null;
    const earnings = [
        { name: 'Basic Salary', val: slip.basic },
        { name: 'House Rent Allowance', val: slip.hra },
        { name: 'Special Allowance', val: slip.special },
        { name: 'Leave Travel Allowance', val: slip.lta },
        ...(slip.ot > 0 ? [{ name: 'Overtime Pay', val: slip.ot }] : []),
    ];
    const deductions = [
        { name: 'Provident Fund (Employee)', val: slip.pf },
        { name: 'ESI (Employee)', val: slip.esi },
        { name: 'Professional Tax', val: slip.pt },
        { name: 'Income Tax (TDS)', val: slip.tds },
        ...(slip.lop > 0 ? [{ name: 'LOP Deduction', val: slip.lop }] : []),
    ];

    return (
        <Modal isOpen={!!slip} onClose={onClose} title={`Payslip — ${slip.name}`} size="lg"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                    <Button icon={Download} onClick={() => toast.info('PDF download initiated!')}>Download PDF</Button>
                </>
            }
        >
            {/* Payslip Preview */}
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 16, borderBottom: '2px solid #2563eb' }}>
                    <div>
                        <p style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>ACME CORPORATION PVT LTD</p>
                        <p style={{ fontSize: 12, color: '#64748b' }}>5th Floor, Tech Park, Whitefield, Bengaluru - 560066</p>
                        <p style={{ fontSize: 12, color: '#64748b' }}>CIN: U72900KA2019PTC123456 · PAN: ABCDE1234F</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#2563eb' }}>PAYSLIP</p>
                        <p style={{ fontSize: 12, color: '#64748b' }}>{slip.month}</p>
                    </div>
                </div>

                {/* Employee Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: 16, background: '#eff6ff', borderRadius: 8, padding: 12 }}>
                    {[
                        ['Employee Name', slip.name], ['Department', slip.dept],
                        ['Employee ID', slip.id], ['Designation', 'Senior Engineer'],
                        ['PAN', 'ABCPQ1234R'], ['UAN', 'UAN100012345'],
                    ].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', gap: 8 }}>
                            <span style={{ fontSize: 12, color: '#64748b', minWidth: 120 }}>{k}:</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>{v}</span>
                        </div>
                    ))}
                </div>

                {/* Earnings & Deductions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                        <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#16a34a', marginBottom: 8 }}>Earnings</p>
                        {earnings.map((e) => (
                            <div key={e.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px dashed #e2e8f0' }}>
                                <span style={{ fontSize: 12.5, color: '#64748b' }}>{e.name}</span>
                                <span style={{ fontSize: 12.5, fontWeight: 600, color: '#1e293b' }}>{fmtINR(e.val)}</span>
                            </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', marginTop: 4, fontWeight: 700 }}>
                            <span style={{ fontSize: 13, color: '#0f172a' }}>Gross Earnings</span>
                            <span style={{ fontSize: 13, color: '#16a34a' }}>{fmtINR(slip.gross)}</span>
                        </div>
                    </div>
                    <div>
                        <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#dc2626', marginBottom: 8 }}>Deductions</p>
                        {deductions.map((d) => (
                            <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px dashed #e2e8f0' }}>
                                <span style={{ fontSize: 12.5, color: '#64748b' }}>{d.name}</span>
                                <span style={{ fontSize: 12.5, fontWeight: 600, color: '#dc2626' }}>{fmtINR(d.val)}</span>
                            </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', marginTop: 4, fontWeight: 700 }}>
                            <span style={{ fontSize: 13, color: '#0f172a' }}>Total Deductions</span>
                            <span style={{ fontSize: 13, color: '#dc2626' }}>{fmtINR(slip.pf + slip.esi + slip.pt + slip.tds + slip.lop)}</span>
                        </div>
                    </div>
                </div>

                {/* Net Pay */}
                <div style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', borderRadius: 10, padding: '14px 20px', marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>NET PAY (Take Home)</span>
                    <span style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{fmtINR(slip.net)}</span>
                </div>
            </div>
        </Modal>
    );
}

export default function PayslipView() {
    const [search, setSearch] = useState('');
    const [month, setMonth] = useState('February 2026');
    const [selected, setSelected] = useState(null);

    const filtered = PAYSLIPS.filter((e) => {
        const q = search.toLowerCase();
        return (!q || e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q)) && e.month === month;
    });

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Payslips</h1>
                    <p className="page-subtitle">View and download employee payslips.</p>
                </div>
                <Button icon={Download} variant="secondary" onClick={() => toast.info('Bulk download initiated!')}>
                    Download All
                </Button>
            </div>

            <div className="card" style={{ padding: '12px 16px', marginBottom: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
                <div className="search-input-wrapper" style={{ flex: 1 }}>
                    <Search size={15} className="search-icon" />
                    <input className="form-input" placeholder="Search employee..." value={search}
                        onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
                </div>
                <select className="form-select" style={{ width: 180 }} value={month} onChange={(e) => setMonth(e.target.value)}>
                    {['February 2026', 'January 2026', 'December 2025'].map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>

            <div className="card">
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr><th>EMPLOYEE</th><th>MONTH</th><th>GROSS</th><th>DEDUCTIONS</th><th>NET PAY</th><th>STATUS</th><th>ACTIONS</th></tr>
                        </thead>
                        <tbody>
                            {filtered.map((e) => (
                                <tr key={e.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11.5, fontWeight: 700, color: '#fff' }}>
                                                {e.name.split(' ').map((n) => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 600, fontSize: 13 }}>{e.name}</p>
                                                <p style={{ fontSize: 11.5, color: '#94a3b8' }}>{e.dept}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ color: '#64748b' }}>{e.month}</td>
                                    <td>{fmtINR(e.gross)}</td>
                                    <td style={{ color: '#dc2626' }}>{fmtINR(e.pf + e.esi + e.pt + e.tds + e.lop)}</td>
                                    <td style={{ fontWeight: 700, color: '#16a34a' }}>{fmtINR(e.net)}</td>
                                    <td><span className="badge badge-green">{e.status}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button onClick={() => setSelected(e)} style={{ background: '#eff6ff', border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', color: '#2563eb', fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                                                <Eye size={12} /> View
                                            </button>
                                            <button onClick={() => toast.info('PDF download initiated!')} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', color: '#64748b', fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                                                <Download size={12} /> PDF
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <PayslipModal slip={selected} onClose={() => setSelected(null)} />
        </div>
    );
}
