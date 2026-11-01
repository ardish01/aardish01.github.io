import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Arrow, ExternalIcon, GitHubIcon, NextPage, PageHeading, useMediaQuery } from '../components.jsx';
import { projects } from '../data.js';

const categories = ['All projects', ...new Set(projects.map((project) => project.category))];

function CoverArt({ category }) {
  if (category === 'Web development') {
    return (
      <div className="absolute inset-x-[15%] top-[31%] bottom-[27%] rounded-md border border-white/10 bg-white/[.035] p-2">
        <div className="mb-1.5 flex gap-1">
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <span className="h-1 w-1 rounded-full bg-white/15" />
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <div className="space-y-1" key={i}>
              <div className={`h-3 rounded-[2px] ${i === 0 ? 'bg-accent/30' : 'bg-white/10'}`} />
              <div className="h-1 w-2/3 rounded-[1px] bg-white/15" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (category === 'Machine learning') {
    return (
      <svg className="absolute inset-x-[14%] top-[27%] h-[40%] w-[72%] text-accent" viewBox="0 0 100 40" fill="none" aria-hidden="true">
        <path d="M0 33h100M0 20h100M0 7h100" stroke="currentColor" strokeOpacity=".12" />
        <path d="M2 31 14 26 26 28 38 19 50 22 62 12 74 15 86 7 98 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {[[2, 31], [38, 19], [62, 12], [98, 10]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="1.6" fill="currentColor" />)}
      </svg>
    );
  }
  return (
    <div className="absolute inset-x-[15%] top-[32%] bottom-[26%] flex items-end gap-1.5" aria-hidden="true">
      {[42, 68, 50, 82, 58, 92, 74].map((height, index) => (
        <span className={`flex-1 rounded-t-[2px] ${index === 5 ? 'bg-accent/60' : 'bg-accent/20'}`} style={{ height: `${height}%` }} key={index} />
      ))}
    </div>
  );
}

function ProjectCover({ index, category }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] border border-white/10 bg-[radial-gradient(circle_at_18%_15%,rgba(95,224,200,.20),transparent_55%),linear-gradient(145deg,#0b1917,#07100f_60%,#0a1416)]">
      <span className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
      <span className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:28px_28px]" />
      <span className="absolute -right-2 -bottom-4 text-[5rem] font-extrabold leading-none tracking-[-.08em] text-white/[.06]">{index}</span>
      <span className="absolute top-4 left-4 font-mono text-[.6rem] uppercase tracking-[.14em] text-accent/85">{category}</span>
      <CoverArt category={category} />
      <span className="absolute bottom-4 left-4 flex items-center gap-2">
        <i className="h-px w-8 bg-accent/70" />
        <span className="font-mono text-[.72rem] uppercase tracking-[.16em] text-white/50">Selected work</span>
      </span>
    </div>
  );
}

export default function Projects() {
  const [category, setCategory] = useState('All projects');
  const reduced = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const visibleProjects = projects.filter((project) => category === 'All projects' || project.category === category);

  return (
    <div id="projects" className="mx-auto min-h-[calc(100svh-15rem)] max-w-[1440px] px-pad pt-20 max-[800px]:pt-12 max-md:pt-6">
      <PageHeading number="02" label="Selected work"
        description="A collection of web platforms, predictive models, and data explorations. Built to turn an interesting problem into something useful.">
        Ideas, put<br /><em>into practice.</em>
      </PageHeading>
      <section aria-label="Project collection">
        <div className="mb-4 flex items-center justify-between gap-6 border-b border-line pb-7 max-[800px]:flex-col max-[800px]:items-start">
          <div className="flex flex-wrap gap-2 max-[560px]:grid max-[560px]:w-full max-[560px]:grid-cols-2 max-[560px]:gap-2" role="group" aria-label="Filter projects by category">
            {categories.map((item) => (
              <button key={item} type="button" aria-pressed={category === item} aria-controls="project-grid" onClick={() => setCategory(item)}
                className="min-h-11 rounded-[2rem] border border-line bg-white/[.035] px-4 py-[.65rem] text-[.75rem] transition duration-200 hover:border-accent/30 aria-pressed:border-white/30 aria-pressed:bg-[linear-gradient(180deg,var(--color-accent-bright),var(--color-accent)_55%,var(--color-accent-deep))] aria-pressed:text-[#04100e] aria-pressed:shadow-[inset_0_1px_0_rgba(255,255,255,.6),0_10px_24px_-14px_rgba(95,224,200,.7)] max-[560px]:w-full max-[400px]:text-[.72rem]">{item}</button>
            ))}
          </div>
          <p className="font-mono text-[.72rem] whitespace-nowrap text-muted max-[800px]:text-[.72rem]" role="status" aria-live="polite">
            {visibleProjects.length} of {projects.length} projects
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 pt-4 max-[800px]:grid-cols-1" id="project-grid">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleProjects.map((project) => (
              <motion.article key={project.repo} className="glass relative flex flex-col rounded-[20px] border border-line p-8 transition duration-300 hover:border-accent/30 pointer-fine:hover:-translate-y-1 max-[800px]:p-6 max-[400px]:p-5" layout={!reduced}
                initial={isMobile ? false : { opacity: 0, y: reduced ? 0 : 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -8 }}
                transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}>
                <div className="aspect-[16/10] overflow-hidden rounded-[10px] border border-white/10 mb-6" aria-hidden="true">
                  {project.image ? (
                    <img className="h-full w-full object-cover" src={project.image} alt="" loading="lazy" width="800" height="500" />
                  ) : (
                    <ProjectCover index={String(projects.indexOf(project) + 1).padStart(2, '0')} category={project.category} />
                  )}
                </div>
                <div className="flex items-center justify-between gap-4 font-mono text-[.72rem] leading-[1.5] text-muted uppercase max-md:sr-only">
                  <span className="text-accent">{String(projects.indexOf(project) + 1).padStart(2, '0')}</span>
                  <span>{project.category}</span>
                </div>
                <div className="mt-8 mb-4 flex items-start justify-between gap-3 max-md:mt-4 max-md:mb-2">
                  <h2 className="text-[clamp(1.6rem,2.5vw,2.5rem)] font-medium tracking-[-.04em] max-md:text-[1.25rem] max-md:font-bold max-md:leading-[1.3] max-md:tracking-[-.02em]">{project.title}</h2>
                  <div className="hidden shrink-0 items-center gap-1 max-md:flex">
                    <a className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white/[.04] text-muted transition hover:border-accent/40 hover:text-accent" href={`https://github.com/ardish01/${project.repo}`} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} on GitHub (opens in a new tab)`}>
                      <GitHubIcon className="h-[18px] w-[18px]" />
                    </a>
                    {project.demo && (
                      <a className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white/[.04] text-muted transition hover:border-accent/40 hover:text-accent" href={project.demo} target="_blank" rel="noopener noreferrer" aria-label={`Open the ${project.title} live demo (opens in a new tab)`}>
                        <ExternalIcon className="h-[18px] w-[18px]" />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-[.9rem] leading-[1.8] text-muted max-md:line-clamp-3 max-md:text-[.95rem] max-md:leading-[1.55]">{project.description}</p>
                <p className="my-6 font-mono text-[.72rem] leading-[1.8] text-muted max-[800px]:text-[.72rem] max-md:hidden">{project.stack}</p>
                <div className="mt-4 hidden flex-wrap gap-1.5 max-md:flex" aria-label={`${project.title} tech stack`}>
                  {project.stack.split(' · ').map((tag) => (
                    <span className="rounded-md border border-line bg-white/[.04] px-2.5 py-1 font-mono text-[.75rem] leading-none text-[#cfe0dc]" key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="mt-auto flex min-h-11 items-center gap-6 border-t border-line pt-4 text-[.8rem] max-md:hidden">
                  <a className="inline-flex items-center gap-2 hover:text-accent transition-colors max-md:hidden" href={`https://github.com/ardish01/${project.repo}`}
                    target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} on GitHub (opens in a new tab)`}>
                    View on GitHub <Arrow className="text-[1.1rem] text-accent" />
                  </a>
                  {project.demo && (
                    <a className="inline-flex items-center gap-1.5 text-accent hover:text-accent-bright transition-colors" href={project.demo}
                      target="_blank" rel="noopener noreferrer" aria-label={`Open the ${project.title} live demo (opens in a new tab)`}>
                      Live demo <ExternalIcon className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </section>
      <NextPage to="/capabilities" label="The tools behind the work" number="03" />
    </div>
  );
}
