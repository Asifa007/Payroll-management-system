import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth, ROLES } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const schema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    role: yup.string().required('Please select a role'),
});

// Demo accounts
const DEMO_USERS = {
    'superadmin@payroll.com': { name: 'Super Administrator', role: ROLES.SUPER_ADMIN, company: 'Acme Corp' },
    'payrolladmin@payroll.com': { name: 'Ravi Sharma', role: ROLES.PAYROLL_ADMIN, company: 'Acme Corp' },
    'hradmin@payroll.com': { name: 'Priya Nair', role: ROLES.HR_ADMIN, company: 'Acme Corp' },
    'employee@payroll.com': { name: 'Arjun Kumar', role: ROLES.EMPLOYEE, company: 'Acme Corp' },
    'finance@payroll.com': { name: 'Anita Verma', role: ROLES.FINANCE, company: 'Acme Corp' },
};

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await new Promise((r) => setTimeout(r, 800));
            const found = DEMO_USERS[data.email];
            if (found && data.password.length >= 6) {
                const userData = { ...found, email: data.email, id: Math.random().toString(36).slice(2) };
                const fakeToken = 'eyJ.demo.' + btoa(JSON.stringify(userData));
                login(userData, fakeToken);
                toast.success(`Welcome back, ${userData.name}!`);
                navigate(userData.role === ROLES.EMPLOYEE ? '/ess' : '/dashboard');
            } else {
                toast.error('Invalid email or password.');
            }
        } finally {
            setLoading(false);
        }
    };

    const fillDemo = (email, role) => {
        setValue('email', email);
        setValue('password', 'Demo@123');
        setValue('role', role);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
            {/* Background pattern */}
            <div style={{
                position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
            }}>
                {[...Array(6)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        width: `${200 + i * 100}px`, height: `${200 + i * 100}px`,
                        borderRadius: '50%',
                        border: '1px solid rgba(59,130,246,0.1)',
                        top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
                        transform: 'translate(-50%, -50%)',
                    }} />
                ))}
            </div>

            <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        width: 56, height: 56, background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                        borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px',
                        boxShadow: '0 0 0 8px rgba(37,99,235,0.15)',
                    }}>
                        <DollarSign size={28} color="#fff" />
                    </div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>PayrollPro</h1>
                    <p style={{ fontSize: 14, color: '#64748b' }}>Enterprise Payroll Management System</p>
                </div>

                {/* Card */}
                <div style={{
                    background: 'rgba(255,255,255,0.97)',
                    borderRadius: 20, padding: 32, boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(20px)',
                }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Sign In</h2>
                    <p style={{ fontSize: 13.5, color: '#64748b', marginBottom: 24 }}>Enter your credentials to access the portal</p>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="you@company.com"
                                icon={Mail}
                                required
                                error={errors.email?.message}
                                {...register('email')}
                            />

                            <div className="form-group">
                                <label className="form-label">
                                    Password <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                                        <Lock size={15} />
                                    </span>
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className={`form-input ${errors.password ? 'error' : ''}`}
                                        style={{ paddingLeft: 34, paddingRight: 40 }}
                                        {...register('password')}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(!showPass)}
                                        style={{
                                            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                                            background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8',
                                            display: 'flex',
                                        }}
                                    >
                                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                                {errors.password && <span className="form-error">{errors.password.message}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Role <span style={{ color: '#ef4444' }}>*</span></label>
                                <select className={`form-select ${errors.role ? 'error' : ''}`} {...register('role')}>
                                    <option value="">Select your role</option>
                                    {Object.values(ROLES).map((r) => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                                {errors.role && <span className="form-error">{errors.role.message}</span>}
                            </div>

                            <Button type="submit" loading={loading} className="w-full" style={{ marginTop: 4 }}>
                                Sign In to Portal
                            </Button>
                        </div>
                    </form>

                    {/* Demo Accounts */}
                    <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #e2e8f0' }}>
                        <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Quick Demo Access
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {[
                                { label: 'Super Admin', email: 'superadmin@payroll.com', role: ROLES.SUPER_ADMIN, color: '#a78bfa' },
                                { label: 'Payroll Admin', email: 'payrolladmin@payroll.com', role: ROLES.PAYROLL_ADMIN, color: '#60a5fa' },
                                { label: 'HR Admin', email: 'hradmin@payroll.com', role: ROLES.HR_ADMIN, color: '#34d399' },
                                { label: 'Employee', email: 'employee@payroll.com', role: ROLES.EMPLOYEE, color: '#f87171' },
                            ].map((d) => (
                                <button
                                    key={d.email}
                                    type="button"
                                    onClick={() => fillDemo(d.email, d.role)}
                                    style={{
                                        padding: '7px 10px', background: '#f8fafc', border: '1px solid #e2e8f0',
                                        borderRadius: 8, cursor: 'pointer', fontSize: 12, color: '#475569',
                                        fontFamily: 'inherit', transition: 'all 0.2s', textAlign: 'left',
                                        display: 'flex', alignItems: 'center', gap: 6,
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = d.color; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                >
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                                    {d.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#94a3b8' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
