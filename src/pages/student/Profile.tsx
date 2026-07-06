import { useEffect, useState } from 'react';
import { User, Languages, Calendar, Lock, ShieldCheck } from 'lucide-react';
import StudentLayout from '@/components/layout/StudentLayout';
import Card, { CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import { api } from '@/lib/api';
import { useAuth, ApiClientError } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';

interface ProfileDto {
  name: string; age?: number; language?: string; joinedOn?: string; status?: string; contact?: string; email?: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const { push } = useToast();

  useEffect(() => {
    api.get<{ profile: ProfileDto }>('/me/profile').then(r => setProfile(r.profile));
  }, []);

  const initials = user?.name?.trim().split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase()).join('') ?? '';

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.post('/auth/change-password', { currentPassword: pw.current, newPassword: pw.next });
      push('Password updated successfully.');
      setPw({ current: '', next: '', confirm: '' });
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return <StudentLayout title="Profile"><Skeleton className="h-96 w-full" /></StudentLayout>;
  }

  return (
    <StudentLayout title="Profile">
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 text-center lg:col-span-1 h-fit">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-950 text-2xl font-display mx-auto mb-4">
            {initials}
          </div>
          <h3 className="font-display text-lg text-ink-100">{profile.name}</h3>
          <p className="text-xs text-ink-500 mt-1">Student</p>
          <div className="mt-4"><Badge tone={profile.status === 'active' ? 'success' : 'neutral'} dot>{profile.status === 'active' ? 'Account Active' : 'Inactive'}</Badge></div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Basic Information" />
            <div className="px-5 pb-6 grid sm:grid-cols-2 gap-4">
              <Input label="Full name" defaultValue={profile.name} icon={<User size={15} />} disabled />
              <Input label="Age" defaultValue={profile.age ? String(profile.age) : ''} disabled />
              <Input label="Language preference" defaultValue={profile.language} icon={<Languages size={15} />} disabled />
              <Input label="Joined on" defaultValue={profile.joinedOn ? new Date(profile.joinedOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''} icon={<Calendar size={15} />} disabled />
              <p className="text-xs text-ink-500 sm:col-span-2">To update these details, please contact your coach on WhatsApp.</p>
            </div>
          </Card>

          <Card>
            <CardHeader title="Change Password" />
            <form onSubmit={handleChangePassword} className="px-5 pb-6 space-y-4">
              <Input label="Current password" type="password" icon={<Lock size={15} />} value={pw.current} onChange={e => setPw({ ...pw, current: e.target.value })} required error={error} />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="New password" type="password" icon={<ShieldCheck size={15} />} value={pw.next} onChange={e => setPw({ ...pw, next: e.target.value })} required />
                <Input label="Confirm new password" type="password" icon={<ShieldCheck size={15} />} value={pw.confirm} onChange={e => setPw({ ...pw, confirm: e.target.value })}
                  error={pw.confirm && pw.confirm !== pw.next ? 'Passwords do not match' : undefined} required />
              </div>
              <Button type="submit" disabled={!pw.current || !pw.next || pw.next !== pw.confirm || saving}>{saving ? 'Updating…' : 'Update password'}</Button>
            </form>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
}
