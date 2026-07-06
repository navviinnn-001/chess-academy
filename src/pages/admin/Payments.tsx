import { useEffect, useMemo, useState } from 'react';
import { Plus, Wallet, Clock, CheckCircle2 } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Skeleton from '@/components/ui/Skeleton';
import { Drawer } from '@/components/ui/Modal';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { ApiClientError } from '@/context/AuthContext';

interface StudentOption { id: string; name: string }
interface PaymentDto {
  _id: string; student: { _id: string; name: string } | string; month: string; fee: number;
  amountReceived: number; status: 'Paid' | 'Pending' | 'Partial'; method?: string;
}

export default function Payments() {
  const [payments, setPayments] = useState<PaymentDto[] | null>(null);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [month, setMonth] = useState('All');
  const [status, setStatus] = useState('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ student: '', month: '', fee: '', amountReceived: '', status: 'Pending', method: 'UPI', note: '' });
  const { push } = useToast();

  const load = () => {
    const params = new URLSearchParams();
    if (month !== 'All') params.set('month', month);
    if (status !== 'All') params.set('status', status);
    api.get<{ payments: PaymentDto[] }>(`/payments?${params.toString()}`).then(r => setPayments(r.payments));
  };

  useEffect(() => { load(); }, [month, status]);
  useEffect(() => { api.get<{ students: (StudentOption & { name: string })[] }>('/students').then(r => setStudents(r.students)); }, []);

  const totals = useMemo(() => {
    const list = payments ?? [];
    return {
      collected: list.reduce((a, p) => a + p.amountReceived, 0),
      pending: list.filter(p => p.status !== 'Paid').length,
      paid: list.filter(p => p.status === 'Paid').length,
    };
  }, [payments]);

  const handleCreate = async () => {
    setSaving(true);
    try {
      await api.post('/payments', {
        student: form.student,
        month: form.month,
        fee: Number(form.fee),
        amountReceived: Number(form.amountReceived || 0),
        status: form.status,
        method: form.method,
        note: form.note,
      });
      push('Payment recorded.');
      setDrawerOpen(false);
      setForm({ student: '', month: '', fee: '', amountReceived: '', status: 'Pending', method: 'UPI', note: '' });
      load();
    } catch (err) {
      push(err instanceof ApiClientError ? err.message : 'Could not save payment.', 'warning');
    } finally {
      setSaving(false);
    }
  };

  const studentName = (p: PaymentDto) => (typeof p.student === 'string' ? students.find(s => s.id === p.student)?.name ?? '—' : p.student?.name ?? '—');

  return (
    <AdminLayout title="Payments" subtitle="Manual fee tracking" actions={<Button icon={<Plus size={15} />} onClick={() => setDrawerOpen(true)}>Add Payment</Button>}>
      <div className="grid sm:grid-cols-3 gap-5 mb-6">
        <Card className="p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-md bg-emerald-500/10 flex items-center justify-center"><Wallet size={18} className="text-emerald-400" /></div>
          <div><p className="font-display text-2xl text-ink-100">₹{totals.collected.toLocaleString('en-IN')}</p><p className="text-xs text-ink-500">Collected (filtered view)</p></div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-md bg-warning/10 flex items-center justify-center"><Clock size={18} className="text-warning" /></div>
          <div><p className="font-display text-2xl text-ink-100">{totals.pending}</p><p className="text-xs text-ink-500">Payments pending</p></div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-md bg-emerald-500/10 flex items-center justify-center"><CheckCircle2 size={18} className="text-emerald-400" /></div>
          <div><p className="font-display text-2xl text-ink-100">{totals.paid}</p><p className="text-xs text-ink-500">Fully paid</p></div>
        </Card>
      </div>

      <Card className="mb-5 p-4 flex flex-col md:flex-row gap-3">
        <Select options={[{ label: 'All months', value: 'All' }, { label: 'June 2026', value: 'June 2026' }, { label: 'July 2026', value: 'July 2026' }]} value={month} onChange={e => setMonth(e.target.value)} className="md:w-48" />
        <Select options={[{ label: 'All statuses', value: 'All' }, { label: 'Paid', value: 'Paid' }, { label: 'Pending', value: 'Pending' }, { label: 'Partial', value: 'Partial' }]} value={status} onChange={e => setStatus(e.target.value)} className="md:w-48" />
      </Card>

      {!payments ? <Skeleton className="h-64 w-full" /> : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-ink-500 border-b border-white/8">
              <th className="px-5 py-3">Student</th><th className="px-5 py-3">Month</th><th className="px-5 py-3">Fee</th><th className="px-5 py-3">Received</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Method</th>
            </tr></thead>
            <tbody>
              {payments.map(p => (
                <tr key={p._id} className="border-b border-white/6 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5 text-ink-100">{studentName(p)}</td>
                  <td className="px-5 py-3.5 text-ink-400 coord-label text-xs">{p.month}</td>
                  <td className="px-5 py-3.5 text-ink-300">₹{p.fee}</td>
                  <td className="px-5 py-3.5 text-ink-300">₹{p.amountReceived}</td>
                  <td className="px-5 py-3.5"><Badge tone={p.status === 'Paid' ? 'success' : p.status === 'Partial' ? 'warning' : 'danger'} dot>{p.status}</Badge></td>
                  <td className="px-5 py-3.5 text-ink-400">{p.method ?? '—'}</td>
                </tr>
              ))}
              {payments.length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-center text-ink-500">No payments match this filter.</td></tr>}
            </tbody>
          </table>
        </Card>
      )}

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Add Payment"
        footer={<><Button variant="ghost" onClick={() => setDrawerOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={saving || !form.student || !form.month || !form.fee}>{saving ? 'Saving…' : 'Save Payment'}</Button></>}>
        <div className="space-y-4">
          <Select label="Student" value={form.student} onChange={e => setForm({ ...form, student: e.target.value })}
            options={[{ label: 'Select a student', value: '' }, ...students.map(s => ({ label: s.name, value: s.id }))]} />
          <Input label="Month" placeholder="e.g. July 2026" value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Fee amount" type="number" placeholder="1500" value={form.fee} onChange={e => setForm({ ...form, fee: e.target.value })} />
            <Input label="Amount received" type="number" placeholder="1500" value={form.amountReceived} onChange={e => setForm({ ...form, amountReceived: e.target.value })} />
          </div>
          <Select label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
            options={[{ label: 'Paid', value: 'Paid' }, { label: 'Pending', value: 'Pending' }, { label: 'Partial', value: 'Partial' }]} />
          <Select label="Method" value={form.method} onChange={e => setForm({ ...form, method: e.target.value })}
            options={[{ label: 'UPI', value: 'UPI' }, { label: 'Cash', value: 'Cash' }, { label: 'Bank Transfer', value: 'Bank Transfer' }]} />
          <Input label="Admin note (optional)" placeholder="e.g. Balance pending" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
        </div>
      </Drawer>
    </AdminLayout>
  );
}
