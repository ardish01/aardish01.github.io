import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router';

export function Reveal({ children, className = '', delay = 0 }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={{ opacity: 0, y: reduced ? 0 : 24 }}
    whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: reduced ? 0 : 0.65, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}>
    {children}
  </motion.div>;
}

export function Arrow({ diagonal = true }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? '↗' : '→'}</span>;
}

export function PageHeading({ number, label, children, description }) {
  return <Reveal className="page-heading"><p className="eyebrow">{number} / {label}</p>
    <h1>{children}</h1>{description && <p className="page-description">{description}</p>}
  </Reveal>;
}

export function NextPage({ to, label, number }) {
  return <nav className="next-page" aria-label="Continue exploring"><span className="eyebrow">Next / {number}</span>
    <Link to={to}>{label}<Arrow /></Link>
  </nav>;
}
