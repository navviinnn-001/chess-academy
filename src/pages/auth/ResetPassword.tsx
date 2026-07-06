import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, ShieldCheck } from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import { ApiClientError } from '@/context/AuthContext';

function strength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
const colors = ['bg-danger', 'bg-danger', 'bg-warning', 'bg-emerald-500', 'bg-emerald-400'];

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState((location.state as any)?.token ?? '');
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const s = strength(pw);
  const mismatch = confirm.length > 0 && confirm !== pw;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword: pw }, { auth: false });
      navigate('/login');
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout eyebrow="Account Recovery" title="Set a new password" subtitle="Choose a strong password to protect your portal access.">
      <form onSubmit={handleSubmit} className="space-y-5">
        {!(location.state as any)?.token && (
          <Input label="Reset token" placeholder="Paste the token from your reset link" value={token} onChange={e => setToken(e.target.value)} required />
        )}
        <div>
          <Input label="New password" type="password" icon={<Lock size={16} />} value={pw} onChange={e => setPw(e.target.value)} required />
          {pw.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${i < s ? colors[s] : 'bg-white/8'}`} />
                ))}
              </div>
              <p className="text-xs text-ink-500 mt-1.5">{labels[s]}</p>
            </div>
          )}
        </div>
        <Input
          label="Confirm password" type="password" icon={<ShieldCheck size={16} />}
          value={confirm} onChange={e => setConfirm(e.target.value)}
          error={mismatch ? 'Passwords do not match' : error} required
        />
        <Button type="submit" full size="lg" disabled={s < 2 || mismatch || !pw || !token || loading}>
          {loading ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </AuthLayout>
  );
}
