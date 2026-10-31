import { NextPage, PageHeading, Reveal, ui } from '../components.jsx';

const capabilities = [
  { title: 'Data & analytics', skills: ['Python', 'Pandas', 'NumPy', 'SQL', 'Power BI', 'Excel', 'Plotly'] },
  { title: 'Machine learning', skills: ['Scikit-learn', 'Regression', 'Decision trees', 'TF-IDF', 'Predictive analytics'] },
  { title: 'Web development', skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'PHP', 'MySQL', 'PostgreSQL', 'Streamlit'] },
  { title: 'Human skills', skills: ['Communication', 'Collaboration', 'Public speaking', 'Problem solving'] },
  { title: 'Languages', skills: ['Nepali — Native', 'English — Proficient'] },
];

export default function Capabilities() {
  return (
    <div className="mx-auto min-h-[calc(100svh-15rem)] max-w-[1440px] px-pad pt-20 max-[800px]:pt-12">
      <PageHeading number="03" label="Capabilities"
        description="A practical toolkit for exploring data, building applications, and working through problems together.">
        The tools behind<br /><em>the work.</em>
      </PageHeading>
      <section className="border-t border-line" aria-label="Skills and tools">
        {capabilities.map(({ title, skills }, index) => (
          <Reveal className="grid grid-cols-[4rem_1fr] gap-4 border-b border-line py-10 max-[400px]:grid-cols-[2rem_1fr]" key={title}>
            <span className="pt-2 font-mono text-[.7rem] text-accent" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <div className="grid grid-cols-[1fr_1.2fr] items-start gap-8 max-[1000px]:grid-cols-1 max-[1000px]:gap-6">
              <h2 className="text-[clamp(1.5rem,3vw,2.6rem)] font-medium tracking-[-.04em]">{title}</h2>
              <div className="flex flex-wrap gap-[.6rem]">{skills.map((skill) => <span className="rounded-lg border border-line bg-white/[.045] px-[.85rem] py-[.65rem] font-mono text-[.7rem] leading-[1.5] text-[#cfe0dc] shadow-[inset_0_1px_0_rgba(255,255,255,.09)]" key={skill}>{skill}</span>)}</div>
            </div>
          </Reveal>
        ))}
      </section>
      <NextPage to="/contact" label="Let’s talk" number="04" />
    </div>
  );
}
