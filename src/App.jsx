import { useEffect, useLayoutEffect, useRef, useState, Suspense, lazy } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router';
import { Arrow, ui } from './components.jsx';
import { profile } from './data.js';

// Code-split each page - loaded on demand
const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const Capabilities = lazy(() => import('./pages/Capabilities.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));

const navigation = [
  ['/about', 'About'], ['/projects', 'Projects'],
  ['/capabilities', 'Capabilities'], ['/contact', 'Contact'],
];
const pageTitles = Object.fromEntries(navigation);
const drawerNavigation = navigation.map(([path, label], index) => ({
  path,
  to: `${path}#${path.slice(1)}`,
  label,
  number: String(index + 1).padStart(2, '0'),
}));

const navLinkClass = `relative flex items-start gap-[.4rem] py-[.8rem] text-[.75rem] transition-colors duration-200 hover:text-accent aria-[current=page]:text-accent after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-expo after:content-[''] aria-[current=page]:after:scale-x-100`;

function Header({ open, setOpen }) {
  const header = useRef(null);
  const drawer = useRef(null);
  const toggle = useRef(null);
  const location = useLocation();
  const reduced = useReducedMotion();

  function close() {
    setOpen(false);
    document.body.style.overflow = '';
  }

  function handleSectionLink(path) {
    close();
    if (location.pathname.replace(/\/+$/, '') !== path) return;
    requestAnimationFrame(() => {
      document.getElementById(path.slice(1))?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      document.getElementById('main')?.focus({ preventScroll: true });
    });
  }

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const firstLink = [...(drawer.current?.querySelectorAll('a') ?? [])]
      .find((link) => link.getClientRects().length > 0);
    const frame = requestAnimationFrame(() => firstLink?.focus());
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        toggle.current?.focus();
      }
      if (event.key === 'Tab') {
        const elements = [
          ...(header.current?.querySelectorAll('a, button') ?? []),
          ...(drawer.current?.querySelectorAll('a, button') ?? []),
        ].filter((element) => element.getClientRects().length > 0 && !element.hasAttribute('disabled'));
        const first = elements[0];
        const last = elements.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }
    function onResize() { if (window.innerWidth >= 768) close(); }
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return <>
    <header ref={header} className="fixed inset-x-0 top-0 z-50 flex h-24 items-center gap-8 border-b border-line bg-[linear-gradient(180deg,rgba(7,13,14,.95),rgba(7,13,14,.85))] px-pad shadow-[inset_0_1px_0_rgba(255,255,255,.06),0_4px_24px_-8px_rgba(0,0,0,.6)] backdrop-blur-[12px] backdrop-saturate-150 max-md:h-[60px] max-md:border-white/10 max-md:bg-none max-md:bg-[rgba(7,13,14,.78)] max-md:px-5">
      <Link className="group inline-flex min-h-11 items-center text-[1.15rem] font-bold leading-none tracking-[-.04em] whitespace-nowrap max-md:text-[1.05rem]" to="/" onClick={close} aria-label="Aardish Duwal, Home">
        <svg className="mr-[.7rem] h-[1.65rem] w-[1.65rem] shrink-0 text-ink drop-shadow-[0_0_8px_rgba(95,224,200,.25)] transition duration-300 ease-expo group-hover:scale-[1.06] group-hover:text-accent max-md:mr-[.55rem] max-md:h-[1.45rem] max-md:w-[1.45rem]" viewBox="0 0 100 100" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M20 0C8.95 0 0 8.95 0 20V80C0 91.05 8.95 100 20 100H80C91.05 100 100 91.05 100 80V20C100 8.95 91.05 0 80 0H20ZM50 22L78 78H64L50 48L36 78H22L50 22Z" fill="currentColor" />
        </svg>
        Aardish Duwal<span className="text-accent">.</span>
      </Link>
      <nav className="ml-auto hidden items-center gap-8 md:flex" aria-label="Main navigation">
        <NavLink to="/" end className={navLinkClass}>Home</NavLink>
        {navigation.map(([to, label]) => <NavLink key={to} to={to} className={navLinkClass}>{label}</NavLink>)}
      </nav>
      <button ref={toggle} type="button"
        className="ml-auto hidden h-11 w-11 place-items-center rounded-full border border-line bg-white/[.04] text-ink transition-colors duration-200 hover:border-accent/40 hover:text-accent max-md:grid"
        aria-label="Toggle navigation" aria-expanded={open} aria-controls="mobile-nav"
        onClick={() => setOpen(!open)}>
        <span aria-hidden="true" className="relative block h-4 w-5">
          <span className={`absolute top-[3px] left-0 h-[1.5px] w-full rounded-full bg-current transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? '[transform:translateY(4px)_rotate(45deg)]' : ''}`} />
          <span className={`absolute bottom-[3px] left-0 h-[1.5px] w-full rounded-full bg-current transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? '[transform:translateY(-4px)_rotate(-45deg)]' : ''}`} />
        </span>
      </button>
    </header>
    <nav ref={drawer} id="mobile-nav"
      className={`fixed inset-x-0 top-[60px] bottom-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-[linear-gradient(180deg,rgba(7,13,14,.98),rgba(7,13,14,.99))] px-5 pt-4 pb-[calc(2rem+env(safe-area-inset-bottom))] backdrop-blur-[12px] transition-[opacity,transform] duration-[250ms] ease-out md:hidden ${open ? 'visible opacity-100 [transform:translateY(0)]' : 'invisible opacity-0 [transform:translateY(-8px)]'}`}
      aria-label="Main navigation">
      <div className="flex flex-col">
        {drawerNavigation.map(({ path, to, label, number }) => (
          <NavLink key={path} to={to} onClick={() => handleSectionLink(path)}
            className="relative flex min-h-14 items-center gap-4 border-b border-line py-3 text-[1.5rem] font-bold leading-[1.2] tracking-[-.02em] transition-colors duration-200 last:border-b-0 hover:text-accent aria-[current=page]:text-accent">
            <span aria-hidden="true" className="font-mono text-[.8rem] font-normal tracking-normal text-muted/70">{number}</span>
            {label}
          </NavLink>
        ))}
      </div>
      <div className="mt-auto border-t border-line pt-5">
        <p className="mb-1 font-mono text-[.72rem] uppercase tracking-[.14em] text-muted/70">Quick contact</p>
        <a className="flex min-h-11 items-center justify-between gap-4 border-b border-line py-3 text-[.95rem] text-accent transition-colors duration-200 hover:text-accent-bright" href={`mailto:${profile.email}`} onClick={close}>
          {profile.email}<Arrow />
        </a>
        <a className="flex min-h-11 items-center justify-between gap-4 py-3 text-[.85rem] text-muted transition-colors duration-200 hover:text-accent" href="https://github.com/ardish01" target="_blank" rel="noopener noreferrer" onClick={close}>
          Find me on GitHub <Arrow />
        </a>
        <span className="mt-4 inline-flex min-h-8 items-center gap-2 rounded-full border border-line bg-white/[.04] px-3 py-1.5 font-mono text-[.72rem] uppercase tracking-[.08em] text-muted">
          <i className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" /> {profile.location}
        </span>
      </div>
    </nav>
  </>;
}

function Footer() {
  return <footer className="mx-pad flex flex-wrap justify-between gap-6 border-t border-line py-8 font-mono text-[.72rem] leading-[1.6] tracking-[.05em] text-muted uppercase max-[800px]:flex-col max-[800px]:items-start max-[800px]:gap-3 max-[800px]:pb-[calc(2rem+env(safe-area-inset-bottom))] max-[800px]:text-[.72rem] max-md:items-center max-md:gap-2 max-md:pb-[calc(2rem+env(safe-area-inset-bottom))] max-md:text-center"><span className="max-md:hidden">© {new Date().getFullYear()} Aardish Duwal</span>
    <span className="flex items-center gap-[.6rem] max-md:hidden"><i className="h-[.4rem] w-[.4rem] rounded-full bg-accent" /> Bhaktapur, Nepal</span>
    <span className="hidden max-md:inline max-md:text-[.72rem] max-md:tracking-[.01em]">© {new Date().getFullYear()} Aardish Duwal · Bhaktapur, Nepal</span>
    <a className="inline-flex gap-4 hover:text-accent max-[800px]:min-h-11 max-[800px]:items-center max-md:justify-center" href="https://github.com/ardish01" target="_blank" rel="noopener noreferrer">Find me on GitHub <Arrow /></a>
  </footer>;
}

function NotFound() {
  return <div className="mx-auto min-h-[calc(100svh-15rem)] max-w-[1440px] px-pad pt-20 pb-20 max-[800px]:pt-12"><p className={ui.eyebrow}>404 / A little off course</p>
    <h1 className="my-8 text-[clamp(3rem,5.5vw,5.5rem)] font-extrabold leading-[1.1] tracking-[-.04em] [word-spacing:0.04em]">Let’s get<br /><em className="not-italic text-accent">you back.</em></h1><Link className={ui.primaryButton} to="/">Back home <Arrow className="text-[1.3rem]" /></Link>
  </div>;
}

function AnimatedPage({ location, focusOnEntry, menuOpen }) {
  const reduced = useReducedMotion();
  const main = useRef(null);
  useLayoutEffect(() => {
    const path = location.pathname.replace(/\/+$/, '') || '/';
    document.title = path === '/' ? 'Aardish Duwal' : `${pageTitles[path] || 'Page not found'} — Aardish Duwal`;
    const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
    if (!target) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return undefined;
    }
    const frame = requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash, reduced]);

  return <motion.main ref={main} id="main" tabIndex={-1} inert={menuOpen}
    className="relative min-h-svh pt-24 md:pt-24 max-md:pt-[60px]"
    initial="initial" animate="enter" exit="exit"
    variants={{ initial: { opacity: 0, y: reduced ? 0 : 18 }, enter: { opacity: 1, y: 0 }, exit: { opacity: 0, y: reduced ? 0 : -12 } }}
    transition={{ duration: reduced ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}
    onAnimationComplete={(definition) => {
      if (definition === 'enter' && focusOnEntry && !menuOpen) main.current?.focus({ preventScroll: true });
    }}>
    <Routes location={location}>
      <Route path="/" element={
        <Suspense fallback={<div className="min-h-svh flex items-center justify-center" aria-busy="true"><span className="font-mono text-[.8rem] text-muted">Loading…</span></div>}>
          <Home />
        </Suspense>
      } />
      <Route path="/about" element={
        <Suspense fallback={<div className="min-h-svh flex items-center justify-center" aria-busy="true"><span className="font-mono text-[.8rem] text-muted">Loading…</span></div>}>
          <About />
        </Suspense>
      } />
      <Route path="/projects" element={
        <Suspense fallback={<div className="min-h-svh flex items-center justify-center" aria-busy="true"><span className="font-mono text-[.8rem] text-muted">Loading…</span></div>}>
          <Projects />
        </Suspense>
      } />
      <Route path="/capabilities" element={
        <Suspense fallback={<div className="min-h-svh flex items-center justify-center" aria-busy="true"><span className="font-mono text-[.8rem] text-muted">Loading…</span></div>}>
          <Capabilities />
        </Suspense>
      } />
      <Route path="/contact" element={
        <Suspense fallback={<div className="min-h-svh flex items-center justify-center" aria-busy="true"><span className="font-mono text-[.8rem] text-muted">Loading…</span></div>}>
          <Contact />
        </Suspense>
      } />
      <Route path="/index.html" element={<Navigate to="/" replace />} />
      {navigation.map(([to]) => <Route key={to} path={`${to}.html`} element={<Navigate to={to} replace />} />)}
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
  </motion.main>;
}

export default function App() {
  const location = useLocation();
  const initialKey = useRef(location.key);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { setMenuOpen(false); }, [location.key]);
  return <>
    <a className="fixed top-4 left-4 z-[100] -translate-y-[200%] bg-accent p-4 text-bg focus:translate-y-0" href="#main">Skip to content</a>
    <div className="ambient-light" aria-hidden="true" />
    <div className="noise" aria-hidden="true" />
    <Header open={menuOpen} setOpen={setMenuOpen} />
    <AnimatePresence mode="wait" initial={false}>
      <AnimatedPage key={location.pathname} location={location} menuOpen={menuOpen} focusOnEntry={location.key !== initialKey.current} />
    </AnimatePresence>
  </>;
}
