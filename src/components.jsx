import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router';

export const ui = {
  eyebrow: 'font-mono text-[.7rem] leading-[1.6] uppercase tracking-[.12em] text-accent',
  primaryButton: 'inline-flex min-h-13 items-center justify-center gap-8 rounded-full border border-white/35 bg-[linear-gradient(180deg,var(--color-accent-bright),var(--color-accent)_48%,var(--color-accent-deep))] px-[1.4rem] py-4 text-[.8rem] font-semibold text-[#04100e] shadow-[inset_0_1px_0_rgba(255,255,255,.7),inset_0_-3px_8px_rgba(0,0,0,.16),0_16px_36px_-16px_rgba(95,224,200,.55)] transition duration-300 ease-expo pointer-fine:hover:-translate-y-[3px] pointer-fine:hover:brightness-105',
  textLink: 'inline-flex min-h-11 items-center gap-4 border-b border-line py-3 text-[.8rem] transition-colors duration-200 hover:border-accent hover:text-accent',
};

export function Reveal({ children, className = '', delay = 0 }) {
  const reduced = useReducedMotion();
  // Use a lightweight CSS entrance on phones instead of JS-driven scroll work.
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
  if (isMobile) return <div className={`${className} max-md:animate-fade-up`}>{children}</div>;
  return <motion.div className={className} initial={{ opacity: 0, y: reduced ? 0 : 24 }}
    whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: reduced ? 0 : 0.65, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}>
    {children}
  </motion.div>;
}

export function Arrow({ diagonal = true, className = '' }) {
  return <span aria-hidden="true" className={`inline-block leading-none [font-family:Arial,sans-serif] ${className}`}>{diagonal ? '↗' : '→'}</span>;
}

export function GitHubIcon({ className = '' }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2.17c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </svg>;
}

export function ExternalIcon({ className = '' }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M14 3v2h3.59l-9.3 9.29 1.42 1.42L19 6.41V10h2V3h-7Z" />
    <path d="M5 5h5V3H3v18h18v-7h-2v5H5V5Z" />
  </svg>;
}

// One-shot press feedback for photos, so touch devices get an effect too.
export function useTapPulse(duration = 750) {
  const [active, setActive] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const pulse = () => {
    setActive(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setActive(false), duration);
  };
  return [active, pulse];
}

export function PageHeading({ number, label, children, description }) {
  return <Reveal className="mb-16 max-[800px]:mb-12 max-md:mb-6 max-md:border-t max-md:border-line max-md:pt-12"><p className={`${ui.eyebrow} mb-7 max-md:mb-2 max-md:text-[.75rem] max-md:text-muted/80`}>{number} / {label}</p>
    <h1 className="text-[clamp(3rem,5.5vw,5.5rem)] font-extrabold leading-[1.1] tracking-[-.055em] [&_em]:not-italic [&_em]:text-accent max-[800px]:text-[clamp(2.9rem,9.5vw,5.5rem)]">{children}</h1>
    {description && <p className="mt-7 max-w-[34rem] leading-[1.8] text-muted max-md:mt-4">{description}</p>}
  </Reveal>;
}

export function NextPage({ to, label, number }) {
  return <nav className="mt-24 border-t border-line pt-8 pb-12 max-[800px]:mt-16" aria-label="Continue exploring"><span className={ui.eyebrow}>Next / {number}</span>
    <Link className="group mt-4 flex items-center justify-between text-[clamp(2rem,4.5vw,4rem)] tracking-[-.05em]" to={to}>{label}<Arrow className="text-accent transition-transform duration-300 ease-expo pointer-fine:group-hover:translate-x-[5px] pointer-fine:group-hover:-translate-y-[5px]" /></Link>
  </nav>;
}
