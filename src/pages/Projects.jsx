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
    <div className="page-shell">
      <PageHeading number="02" label="Selected work"
        description="A collection of web platforms, predictive models, and data explorations. Built to turn an interesting problem into something useful.">
        Ideas, put<br /><em>into practice.</em>
      </PageHeading>
      <section aria-label="Project collection">
        <div className="project-toolbar">
          <div className="project-filters" role="group" aria-label="Filter projects by category">
            {categories.map((item) => (
              <button key={item} type="button" aria-pressed={category === item}
                aria-controls="project-grid" onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>
          <p className="project-count" role="status" aria-live="polite">
            {visibleProjects.length} of {projects.length} projects
          </p>
        </div>
        <div className="project-grid" id="project-grid">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleProjects.map((project) => (
              <motion.article key={project.repo} className="project-card" layout={!reduced}
                initial={{ opacity: 0, y: reduced ? 0 : 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -8 }}
                transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}>
                <div className="project-topline">
                  <span className="project-number">{String(projects.indexOf(project) + 1).padStart(2, '0')}</span>
                  <span className="project-category">{project.category}</span>
                </div>
                <h2>{project.title}</h2>
                <p className="project-description">{project.description}</p>
                <p className="project-stack">{project.stack}</p>
                <a className="project-repo" href={`https://github.com/ardish01/${project.repo}`}
                  target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} on GitHub (opens in a new tab)`}>
                  View on GitHub <Arrow />
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
