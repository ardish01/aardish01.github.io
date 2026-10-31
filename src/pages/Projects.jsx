import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Arrow, NextPage, PageHeading } from '../components.jsx';
import { projects } from '../data.js';

const categories = ['All projects', ...new Set(projects.map((project) => project.category))];

export default function Projects() {
  const [category, setCategory] = useState('All projects');
  const reduced = useReducedMotion();
  const visibleProjects = projects.filter((project) => category === 'All projects' || project.category === category);

  return (
    <div className="mx-auto min-h-[calc(100svh-15rem)] max-w-[1440px] px-pad pt-20 max-[800px]:pt-12">
      <PageHeading number="02" label="Selected work"
        description="A collection of web platforms, predictive models, and data explorations. Built to turn an interesting problem into something useful.">
        Ideas, put<br /><em>into practice.</em>
      </PageHeading>
      <section aria-label="Project collection">
        <div className="mb-4 flex items-center justify-between gap-6 border-b border-line pb-7 max-[800px]:flex-col max-[800px]:items-start">
          <div className="flex flex-wrap gap-2 max-[560px]:grid max-[560px]:w-full max-[560px]:grid-cols-2 max-[560px]:gap-2" role="group" aria-label="Filter projects by category">
            {categories.map((item) => (
              <button key={item} type="button" aria-pressed={category === item} aria-controls="project-grid" onClick={() => setCategory(item)}
                className="min-h-11 rounded-[2rem] border border-line bg-white/[.035] px-4 py-[.65rem] text-[.75rem] transition duration-200 hover:border-accent/30 aria-pressed:border-white/30 aria-pressed:bg-[linear-gradient(180deg,var(--color-accent-bright),var(--color-accent)_55%,var(--color-accent-deep))] aria-pressed:text-[#04100e] aria-pressed:shadow-[inset_0_1px_0_rgba(255,255,255,.6),0_10px_24px_-14px_rgba(95,224,200,.7)] max-[560px]:w-full max-[400px]:text-[.7rem]">{item}</button>
            ))}
          </div>
          <p className="font-mono text-[.65rem] whitespace-nowrap text-muted max-[800px]:text-[.7rem]" role="status" aria-live="polite">
            {visibleProjects.length} of {projects.length} projects
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 pt-4 max-[800px]:grid-cols-1" id="project-grid">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleProjects.map((project) => (
              <motion.article key={project.repo} className="glass relative flex flex-col rounded-[20px] border border-line p-8 transition duration-300 hover:border-accent/30 pointer-fine:hover:-translate-y-1 max-[800px]:p-6 max-[400px]:p-5" layout={!reduced}
                initial={{ opacity: 0, y: reduced ? 0 : 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -8 }}
                transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}>
                <div className="flex items-center justify-between gap-4 font-mono text-[.65rem] leading-[1.5] text-muted uppercase">
                  <span className="text-accent">{String(projects.indexOf(project) + 1).padStart(2, '0')}</span>
                  <span>{project.category}</span>
                </div>
                <h2 className="mt-8 mb-4 text-[clamp(1.6rem,2.5vw,2.5rem)] font-medium tracking-[-.04em]">{project.title}</h2>
                <p className="text-[.9rem] leading-[1.8] text-muted">{project.description}</p>
                <p className="my-6 font-mono text-[.65rem] leading-[1.8] text-muted max-[800px]:text-[.7rem]">{project.stack}</p>
                <a className="mt-auto flex min-h-11 items-center justify-between gap-4 border-t border-line pt-4 text-[.8rem] hover:text-accent" href={`https://github.com/ardish01/${project.repo}`}
                  target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} on GitHub (opens in a new tab)`}>
                  View on GitHub <Arrow className="text-[1.3rem] text-accent" />
                </a>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </section>
      <NextPage to="/capabilities" label="The tools behind the work" number="03" />
    </div>
  );
}
