import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth, ApiClientError } from '@/context/AuthContext';

const fieldMotion = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 0.9, 0.3, 1] } }),
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(identifier, password);
      if (user.mustChangePassword) {
        navigate('/first-login');
      } else {
        const redirectTo = (location.state as any)?.from?.pathname;
        navigate(redirectTo ?? (user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'));
      }
    } catch (err) {
      if (err instanceof ApiClientError && err.code === 'ACCOUNT_INACTIVE') {
        navigate('/inactive-account');
        return;
      }
      setError(err instanceof ApiClientError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout eyebrow="Student & Admin Portal" title="Welcome back" subtitle="Sign in to continue your training.">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <motion.div custom={0} initial="hidden" animate="visible" variants={fieldMotion}>
          <Input
            label="Email or phone" type="text" placeholder="you@example.com" icon={<Mail size={16} />}
            value={identifier} onChange={e => setIdentifier(e.target.value)}
            autoComplete="username" required
          />
        </motion.div>
        <motion.div custom={1} initial="hidden" animate="visible" variants={fieldMotion}>
          <Input
            label="Password" type={showPw ? 'text' : 'password'} placeholder="••••••••"
            icon={<Lock size={16} />} value={password} onChange={e => setPassword(e.target.value)}
            autoComplete="current-password" required error={error}
          />
          <button
            type="button" onClick={() => setShowPw(s => !s)}
            className="text-xs text-ink-500 hover:text-gold-400 transition-colors mt-1.5 flex items-center gap-1.5"
          >
            {showPw ? <EyeOff size={13} /> : <Eye size={13} />} {showPw ? 'Hide' : 'Show'} password
          </button>
        </motion.div>
        <motion.div custom={2} initial="hidden" animate="visible" variants={fieldMotion} className="flex justify-end">
          <Link to="/forgot-password" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">Forgot password?</Link>
        </motion.div>
        <motion.div custom={3} initial="hidden" animate="visible" variants={fieldMotion}>
          <Button type="submit" full size="lg" disabled={loading} icon={loading ? <Loader2 size={16} className="animate-spin" /> : undefined} iconRight={!loading ? <ArrowRight size={16} /> : undefined}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </motion.div>
      </form>
      <p className="text-xs text-ink-500 mt-8 text-center">
        Not registered yet?{' '}
        <a href="/#home" className="text-gold-400 hover:text-gold-300 transition-colors">Learn about the academy</a>
      </p>
    </AuthLayout>
  );
}