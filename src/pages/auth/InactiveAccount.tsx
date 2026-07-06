import { Link } from 'react-router-dom';
import { MessageCircle, ShieldAlert, ArrowLeft } from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/Button';
import { SUPPORT_WHATSAPP_URL } from '@/lib/constants';

export default function InactiveAccount() {
  return (
    <AuthLayout eyebrow="Access Restricted" title="Account inactive" subtitle="">
      <div className="text-center py-2">
        <div className="h-14 w-14 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-5">
          <ShieldAlert size={24} className="text-warning" />
        </div>
        <p className="text-sm text-ink-300 leading-relaxed mb-8">
          Your academy access is currently inactive. Please contact WE CARE CHESS ACADEMY on WhatsApp.
        </p>
        <a href={SUPPORT_WHATSAPP_URL} target="_blank" rel="noreferrer">
          <Button variant="gold" full size="lg" icon={<MessageCircle size={17} />}>Contact us on WhatsApp</Button>
        </a>
        <Link to="/login" className="flex items-center justify-center gap-1.5 text-xs text-ink-500 hover:text-ink-100 mt-6">
          <ArrowLeft size={13} /> Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
