import { NextPage, PageHeading, Reveal } from '../components.jsx';

const capabilities = [
  { title: 'Data & analytics', skills: ['Python', 'Pandas', 'NumPy', 'SQL', 'Power BI', 'Excel', 'Plotly'] },
  { title: 'Machine learning', skills: ['Scikit-learn', 'Regression', 'Decision trees', 'TF-IDF', 'Predictive analytics'] },
  { title: 'Web development', skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'PHP', 'MySQL', 'Streamlit'] },
  { title: 'Human skills', skills: ['Communication', 'Collaboration', 'Public speaking', 'Problem solving'] },
  { title: 'Languages', skills: ['Nepali — Native', 'English — Proficient'] },
];

export default function Capabilities() {
  return (
    <div className="page-shell">
      <PageHeading number="03" label="Capabilities"
        description="A practical toolkit for exploring data, building applications, and working through problems together.">
        The tools behind<br /><em>the work.</em>
      </PageHeading>
      <section className="capability-list" aria-label="Skills and tools">
        {capabilities.map(({ title, skills }, index) => (
          <Reveal className="capability-row" key={title}>
            <span className="capability-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <div className="capability-copy">
              <h2>{title}</h2>
              <div className="skill-tags">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
            </div>
          </Reveal>
        ))}
      </section>
      <NextPage to="/contact" label="Let’s talk" number="04" />
    </div>
  );
}
