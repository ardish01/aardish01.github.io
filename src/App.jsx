import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Projects from './pages/Projects.jsx';
import Capabilities from './pages/Capabilities.jsx';
import Contact from './pages/Contact.jsx';
import { Arrow } from './components.jsx';
import { profile } from './data.js';

const navigation = [
  ['/about', 'About'], ['/projects', 'Projects'],
  ['/capabilities', 'Capabilities'], ['/contact', 'Contact'],
];
const pageTitles = Object.fromEntries(navigation);

function Header({ open, setOpen }) {
  const header = useRef(null);
  const toggle = useRef(null);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    header.current.querySelector('.site-nav a')?.focus();
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        toggle.current.focus();
      }
      if (event.key === 'Tab') {
        const elements = [...header.current.querySelectorAll('a, button')];
        const first = elements[0];
        const last = elements.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    function onResize() { if (window.innerWidth > 800) close(); }
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return <header ref={header} className="site-header">
    <Link className="brand" to="/" onClick={close} aria-label="Aardish Duwal, Home">
      <svg className="brand-logo" viewBox="0 0 100 100" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M20 0C8.95 0 0 8.95 0 20V80C0 91.05 8.95 100 20 100H80C91.05 100 100 91.05 100 80V20C100 8.95 91.05 0 80 0H20ZM50 22L78 78H64L50 48L36 78H22L50 22Z" fill="currentColor" />
      </svg>
      Aardish Duwal<span>.</span>
    </Link>
    <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="site-nav"
      onClick={() => setOpen(!open)}><span>{open ? 'Close' : 'Menu'}</span><i aria-hidden="true" /></button>
    <nav id="site-nav" className={`site-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
      <NavLink to="/" end onClick={close}>Home</NavLink>
      {navigation.map(([to, label], index) => <NavLink key={to} to={to} onClick={close}>
        {label}<span>{String(index + 1).padStart(2, '0')}</span>
      </NavLink>)}
    </nav>
  </header>;
}

function Footer() {
  return <footer className="site-footer"><span>© {new Date().getFullYear()} Aardish Duwal</span>
    <span className="footer-location"><i /> Bhaktapur, Nepal</span>
    <a href="https://github.com/ardish01" target="_blank" rel="noopener noreferrer">Find me on GitHub <Arrow /></a>
  </footer>;
}

function NotFound() {
  return <div className="page-shell not-found"><p className="eyebrow">404 / A little off course</p>
    <h1>Let’s get<br /><em>you back.</em></h1><Link className="button button-primary" to="/">Back home <Arrow /></Link>
  </div>;
}

function AnimatedPage({ location, focusOnEntry, menuOpen }) {
  const reduced = useReducedMotion();
  const main = useRef(null);
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const path = location.pathname.replace(/\/+$/, '') || '/';
    document.title = path === '/' ? 'Aardish Duwal' : `${pageTitles[path] || 'Page not found'} — Aardish Duwal`;
  }, [location.pathname]);

  return <motion.main ref={main} id="main" tabIndex={-1} inert={menuOpen}
    initial="initial" animate="enter" exit="exit"
    variants={{ initial: { opacity: 0, y: reduced ? 0 : 18 }, enter: { opacity: 1, y: 0 }, exit: { opacity: 0, y: reduced ? 0 : -12 } }}
    transition={{ duration: reduced ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}
    onAnimationComplete={(definition) => {
      if (definition === 'enter' && focusOnEntry && !menuOpen) main.current?.focus({ preventScroll: true });
    }}>
    <Routes location={location}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/capabilities" element={<Capabilities />} />
      <Route path="/contact" element={<Contact />} />
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
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="ambient-light" aria-hidden="true" />
    <div className="noise" aria-hidden="true" />
    <Header open={menuOpen} setOpen={setMenuOpen} />
    <AnimatePresence mode="wait" initial={false}>
      <AnimatedPage key={location.pathname} location={location} menuOpen={menuOpen} focusOnEntry={location.key !== initialKey.current} />
    </AnimatePresence>
  </>;
}
