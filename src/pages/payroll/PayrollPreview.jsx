import { useState } from 'react';
import { CheckCircle, XCircle, Eye, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const PAYROLL_PREVIEW = [
    { id: 'EMP001', name: 'Arjun Kumar', dept: 'Engineering', gross: 145000, pf: 7500, esi: 0, pt: 200, tds: 12000, net: 125300, status: 'Pending' },
    { id: 'EMP002', name: 'Priya Nair', dept: 'HR', gross: 72000, pf: 4500, esi: 540, pt: 200, tds: 3500, net: 63260, status: 'Approved' },
    { id: 'EMP004', name: 'Sneha Reddy', dept: 'Finance', gross: 67000, pf: 4200, esi: 503, pt: 200, tds: 2800, net: 59297, status: 'Rejected' },
];

const fmtINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function PayrollPreview() {
    const [items, setItems] = useState(PAYROLL_PREVIEW);
    const [selected, setSelected] = useState(null);

    const updateStatus = (id, status) => {
        setItems((prev) => prev.map((e) => e.id === id ? { ...e, status } : e));
        toast.success(`Payroll for ${items.find((e) => e.id === id)?.name} ${status.toLowerCase()}.`);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Payroll Preview</h1>
                    <p className="page-subtitle">Review individual payroll entries. Approve or reject before locking.</p>
                </div>
                <Button icon={Lock} variant="success">Lock All Approved</Button>
            </div>

            <div className="card">
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr><th>EMPLOYEE</th><th>GROSS</th><th>PF</th><th>ESI</th><th>PT</th><th>TDS</th><th>NET PAY</th><th>STATUS</th><th>ACTIONS</th></tr>
                        </thead>
                        <tbody>
                            {items.map((e) => (
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
                                    <td>{fmtINR(e.gross)}</td>
                                    <td style={{ color: '#64748b' }}>{fmtINR(e.pf)}</td>
                                    <td style={{ color: '#64748b' }}>{fmtINR(e.esi)}</td>
                                    <td style={{ color: '#64748b' }}>{fmtINR(e.pt)}</td>
                                    <td style={{ color: '#64748b' }}>{fmtINR(e.tds)}</td>
                                    <td style={{ fontWeight: 700, color: '#16a34a' }}>{fmtINR(e.net)}</td>
                                    <td>
                                        <span className={`badge ${e.status === 'Approved' ? 'badge-green' : e.status === 'Rejected' ? 'badge-red' : 'badge-yellow'}`}>
                                            {e.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            <button onClick={() => setSelected(e)} title="View" style={{ background: '#eff6ff', border: 'none', borderRadius: 6, padding: '5px 7px', cursor: 'pointer', color: '#2563eb', display: 'flex' }}>
                                                <Eye size={13} />
                                            </button>
                                            <button onClick={() => updateStatus(e.id, 'Approved')} disabled={e.status === 'Approved'} title="Approve" style={{ background: '#f0fdf4', border: 'none', borderRadius: 6, padding: '5px 7px', cursor: 'pointer', color: '#16a34a', display: 'flex', opacity: e.status === 'Approved' ? 0.4 : 1 }}>
                                                <CheckCircle size={13} />
                                            </button>
                                            <button onClick={() => updateStatus(e.id, 'Rejected')} disabled={e.status === 'Rejected'} title="Reject" style={{ background: '#fef2f2', border: 'none', borderRadius: 6, padding: '5px 7px', cursor: 'pointer', color: '#dc2626', display: 'flex', opacity: e.status === 'Rejected' ? 0.4 : 1 }}>
                                                <XCircle size={13} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Payroll Detail">
                {selected && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff' }}>
                                {selected.name.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <div>
                                <p style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{selected.name}</p>
                                <p style={{ fontSize: 13, color: '#64748b' }}>{selected.dept} · {selected.id}</p>
                            </div>
                        </div>
                        {[
                            { label: 'Gross Salary', val: fmtINR(selected.gross), color: '#16a34a' },
                            { label: 'PF Deduction', val: `− ${fmtINR(selected.pf)}`, color: '#dc2626' },
                            { label: 'ESI Deduction', val: `− ${fmtINR(selected.esi)}`, color: '#dc2626' },
                            { label: 'Professional Tax', val: `− ${fmtINR(selected.pt)}`, color: '#dc2626' },
                            { label: 'TDS / Income Tax', val: `− ${fmtINR(selected.tds)}`, color: '#dc2626' },
                        ].map((r) => (
                            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                                <span style={{ fontSize: 13.5, color: '#64748b' }}>{r.label}</span>
                                <span style={{ fontSize: 13.5, fontWeight: 700, color: r.color }}>{r.val}</span>
                            </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', marginTop: 4 }}>
                            <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Net Pay</span>
                            <span style={{ fontSize: 18, fontWeight: 800, color: '#2563eb' }}>{fmtINR(selected.net)}</span>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
