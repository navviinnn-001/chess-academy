import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { useAuth, ApiClientError } from '@/context/AuthContext';

export default function FirstLoginPasswordChange() {
  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const mismatch = confirm.length > 0 && confirm !== pw;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/first-login-password', { newPassword: pw });
      await refresh();
      navigate(user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout eyebrow="First-Time Setup" title="Create your password" subtitle="For security, set a personal password before entering your portal.">
      <div className="mb-6"><Badge tone="gold" dot>Required before first access</Badge></div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="New password" type="password" icon={<Lock size={16} />} value={pw} onChange={e => setPw(e.target.value)} required />
        <Input
          label="Confirm new password" type="password" icon={<Lock size={16} />}
          value={confirm} onChange={e => setConfirm(e.target.value)}
          error={mismatch ? 'Passwords do not match' : error} required
        />
        <Button type="submit" full size="lg" disabled={mismatch || !pw || loading}>{loading ? 'Saving…' : 'Continue to portal'}</Button>
      </form>
    </AuthLayout>
  );
}
