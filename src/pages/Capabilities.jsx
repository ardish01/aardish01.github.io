import { NextPage, PageHeading, Reveal } from '../components.jsx';

const capabilities = [
  { title: 'Data & analytics', skills: ['Python', 'Pandas', 'NumPy', 'SQL', 'Power BI', 'Excel', 'Plotly'] },
  { title: 'Machine learning', skills: ['Scikit-learn', 'Regression', 'Decision trees', 'TF-IDF', 'Predictive analytics'] },
  { title: 'Web development', skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'PHP', 'MySQL', 'PostgreSQL', 'Streamlit'] },
  { title: 'Human skills', skills: ['Communication', 'Collaboration', 'Public speaking', 'Problem solving'] },
  { title: 'Languages', skills: ['Nepali — Native', 'English — Proficient'] },
];

export default function Capabilities() {
  return (
    <div id="capabilities" className="mx-auto min-h-[calc(100svh-15rem)] max-w-[1440px] px-pad pt-20 max-[800px]:pt-12 max-md:pt-6">
      <PageHeading number="03" label="Capabilities"
        description="A practical toolkit for exploring data, building applications, and working through problems together.">
        The tools behind<br /><em>the work.</em>
      </PageHeading>
      <section className="border-t border-line max-md:flex max-md:flex-col max-md:gap-4 max-md:border-t-0" aria-label="Skills and tools">
        {capabilities.map(({ title, skills }, index) => (
          <Reveal className="grid grid-cols-[4rem_1fr] gap-4 border-b border-line py-10 max-md:grid-cols-1 max-md:gap-2 max-md:rounded-2xl max-md:border max-md:bg-white/[.025] max-md:p-4 max-md:py-4 max-md:shadow-[inset_0_1px_0_rgba(255,255,255,.06)]" key={title}>
            <span className="pt-2 font-mono text-[.7rem] text-accent max-md:pt-0" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <div className="grid grid-cols-[1fr_1.2fr] items-start gap-8 max-[1000px]:grid-cols-1 max-[1000px]:gap-6 max-md:gap-2">
              <h2 className="text-[clamp(1.5rem,3vw,2.6rem)] font-medium tracking-[-.04em] max-md:text-[1.25rem] max-md:font-semibold max-md:leading-[1.3]">{title}</h2>
              <div className="flex flex-wrap gap-[.6rem] max-md:gap-1.5">{skills.map((skill) => <span className="rounded-lg border border-line bg-white/[.045] px-[.85rem] py-[.65rem] font-mono text-[.7rem] leading-[1.5] text-[#cfe0dc] shadow-[inset_0_1px_0_rgba(255,255,255,.09)] max-md:px-2.5 max-md:py-1.5 max-md:text-[.72rem]" key={skill}>{skill}</span>)}</div>
            </div>
          </Reveal>
        ))}
      </section>
      <NextPage to="/contact" label="Let’s talk" number="04" />
    </div>
  );
}
