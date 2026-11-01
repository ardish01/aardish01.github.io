import { Link } from 'react-router';
import { Arrow, Reveal, ui, useTapPulse } from '../components.jsx';
import { education, experience, profile } from '../data.js';
import portraitSmall from '../../assets/images/aardish-portrait-480.webp';
import portraitLarge from '../../assets/images/aardish-portrait-960.webp';

export default function About() {
  const [tapped, pulse] = useTapPulse();
  return (
    <div id="about" className="mx-auto min-h-[calc(100svh-15rem)] max-w-[1520px] px-pad pt-20 max-[800px]:pt-12">
      <section className="grid min-h-[36rem] grid-cols-[1.25fr_.8fr] items-center gap-[clamp(3rem,8vw,8rem)] pb-16 max-[800px]:min-h-0 max-[800px]:grid-cols-1 max-[800px]:gap-12 max-[800px]:pb-8" aria-labelledby="about-title">
        <Reveal>
          <p className={`${ui.eyebrow} mb-6`}>01 / About me</p>
          <h1 id="about-title" className="mb-7 text-[clamp(2.8rem,5.2vw,5rem)] font-extrabold leading-[1.1] tracking-[-.04em] [word-spacing:0.04em] [&_em]:not-italic [&_em]:text-accent max-[800px]:text-[clamp(2.6rem,8.7vw,4.5rem)]">Curiosity, turned<br />into <em>code.</em></h1>
          <p className="mt-5 text-[1.2rem] leading-[1.9] text-ink">I’m {profile.name} — a developer and data enthusiast based in {profile.location}.</p>
          <p className="mt-5 text-[1.05rem] leading-[1.9] text-muted">I work as a {profile.role.toLowerCase()} at {profile.company} and a data annotator at CloudFactory. Alongside work, I’m pursuing a Bachelor of Computer Applications.</p>
          <p className="mt-5 text-[1.05rem] leading-[1.9] text-muted">For me, technology is a way to make complex things clearer, connect ideas, and build something useful.</p>
          <a className={`${ui.textLink} mt-6`} href="#experience">Explore my journey <Arrow diagonal={false} /></a>
        </Reveal>
        <Reveal className="relative max-[800px]:mx-auto max-[800px]:w-[calc(100%-1rem)] max-[800px]:max-w-[26rem]" delay={0.12}>
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 inset-y-[15%] -z-10 bg-[radial-gradient(ellipse,rgba(95,224,200,.10),transparent_65%)]" />
          <figure onPointerUp={pulse} className={`m-0 rounded-[28px] border border-white/15 glass-strong p-4 transition-transform duration-700 ease-expo pointer-fine:hover:rotate-0 ${tapped ? 'rotate-0 scale-[1.015]' : 'rotate-2'}`}>
            <img className="aspect-[4/5] w-full rounded-xl object-cover" src={portraitLarge} srcSet={`${portraitSmall} 480w, ${portraitLarge} 960w`}
              sizes="(max-width: 800px) 90vw, 26rem" alt="Aardish Duwal wearing sunglasses"
              width="960" height="1152" fetchPriority="high" />
            <figcaption className="flex flex-col gap-[.3rem] px-1 pt-4 pb-1 text-[.8rem]"><span>{profile.name}</span><span className="text-[.72rem] text-muted">{profile.location}</span></figcaption>
          </figure>
        </Reveal>
      </section>

      <section className="scroll-mt-8 py-20 max-[800px]:py-12" id="experience" aria-labelledby="experience-title">
        <Reveal className="mb-10">
          <p className={`${ui.eyebrow} mb-4`}>Putting learning into practice</p>
          <h2 id="experience-title" className="text-[clamp(2.15rem,3.8vw,3.8rem)] font-extrabold leading-[1.15] tracking-[-.04em] [word-spacing:0.04em] [&_em]:not-italic [&_em]:text-accent">Where I <em>work.</em></h2>
          <p className="mt-5 max-w-[44rem] text-[1.1rem] leading-[1.8] text-muted">Two parts of my journey: building for the web and working with data.</p>
        </Reveal>
        <div className="grid grid-cols-2 gap-6 max-[800px]:grid-cols-1 max-[800px]:gap-6">
          {experience.map(({ role, company, status, logo }, index) => (
            <Reveal key={company} delay={index * 0.08}>
              <article className="glass h-full rounded-[22px] border border-line p-9 transition duration-300 ease-expo pointer-fine:hover:-translate-y-1 pointer-fine:hover:border-accent/30 max-[800px]:p-6">
                <div className="mb-8 flex items-center justify-between gap-4">
                  <span className="grid h-13 w-13 place-items-center overflow-hidden rounded-xl border border-accent/30 bg-black/35 p-0 text-base font-extrabold text-accent shadow-[inset_0_1px_0_rgba(255,255,255,.10)]">
                    {logo ? (
                      <img src={logo} alt={`${company} logo`} className="block h-full w-full rounded-[11px] object-cover" width="52" height="52" />
                    ) : (
                      <span aria-hidden="true">{company === 'Nightvision' ? 'N' : 'CF'}</span>
                    )}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[.035] px-[.7rem] py-[.45rem] text-[.72rem] text-muted shadow-[inset_0_1px_0_rgba(255,255,255,.08)]"><i className="h-[.35rem] w-[.35rem] rounded-full bg-accent" />{status}</span>
                </div>
                <h3 className="text-[2rem] tracking-[-.035em]">{company}</h3><p className="mt-[.65rem] mb-6 text-[1.1rem] leading-[1.6] text-muted">{role}</p>
                <span className="font-mono text-[.72rem] tracking-[.08em] text-accent uppercase">{company === 'Nightvision' ? 'Web development' : 'Data annotation'}</span>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-16 grid grid-cols-2 items-center gap-16 border-y border-line py-20 max-[800px]:mt-4 max-[800px]:grid-cols-1 max-[800px]:gap-6 max-[800px]:py-12" aria-labelledby="learning-title">
        <Reveal>
          <span className="mb-6 inline-grid h-14 w-14 place-items-center rounded-[14px] bg-accent/10 font-mono text-[1.3rem] text-accent" aria-hidden="true">&lt;/&gt;</span>
          <p className={`${ui.eyebrow} mb-4`}>A builder’s mindset</p>
          <h2 id="learning-title" className="text-[clamp(2.15rem,3.8vw,3.8rem)] font-extrabold leading-[1.15] tracking-[-.04em] [word-spacing:0.04em] [&_em]:not-italic [&_em]:text-accent">Learning by<br /><em>making things.</em></h2>
        </Reveal>
        <Reveal className="[&>p+p]:mt-5" delay={0.08}>
          <p className="text-[1.2rem] leading-[1.8] text-ink">My interests sit at the intersection of web development, data science, and machine learning.</p>
          <p className="mt-5 text-[1.05rem] leading-[1.9] text-muted">From exploring datasets and predictive models to building web platforms, my projects are a space to put ideas into practice and keep improving.</p>
          <Link className={`${ui.textLink} mt-5`} to="/projects">See what I’m building <Arrow /></Link>
        </Reveal>
      </section>

      <section className="py-20 max-[800px]:py-12" aria-labelledby="education-title">
        <Reveal className="mb-10 text-center">
          <p className={ui.eyebrow}>Education</p>
          <h2 id="education-title" className="mt-4 text-[clamp(2.15rem,3.8vw,3.8rem)] font-extrabold leading-[1.15] tracking-[-.04em] [word-spacing:0.04em] [&_em]:not-italic [&_em]:text-accent">The foundation.<br /><em>The next chapter.</em></h2>
          <p className="mx-auto mt-5 max-w-[44rem] text-[1.1rem] leading-[1.8] text-muted">A continuing journey through learning, curiosity, and computer science.</p>
        </Reveal>
        <ol className="relative mx-auto mt-12 max-w-[70rem] list-none p-0 pt-4 before:absolute before:top-8 before:bottom-12 before:left-[35%] before:w-px before:bg-[linear-gradient(var(--color-accent),var(--color-line))] max-[800px]:before:left-[.4rem]">
          {education.map(({ qualification, school, status, label }, index) => (
            <li className="mb-8" key={school}>
              <Reveal className="relative grid grid-cols-[35%_65%] items-center max-[800px]:grid-cols-1 max-[800px]:gap-4 max-[800px]:pl-8" delay={index * 0.06}>
                <span className="absolute top-1/2 left-[35%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[linear-gradient(160deg,var(--color-accent-bright),var(--color-accent-deep))] shadow-[0_0_0_6px_rgba(95,224,200,.14),0_0_22px_rgba(95,224,200,.4)] max-[800px]:top-4 max-[800px]:left-[.4rem]" aria-hidden="true" />
                <div className="flex flex-col gap-[.7rem] pr-8 max-[800px]:gap-1 max-[800px]:pr-0"><span className={`${ui.eyebrow} text-[.75rem]`}>{label}</span><span className="text-[.95rem] text-muted">{status}</span></div>
                <article className="glass relative ml-10 rounded-[18px] border border-line p-10 max-[800px]:ml-0 max-[800px]:p-6"><span className="mb-4 block font-mono text-[.75rem] text-accent" aria-hidden="true">0{index + 1}</span><h3 className="text-[1.3rem] font-semibold leading-[1.5]">{qualification}</h3><p className="mt-3 text-[1.05rem] leading-[1.6] text-muted">{school}</p></article>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <Reveal className="mt-8 mb-20 rounded-[26px] border border-accent/30 bg-[radial-gradient(ellipse_at_top,rgba(95,224,200,.14),transparent_72%),linear-gradient(158deg,rgba(255,255,255,.075),rgba(255,255,255,.018)_46%,rgba(95,224,200,.05))] px-6 py-16 text-center shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_30px_70px_-40px_rgba(0,0,0,.95)] max-[800px]:mb-12">
        <p className={ui.eyebrow}>Keep the conversation going</p>
        <h2 className="my-5 text-[clamp(2.15rem,3.8vw,3.8rem)] font-extrabold leading-[1.15] tracking-[-.04em] [word-spacing:0.04em] [&_em]:not-italic [&_em]:text-accent">Have something<br /><em>in mind?</em></h2>
        <p className="mb-8 leading-[1.8] text-muted">A project, an idea, or just a hello. I’d love to connect.</p>
        <Link className={ui.primaryButton} to="/contact">Get in touch <Arrow className="text-[1.3rem]" /></Link>
      </Reveal>
    </div>
  );
}
