import { useState } from 'react';
import { Save, MessageCircle, Palette } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card, { CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export default function Settings() {
  const { push } = useToast();
  const [whatsapp, setWhatsapp] = useState('+91 98470 00000');

  return (
    <AdminLayout title="Settings" subtitle="Academy configuration">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Academy Details" />
          <div className="px-5 pb-6 space-y-4">
            <Input label="Academy name" defaultValue="WE CARE CHESS ACADEMY" />
            <Input label="Tagline" defaultValue="Learn • Think • Strategize • Succeed." />
            <Input label="Support WhatsApp number" icon={<MessageCircle size={15} />} value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
            <Button icon={<Save size={15} />} onClick={() => push('Settings saved.')}>Save Changes</Button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Brand Preview" />
          <div className="px-5 pb-6">
            <div className="rounded-md border border-white/10 p-5 bg-navy-950 flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                <Palette size={17} className="text-navy-950" />
              </div>
              <div>
                <p className="font-display text-ink-100">WE CARE CHESS ACADEMY</p>
                <p className="text-xs text-ink-500">Learn • Think • Strategize • Succeed.</p>
              </div>
            </div>
            <p className="text-xs text-ink-500 mt-4">Colors and typography are managed in the design system — see the project README for design tokens.</p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
