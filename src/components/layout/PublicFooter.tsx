import { Crown, MessageCircle } from 'lucide-react';
import { WHATSAPP_URL } from '@/lib/constants';

export default function PublicFooter() {
  return (
    <footer id="contact" className="border-t border-white/8 bg-navy-950 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="h-9 w-9 rounded-md bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
              <Crown size={18} className="text-navy-950" />
            </span>
            <span className="font-display text-lg text-ink-100">WE CARE CHESS ACADEMY</span>
          </div>
          <p className="text-sm text-ink-400 max-w-sm leading-relaxed">
            Private online beginner chess coaching in Malayalam and English. Small groups,
            personal coach feedback, and a calm path from first moves to real strategy.
          </p>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-5 text-sm text-emerald-400 hover:text-emerald-300">
            <MessageCircle size={16} /> Message us on WhatsApp
          </a>
        </div>
        <div>
          <h5 className="text-xs uppercase tracking-wider text-ink-500 mb-4">Academy</h5>
          <ul className="space-y-2.5 text-sm text-ink-300">
            <li><a href="#about" className="hover:text-ink-100">About</a></li>
            <li><a href="#programs" className="hover:text-ink-100">Programs</a></li>
            <li><a href="#why-us" className="hover:text-ink-100">Why Us</a></li>
          </ul>
        </div>
        <div>
          <h5 className="text-xs uppercase tracking-wider text-ink-500 mb-4">Portal</h5>
          <ul className="space-y-2.5 text-sm text-ink-300">
            <li><a href="/login" className="hover:text-ink-100">Student Login</a></li>
            <li><a href="#faq" className="hover:text-ink-100">FAQ</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/6 py-6 text-center text-xs text-ink-500 coord-label">
        © 2026 WE CARE CHESS ACADEMY · Learn · Think · Strategize · Succeed.
      </div>
    </footer>
  );
}
