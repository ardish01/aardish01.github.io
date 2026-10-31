import { useState } from 'react';
import { Arrow, PageHeading, Reveal } from '../components.jsx';
import { profile, socials } from '../data.js';

async function copyToClipboard(text) {
  if (window.isSecureContext && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the legacy path when permission is denied.
    }
  }
  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0';
  document.body.appendChild(field);
  field.select();
  field.setSelectionRange(0, text.length);
  let copied = false;
  try { copied = document.execCommand('copy'); } catch { copied = false; }
  field.remove();
  return copied;
}

export default function Contact() {
  const [copyStatus, setCopyStatus] = useState('');
  const [copying, setCopying] = useState(false);

  async function copyEmail() {
    setCopying(true);
    setCopyStatus('');
    try {
      const copied = await copyToClipboard(profile.email);
      setCopyStatus(copied
        ? 'Email copied to your clipboard.'
        : 'Copy is blocked by your browser. Tap the email address to open your mail app instead.');
    } finally {
      setCopying(false);
    }
  }

  return (
    <div className="mx-auto min-h-[calc(100svh-15rem)] max-w-[1440px] px-pad pt-20 max-[800px]:pt-12">
      <PageHeading number="04" label="Contact">
        Good things<br /><em>start with a hello.</em>
      </PageHeading>
      <div className="grid grid-cols-[1.5fr_.8fr] items-start gap-20 pb-20 max-[1000px]:gap-8 max-[800px]:grid-cols-1 max-[800px]:gap-10">
        <Reveal>
          <p className="max-w-[30rem] leading-[1.8] text-muted">Have a project in mind, an interesting problem, or just want to connect? I’d love to hear from you.</p>
          <a className="flex items-center justify-between gap-4 border-b border-line py-7 text-[clamp(1.1rem,2.5vw,2rem)] tracking-[-.03em] text-accent" href={`mailto:${profile.email}`}>{profile.email}<Arrow /></a>
          <button className="glass mt-6 min-h-11 rounded-[10px] border border-line px-4 py-[.8rem] font-mono text-[.7rem]" type="button" onClick={copyEmail} disabled={copying}>
            {copying ? 'Copying…' : 'Copy email address'}
          </button>
          <p className="mt-3 min-h-6 text-[.8rem] text-muted" role="status" aria-live="polite">{copyStatus}</p>
          <div className="mt-12 flex flex-wrap gap-4 font-mono text-[.65rem] text-muted uppercase max-[800px]:mt-8"><span>{profile.location}</span><span>{profile.role} at {profile.company}</span></div>
        </Reveal>
        <Reveal delay={0.1}>
          <nav className="border-t border-line" aria-label="Find me online">
            {socials.map(([name, href]) => (
              <a key={name} className="flex items-center justify-between border-b border-line py-5 text-[.9rem] transition duration-300 hover:text-accent pointer-fine:hover:pl-2" href={href} target="_blank" rel="noopener noreferrer"
                aria-label={`${name} (opens in a new tab)`}>{name}<Arrow /></a>
            ))}
          </nav>
        </Reveal>
      </div>
    </div>
  );
}
