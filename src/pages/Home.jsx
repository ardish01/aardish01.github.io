import { Link } from 'react-router';
import { Arrow, Reveal, ui } from '../components.jsx';
import { profile } from '../data.js';
import portraitSmall from '../../assets/images/aardish-portrait-480.webp';
import portraitLarge from '../../assets/images/aardish-portrait-960.webp';

export default function Home() {
  return (
    <div className="mx-auto min-[1600px]:max-w-[1600px]">
      <section className="grid min-h-[min(820px,calc(100svh-6rem))] grid-cols-[1.15fr_.85fr] items-center gap-12 px-pad pt-20 pb-16 max-[1000px]:gap-8 max-[800px]:min-h-0 max-[800px]:grid-cols-1 max-[800px]:pt-12 max-[800px]:pb-10" aria-labelledby="hero-title">
        <Reveal className="relative z-[2]">
          <h1 id="hero-title" className="mb-7 text-[clamp(3.25rem,6.6vw,7rem)] font-extrabold leading-[1.1] tracking-[-.055em] max-[1000px]:text-[clamp(3rem,6.6vw,6rem)] max-[800px]:text-[clamp(3.2rem,10vw,5.7rem)] max-[400px]:text-[3rem]">
            <span className="block">Aardish</span><span className="block"><em className="not-italic text-accent">Duwal.</em></span>
          </h1>
          <p className="max-w-[32rem] text-base leading-[1.8] text-muted">
            Building for the web. Exploring what data can do.
            {' '}I’m a {profile.role.toLowerCase()} at {profile.company} and a data annotator at CloudFactory,
            with a curiosity for machine learning and making complex things feel simple.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-7 max-[400px]:gap-4">
            <Link className={ui.primaryButton} to="/projects">Explore my work <Arrow className="text-[1.3rem]" /></Link>
            <Link className={ui.textLink} to="/about">A little about me <Arrow diagonal={false} /></Link>
          </div>
        </Reveal>
        <Reveal className="relative w-full max-w-[30rem] justify-self-end max-[800px]:mx-auto max-[800px]:w-[min(84%,24rem)] max-[800px]:justify-self-center max-[400px]:w-[90%]" delay={0.12}>
          <figure className="m-0">
            <div className="group relative aspect-[4/4.8] overflow-hidden rounded-[26px] border border-white/15 bg-[linear-gradient(158deg,rgba(255,255,255,.10),rgba(255,255,255,.03)_50%,rgba(95,224,200,.06))] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_40px_80px_-40px_rgba(0,0,0,.95),0_0_70px_-24px_rgba(95,224,200,.20)]">
              <img className="h-full w-full rounded-[17px] object-cover object-[center_28%] transition-transform duration-1000 ease-expo pointer-fine:group-hover:scale-[1.04]"
                src={portraitLarge} srcSet={`${portraitSmall} 480w, ${portraitLarge} 960w`}
                sizes="(max-width: 800px) 80vw, 30rem" alt="Black-and-white portrait of Aardish Duwal wearing sunglasses"
                width="960" height="1152" fetchPriority="high" />
            </div>
            <figcaption className="mt-4 flex justify-between gap-4 font-mono text-[.6rem] uppercase text-muted max-[800px]:text-[.7rem]">
              <span>Based in {profile.location}</span><span>01 / Portrait</span>
            </figcaption>
            <span className="absolute -left-9 bottom-14 grid h-24 w-24 -rotate-12 place-items-center rounded-full border-[6px] border-bg bg-[linear-gradient(160deg,var(--color-accent-bright),var(--color-accent)_55%,var(--color-accent-deep))] p-3 text-center font-mono text-[.65rem] leading-[1.4] text-[#04100e] shadow-[inset_0_1px_0_rgba(255,255,255,.65),0_14px_30px_-14px_rgba(95,224,200,.55)] max-[400px]:-left-5 max-[400px]:h-20 max-[400px]:w-20 max-[400px]:text-[.55rem]" aria-hidden="true">Think.<br />Build.<br />Repeat.</span>
          </figure>
        </Reveal>
      </section>
      <Reveal className="mx-pad flex items-center justify-between gap-8 border-t border-line py-7 font-mono text-[.65rem] leading-[1.8] uppercase tracking-[.07em] text-muted max-[800px]:flex-col max-[800px]:items-start max-[800px]:gap-3 max-[800px]:text-[.7rem]" delay={0.2}>
        <span className="text-ink">A developer with a data-driven curiosity.</span>
        <span>Web development / Data / Machine learning</span>
      </Reveal>
    </div>
  );
}
