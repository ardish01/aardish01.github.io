import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router';

export const ui = {
  eyebrow: 'font-mono text-[.7rem] leading-[1.6] uppercase tracking-[.12em] text-accent',
  primaryButton: 'inline-flex min-h-13 items-center justify-center gap-8 rounded-full border border-white/35 bg-[linear-gradient(180deg,var(--color-accent-bright),var(--color-accent)_48%,var(--color-accent-deep))] px-[1.4rem] py-4 text-[.8rem] font-semibold text-[#04100e] shadow-[inset_0_1px_0_rgba(255,255,255,.7),inset_0_-3px_8px_rgba(0,0,0,.16),0_16px_36px_-16px_rgba(95,224,200,.55)] transition duration-300 ease-expo pointer-fine:hover:-translate-y-[3px] pointer-fine:hover:brightness-105',
  textLink: 'inline-flex min-h-11 items-center gap-4 border-b border-line py-3 text-[.8rem] transition-colors duration-200 hover:border-accent hover:text-accent',
};

export function Reveal({ children, className = '', delay = 0 }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={{ opacity: 0, y: reduced ? 0 : 24 }}
    whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: reduced ? 0 : 0.65, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}>
    {children}
  </motion.div>;
}

export function Arrow({ diagonal = true, className = '' }) {
  return <span aria-hidden="true" className={`inline-block leading-none [font-family:Arial,sans-serif] ${className}`}>{diagonal ? '↗' : '→'}</span>;
}

export function PageHeading({ number, label, children, description }) {
  return <Reveal className="mb-16 max-[800px]:mb-12"><p className={`${ui.eyebrow} mb-7`}>{number} / {label}</p>
    <h1 className="text-[clamp(3rem,5.5vw,5.5rem)] font-extrabold leading-[1.1] tracking-[-.055em] [&_em]:not-italic [&_em]:text-accent max-[800px]:text-[clamp(2.9rem,9.5vw,5.5rem)]">{children}</h1>
    {description && <p className="mt-7 max-w-[34rem] leading-[1.8] text-muted">{description}</p>}
  </Reveal>;
}

export function NextPage({ to, label, number }) {
  return <nav className="mt-24 border-t border-line pt-8 pb-12 max-[800px]:mt-16" aria-label="Continue exploring"><span className={ui.eyebrow}>Next / {number}</span>
    <Link className="group mt-4 flex items-center justify-between text-[clamp(2rem,4.5vw,4rem)] tracking-[-.05em]" to={to}>{label}<Arrow className="text-accent transition-transform duration-300 ease-expo pointer-fine:group-hover:translate-x-[5px] pointer-fine:group-hover:-translate-y-[5px]" /></Link>
  </nav>;
}
