import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Crown } from 'lucide-react';
import Button from '@/components/ui/Button';
import { WHATSAPP_URL } from '@/lib/constants';

const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Programs', href: '#programs' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Contact', href: '#contact' },
];

export default function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-navy-950/85 backdrop-blur-md border-b border-white/8' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-[72px] flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2.5 group">
          <span className="h-9 w-9 rounded-md bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-glow">
            <Crown size={18} className="text-navy-950" />
          </span>
          <span className="font-display text-[17px] tracking-tight text-ink-100">WE CARE <span className="gold-text">CHESS</span> ACADEMY</span>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href} className="text-sm text-ink-300 hover:text-ink-100 transition-colors">{l.label}</a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/login">
            <Button variant="outline" size="sm">Student Login</Button>
          </Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            <Button variant="gold" size="sm">Register on WhatsApp</Button>
          </a>
        </div>

        <button className="lg:hidden text-ink-100" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={24} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-navy-950/98 z-[60] flex flex-col p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-10">
              <span className="font-display text-lg">Menu</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-6">
              {links.map(l => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-2xl font-display text-ink-100">{l.label}</a>
              ))}
            </div>
            <div className="mt-auto flex flex-col gap-3">
              <Link to="/login" onClick={() => setOpen(false)}><Button variant="outline" full>Student Login</Button></Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer"><Button variant="gold" full>Register on WhatsApp</Button></a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
