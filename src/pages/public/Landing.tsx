import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MessageCircle, ShieldCheck, Languages, LineChart, Video,
  Brain, Target, Users, ChevronDown, Play, Star, ArrowRight,
} from 'lucide-react';
import PublicNav from '@/components/layout/PublicNav';
import PublicFooter from '@/components/layout/PublicFooter';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressRing from '@/components/ui/ProgressRing';
import { BoardBackdrop, KingMotif, MoveArrow, CoordTag } from '@/components/ui/ChessMotifs';
import { WHATSAPP_URL } from '@/lib/constants';
import { useState } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 0.9, 0.3, 1] } }),
};

const trustPoints = [
  { icon: Video, label: 'Online live classes' },
  { icon: Users, label: 'Beginner-friendly' },
  { icon: Languages, label: 'Malayalam & English' },
  { icon: LineChart, label: 'Progress tracking' },
];

const whyUs = [
  { icon: Brain, title: 'Coach-led thinking', desc: 'Every class builds calculation and pattern recognition, not memorized openings.' },
  { icon: ShieldCheck, title: 'Private & focused', desc: 'Small private groups with a personal learning portal — no public content, no noise.' },
  { icon: Target, title: 'Structured beginner path', desc: 'A calm, sequenced curriculum from first moves to real tournament-ready thinking.' },
  { icon: LineChart, title: 'Visible progress', desc: 'Attendance, puzzles and weekly coach notes, all tracked in one clear dashboard.' },
];

const steps = [
  { title: 'WhatsApp Registration', desc: 'Message us your child\'s details directly on WhatsApp — no long forms.' },
  { title: 'Admin Approval', desc: 'Our coach reviews and approves the registration within 24 hours.' },
  { title: 'Private Portal Access', desc: 'You receive private login credentials to the student portal.' },
  { title: 'Learn and Improve', desc: 'Attend live classes, solve puzzles, and track weekly growth.' },
];

const faqs = [
  { q: 'What age group is this program for?', a: 'Our beginner program is designed for students aged 7 to 15 who are new to chess or have less than a year of experience.' },
  { q: 'Do I need a chess board at home?', a: 'A physical board helps, but it isn\'t required. Classes are conducted with a shared digital board during live sessions.' },
  { q: 'How do I register?', a: 'Tap "Register on WhatsApp" and send us your details. Our coach will confirm your class schedule after a short review.' },
  { q: 'Is the portal available on mobile?', a: 'Yes. The student portal works smoothly on mobile, tablet and desktop.' },
];

