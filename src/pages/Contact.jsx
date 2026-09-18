import { useState } from 'react';
import { Arrow, PageHeading, Reveal } from '../components.jsx';
import { profile, socials } from '../data.js';

export default function Contact() {
  const [copyStatus, setCopyStatus] = useState('');
  const [copying, setCopying] = useState(false);

  async function copyEmail() {
    setCopying(true);
    setCopyStatus('');
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyStatus('Email copied to your clipboard.');
    } catch {
      setCopyStatus('Copy is unavailable. You can select the email address above to copy it manually.');
    } finally {
      setCopying(false);
    }
  }

  return (
    <div className="page-shell contact-shell">
      <PageHeading number="04" label="Contact">
        Good things start<br /><em>with a hello.</em>
      </PageHeading>
      <div className="contact-layout">
        <Reveal className="contact-copy">
          <p>Have a project in mind, an interesting problem, or just want to connect? I’d love to hear from you.</p>
          <a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<Arrow /></a>
          <button className="copy-email" type="button" onClick={copyEmail} disabled={copying}>
            {copying ? 'Copying…' : 'Copy email address'}
          </button>
          <p className="copy-status" role="status" aria-live="polite">{copyStatus}</p>
          <div className="contact-location"><span>{profile.location}</span><span>{profile.role} at {profile.company}</span></div>
        </Reveal>
        <Reveal delay={0.1}>
          <nav className="contact-socials" aria-label="Find me online">
            {socials.map(([name, href]) => (
              <a key={name} className="social-link" href={href} target="_blank" rel="noopener noreferrer"
                aria-label={`${name} (opens in a new tab)`}>{name}<Arrow /></a>
            ))}
          </nav>
        </Reveal>
      </div>
    </div>
  );
}
