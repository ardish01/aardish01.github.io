import { Link } from 'react-router';
import { Arrow, Reveal, ui, useTapPulse } from '../components.jsx';
import { profile } from '../data.js';
import portraitSmall from '../../assets/images/aardish-portrait-480.webp';
import portraitLarge from '../../assets/images/aardish-portrait-960.webp';

export default function Home() {
  const [tapped, pulse] = useTapPulse();
  return (
    <div className="mx-auto min-[1600px]:max-w-[1600px]">
      <section className="grid min-h-[min(820px,calc(100svh-6rem))] grid-cols-[1.15fr_.85fr] items-center gap-12 px-pad pt-20 pb-16 max-[1000px]:gap-8 max-[800px]:min-h-0 max-[800px]:grid-cols-1 max-[800px]:pt-12 max-[800px]:pb-10" aria-labelledby="hero-title">
        <Reveal className="relative z-[2]">
          <h1 id="hero-title" className="mb-7 text-[clamp(3.25rem,6.6vw,7rem)] font-extrabold leading-[1.1] tracking-[-.04em] [word-spacing:0.04em] max-[1000px]:text-[clamp(3rem,6.6vw,6rem)] max-[800px]:text-[clamp(3.2rem,10vw,5.7rem)] max-[400px]:text-[3rem]">
            <span className="block">Aardish</span><span className="block"><em className="not-italic text-accent">Duwal.</em></span>
          </h1>
          <div className="max-w-[32rem]">
            <p className="text-[clamp(1.75rem,2.6vw,2.5rem)] font-bold leading-[1.2] tracking-[-.02em] text-ink max-md:text-[clamp(2.25rem,8vw,3.25rem)] max-md:leading-[1.08] max-md:tracking-[-.03em] max-md:text-balance">Building for the web. Exploring what data can do.</p>
            <p className="mt-4 text-base leading-[1.8] text-muted max-md:mt-3 max-md:max-w-[38ch] max-md:leading-[1.6] max-md:text-pretty">I’m a {profile.role.toLowerCase()} at {profile.company} and a data annotator at CloudFactory, with a curiosity for machine learning and making complex things feel simple.</p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-7 max-md:mt-7 max-md:flex-col max-md:items-stretch max-md:gap-3">
            <Link className={`${ui.primaryButton} max-md:w-full`} to="/projects">Explore my work <Arrow className="text-[1.3rem]" /></Link>
            <Link className={`${ui.textLink} max-md:w-full max-md:min-h-12 max-md:justify-center max-md:rounded-full max-md:border max-md:border-line max-md:bg-white/[.035] max-md:px-6 max-md:py-3 max-md:text-ink max-md:shadow-[inset_0_1px_0_rgba(255,255,255,.08)]`} to="/about">A little about me <Arrow diagonal={false} /></Link>
          </div>
        </Reveal>
        <Reveal className="relative w-full max-w-[30rem] justify-self-end max-[800px]:mx-0 max-[800px]:w-full max-[800px]:justify-self-start" delay={0.12}>
          <figure className="relative m-0">
            <div onPointerUp={pulse} className="group relative aspect-[4/4.8] overflow-hidden rounded-[26px] border border-white/15 max-md:aspect-[4/5] max-md:rounded-xl">
              <img className={`h-full w-full rounded-[17px] object-cover object-[center_28%] max-md:rounded-xl ${tapped ? 'scale-[1.05]' : ''}`}
                src={portraitLarge} srcSet={`${portraitSmall} 480w, ${portraitLarge} 960w`}
                sizes="(max-width: 800px) 80vw, 30rem" alt="Black-and-white portrait of Aardish Duwal wearing sunglasses"
                width="960" height="1152" fetchPriority="high" />
            </div>
            <figcaption className="mt-4 flex justify-between gap-4 font-mono text-[.72rem] uppercase text-muted max-[800px]:text-[.7rem] max-md:pointer-events-none max-md:absolute max-md:inset-x-0 max-md:bottom-0 max-md:z-10 max-md:mt-0 max-md:items-center max-md:rounded-b-xl max-md:bg-black/45 max-md:px-3 max-md:py-3 max-md:text-[.72rem] max-md:text-white/85 max-md:backdrop-blur-[8px]">
              <span>Based in {profile.location}</span><span>Portrait</span>
            </figcaption>
            <span className="absolute -left-9 bottom-24 max-md:bottom-20 grid h-24 w-24 -rotate-12 place-items-center rounded-full border-[6px] border-bg bg-[linear-gradient(160deg,var(--color-accent-bright),var(--color-accent)_55%,var(--color-accent-deep))] p-3 text-center font-mono text-[.72rem] leading-[1.4] text-[#04100e] shadow-[inset_0_1px_0_rgba(255,255,255,.65),0_14px_30px_-14px_rgba(95,224,200,.55)] max-[400px]:-left-5 max-[400px]:h-20 max-[400px]:w-20 max-[400px]:text-[.72rem]" aria-hidden="true">Think.<br />Build.<br />Repeat.</span>
          </figure>
        </Reveal>
      </section>
      <Reveal className="mx-pad flex items-center justify-between gap-8 border-t border-line py-7 font-mono text-[.72rem] leading-[1.8] uppercase tracking-[.07em] text-muted max-[800px]:flex-col max-[800px]:items-start max-[800px]:gap-3 max-[800px]:text-[.7rem]" delay={0.2}>
        <span className="text-ink">A developer with a data-driven curiosity.</span>
        <span>Web development / Data / Machine learning</span>
      </Reveal>
    </div>
  );
}