export default function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-navy-900 text-ink-100">
      <PublicNav />

      {/* HERO */}
      <section id="home" className="relative pt-40 pb-28 overflow-hidden">
        <BoardBackdrop />
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid lg:grid-cols-2 gap-14 items-center relative">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-2 mb-6">
              <Badge tone="gold" dot>Private Beginner Coaching · Online</Badge>
            </motion.div>
            <motion.h1 custom={1} variants={fadeUp} className="font-display text-[2.75rem] leading-[1.08] md:text-6xl md:leading-[1.05] text-ink-100">
              Build Thinking Minds <span className="gold-text">Through Chess.</span>
            </motion.h1>
            <motion.p custom={2} variants={fadeUp} className="text-ink-400 text-base md:text-lg mt-6 max-w-lg leading-relaxed">
              Private online beginner chess coaching in Malayalam and English — small groups,
              a dedicated coach, and a personal learning portal that shows real progress every week.
            </motion.p>
            <motion.div custom={3} variants={fadeUp} className="flex flex-wrap gap-4 mt-9">
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                <Button variant="gold" size="lg" icon={<MessageCircle size={18} />}>Register on WhatsApp</Button>
              </a>
              <Link to="/login">
                <Button variant="outline" size="lg">Student Login</Button>
              </Link>
            </motion.div>

            <motion.div custom={4} variants={fadeUp} className="flex flex-wrap gap-x-8 gap-y-3 mt-12">
              {trustPoints.map(t => (
                <div key={t.label} className="flex items-center gap-2 text-sm text-ink-400">
                  <t.icon size={16} className="text-emerald-400" /> {t.label}
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 0.9, 0.3, 1] }}
            className="relative flex items-center justify-center"
          >
            <div className="absolute w-[420px] h-[420px] rounded-full bg-emerald-500/10 blur-3xl" />
            <KingMotif size={380} />
            <div className="absolute -top-2 right-6 hidden md:block">
              <CoordTag>e4</CoordTag>
            </div>
            <div className="absolute bottom-10 -left-6 hidden md:block">
              <CoordTag>Nf3</CoordTag>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT / WHY US */}
      <section id="why-us" className="py-24 border-t border-white/6 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp} className="max-w-xl mb-14">
            <p className="coord-label text-xs text-gold-400 mb-3">Why Choose Us</p>
            <h2 className="font-display text-3xl md:text-4xl text-ink-100">A coaching experience built around focus, not features.</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyUs.map((w, i) => (
              <motion.div key={w.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <Card hover className="p-6 h-full">
                  <div className="h-11 w-11 rounded-md bg-emerald-500/10 flex items-center justify-center mb-5">
                    <w.icon size={20} className="text-emerald-400" />
                  </div>
                  <h3 className="font-display text-lg text-ink-100 mb-2">{w.title}</h3>
                  <p className="text-sm text-ink-400 leading-relaxed">{w.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAM OVERVIEW */}
      <section id="programs" className="py-24 border-t border-white/6 board-bg relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid lg:grid-cols-2 gap-14 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="coord-label text-xs text-gold-400 mb-3">Beginner Program</p>
            <h2 className="font-display text-3xl md:text-4xl text-ink-100 mb-5">From first moves to real strategic thinking.</h2>
            <p className="text-ink-400 leading-relaxed mb-8">
              Our beginner track is sequenced across notation, opening principles, tactics, and
              endgame technique — each live class reinforced by puzzles and a personal coach note every week.
            </p>
            <ul className="space-y-4">
              {['Live coach-led online classes', 'Weekly personalised coach feedback', 'Structured puzzle practice library', 'Malayalam & English instruction'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-ink-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-400" /> {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
            <Card glass className="p-6 relative overflow-hidden">
              <MoveArrow className="absolute -top-2 -right-6 w-52 opacity-60" />
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-ink-500 coord-label">PORTAL PREVIEW</p>
                  <h3 className="font-display text-lg text-ink-100 mt-1">Aarav's Dashboard</h3>
                </div>
                <Badge tone="success" dot>Active</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <ProgressRing value={92} size={78} label="Attend." />
                <ProgressRing value={68} size={78} color="#CBA968" label="Learning" />
                <ProgressRing value={74} size={78} color="#4FBFA0" label="Puzzles" />
              </div>
              <div className="rounded-md bg-navy-700/60 border border-white/8 p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-ink-500">Next Class</p>
                  <p className="text-sm text-ink-100 mt-0.5">Rook Endgames — Today, 6:30 PM</p>
                </div>
                <Button size="sm" variant="primary">Join</Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="about" className="py-24 border-t border-white/6">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-xl mb-16">
            <p className="coord-label text-xs text-gold-400 mb-3">How It Works</p>
            <h2 className="font-display text-3xl md:text-4xl text-ink-100">Four simple moves to get started.</h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {steps.map((s, i) => (
              <motion.div key={s.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp} className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <span className="coord-label text-gold-400 text-sm border border-gold-500/25 rounded-full h-8 w-8 flex items-center justify-center">{i + 1}</span>
                  {i < steps.length - 1 && <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-gold-500/30 to-transparent" />}
                </div>
                <h3 className="font-display text-lg text-ink-100 mb-2">{s.title}</h3>
                <p className="text-sm text-ink-400 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 border-t border-white/6 board-bg">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-xl mb-14">
            <p className="coord-label text-xs text-gold-400 mb-3">Results</p>
            <h2 className="font-display text-3xl md:text-4xl text-ink-100">Parents and students on their experience.</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Parent of Diya, age 9', text: 'The weekly coach notes make it easy to see exactly what she\'s improving on.' },
              { name: 'Kabir, age 13', text: 'I like solving the puzzles before class — it makes the live sessions much easier to follow.' },
              { name: 'Parent of Meera, age 8', text: 'She looks forward to every class. The portal makes tracking her progress simple.' },
            ].map((t, i) => (
              <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <Card className="p-6 h-full">
                  <div className="flex gap-1 mb-4 text-gold-400">
                    {Array.from({ length: 5 }).map((_, idx) => <Star key={idx} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-sm text-ink-300 leading-relaxed mb-5">"{t.text}"</p>
                  <p className="text-xs text-ink-500 coord-label">{t.name}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 border-t border-white/6">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12 text-center">
            <p className="coord-label text-xs text-gold-400 mb-3">Frequently Asked</p>
            <h2 className="font-display text-3xl text-ink-100">Questions, answered.</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <Card key={f.q} className="overflow-hidden">
                <button className="w-full flex items-center justify-between p-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="text-sm font-medium text-ink-100">{f.q}</span>
                  <motion.span animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown size={16} className="text-ink-400" />
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 0.9, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm text-ink-400 leading-relaxed">{f.a}</p>
                </motion.div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 relative overflow-hidden border-t border-white/6">
        <BoardBackdrop />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-3xl md:text-4xl text-ink-100 mb-5">Ready to begin the first move?</h2>
            <p className="text-ink-400 mb-9">Message us on WhatsApp to register — our coach responds within 24 hours.</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              <Button variant="gold" size="lg" icon={<MessageCircle size={18} />} iconRight={<ArrowRight size={16} />}>Register on WhatsApp</Button>
            </a>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
