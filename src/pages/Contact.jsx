import { useState } from 'react';
import { Arrow, PageHeading, Reveal } from '../components.jsx';
import { profile, socials } from '../data.js';

async function copyToClipboard(text) {
  // Use a simple approach that works both server and client
  // On server, this won't be called anyway (no clipboard)
  const isSecureContext = typeof window !== 'undefined' && window.isSecureContext;
  if (isSecureContext && navigator.clipboard?.writeText) {
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
        ? 'Copied!'
        : 'Copy is blocked by your browser. Tap the email address to open your mail app instead.');
    } finally {
      setCopying(false);
    }
  }

  return (
    <div id="contact" className="mx-auto min-h-[calc(100svh-15rem)] max-w-[1440px] px-pad pt-20 max-[800px]:pt-12 max-md:pt-6">
      <PageHeading number="04" label="Contact">
        Good things<br /><em>start with a hello.</em>
      </PageHeading>
      <div className="grid grid-cols-[1.5fr_.8fr] items-start gap-20 pb-20 max-[1000px]:gap-8 max-[800px]:grid-cols-1 max-[800px]:gap-10">
        <Reveal>
          <p className="max-w-[30rem] leading-[1.8] text-muted">Have a project in mind, an interesting problem, or just want to connect? I’d love to hear from you.</p>
          <div className="mt-6 max-md:mt-6 max-md:rounded-2xl max-md:border max-md:border-line max-md:bg-white/[.03] max-md:p-4">
            <a className="flex min-h-[52px] items-center justify-between gap-4 border-b border-line py-7 text-[clamp(1.1rem,2.5vw,2rem)] tracking-[-.03em] text-accent max-md:min-h-[52px] max-md:gap-2 max-md:py-2 max-md:text-[1.05rem]" href={`mailto:${profile.email}`}>{profile.email}<Arrow /></a>
            <button className="glass mt-6 min-h-11 rounded-[10px] border border-line px-4 py-[.8rem] font-mono text-[.7rem] max-md:mt-3 max-md:min-h-[52px] max-md:w-full max-md:rounded-xl max-md:px-4 max-md:py-3 max-md:text-[.75rem]" type="button" onClick={copyEmail} disabled={copying}>
              {copying ? 'Copying…' : 'Copy email'}
            </button>
            {copyStatus && <p className={`mt-3 text-[.8rem] ${copyStatus === 'Copied!' ? 'text-accent' : 'text-muted'}`} role="status" aria-live="polite">{copyStatus}</p>}
          </div>
          <div className="mt-12 flex flex-wrap gap-4 font-mono text-[.65rem] text-muted uppercase max-[800px]:mt-8"><span>{profile.location}</span><span>{profile.role} at {profile.company}</span></div>
        </Reveal>
        <Reveal delay={0.1}>
          <nav className="border-t border-line max-md:grid max-md:grid-cols-2 max-md:gap-2 max-md:border-t-0" aria-label="Find me online">
            {socials.map(([name, href]) => (
              <a key={name} className="flex items-center justify-between border-b border-line py-5 text-[.9rem] transition duration-300 hover:text-accent pointer-fine:hover:pl-2 max-md:min-h-11 max-md:rounded-xl max-md:border max-md:border-line max-md:bg-white/[.03] max-md:px-3 max-md:py-0 max-md:text-[.85rem] max-md:last:col-span-2" href={href} target="_blank" rel="noopener noreferrer"
                aria-label={`${name} (opens in a new tab)`}>{name}<Arrow /></a>
            ))}
          </nav>
        </Reveal>
      </div>
    </div>
  );
}
