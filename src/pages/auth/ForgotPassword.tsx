import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, MailCheck } from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { ApiClientError } from '@/context/AuthContext';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Dev-only convenience: the API returns the raw reset token when NODE_ENV !== 'production'
  // (there's no email/WhatsApp provider wired up yet — see server README). We surface it here
  // so the reset flow can be tested end-to-end locally.
  const [devToken, setDevToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post<{ message: string; resetToken?: string }>(
        '/auth/forgot-password',
        { identifier },
        { auth: false },
      );
      setDevToken(res.resetToken ?? null);
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout eyebrow="Account Recovery" title="Forgot password" subtitle="We'll generate a reset link for your registered account.">
      {sent ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
          <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
            <MailCheck size={24} className="text-emerald-400" />
          </div>
          <h3 className="font-display text-lg text-ink-100 mb-2">Check your inbox</h3>
          <p className="text-sm text-ink-400 mb-6">If an account exists for that identifier, a reset link has been generated.</p>
          {devToken && (
            <div className="text-left bg-navy-800 border border-white/10 rounded-md p-4 mb-6">
              <p className="text-xs text-gold-400 mb-2">Development mode — no email/WhatsApp provider configured yet:</p>
              <Button variant="outline" full size="sm" onClick={() => navigate('/reset-password', { state: { token: devToken } })}>
                Continue to reset password
              </Button>
            </div>
          )}
          <Link to="/login"><Button variant="outline" full>Back to sign in</Button></Link>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Registered email or phone" type="text" placeholder="you@example.com" icon={<Mail size={16} />}
            value={identifier} onChange={e => setIdentifier(e.target.value)} error={error} required />
          <Button type="submit" full size="lg" disabled={loading}>{loading ? 'Sending…' : 'Send reset link'}</Button>
          <Link to="/login" className="flex items-center justify-center gap-1.5 text-xs text-ink-400 hover:text-ink-100 mt-2">
            <ArrowLeft size={13} /> Back to sign in
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
