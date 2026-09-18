import { Link } from 'react-router';
import { Arrow, Reveal } from '../components.jsx';
import { education, experience, profile } from '../data.js';
import portrait from '../../assets/images/aardish-portrait.png';

export default function About() {
  return (
    <div className="page-shell about-story-page">
      <section className="about-hero" aria-labelledby="about-title">
        <Reveal className="about-introduction">
          <p className="eyebrow">About me / The story so far</p>
          <h1 id="about-title">Curiosity, turned<br />into <em>code.</em></h1>
          <p className="about-lead">I’m {profile.name} — a developer and data enthusiast based in {profile.location}.</p>
          <p>I work as a {profile.role.toLowerCase()} at {profile.company} and a data annotator at CloudFactory. Alongside work, I’m pursuing a Bachelor of Computer Applications.</p>
          <p>For me, technology is a way to make complex things clearer, connect ideas, and build something useful.</p>
          <a className="text-link" href="#experience">Explore my journey <Arrow diagonal={false} /></a>
        </Reveal>
        <Reveal className="about-photo" delay={0.12}>
          <figure>
            <img src={portrait} alt="Aardish Duwal wearing sunglasses" width="1145" height="1374" fetchPriority="high" />
            <figcaption><span>{profile.name}</span><span>{profile.location}</span></figcaption>
          </figure>
        </Reveal>
      </section>

      <section className="story-section" id="experience" aria-labelledby="experience-title">
        <Reveal className="story-section-heading">
          <p className="eyebrow">Putting learning into practice</p>
          <h2 id="experience-title">Where I <em>work.</em></h2>
          <p>Two parts of my journey: building for the web and working with data.</p>
        </Reveal>
        <div className="experience-cards">
          {experience.map(({ role, company, status, logo }, index) => (
            <Reveal key={company} delay={index * 0.08}>
              <article className="work-card">
                <div className="work-card-top">
                  <span className="company-mark">
                    {logo ? (
                      <img src={logo} alt={`${company} logo`} className="company-logo" width="52" height="52" />
                    ) : (
                      <span aria-hidden="true">{company === 'Nightvision' ? 'N' : 'CF'}</span>
                    )}
                  </span>
                  <span className="status-badge"><i />{status}</span>
                </div>
                <h3>{company}</h3><p className="work-role">{role}</p>
                <span className="work-field">{company === 'Nightvision' ? 'Web development' : 'Data annotation'}</span>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="story-section learning-story" aria-labelledby="learning-title">
        <Reveal className="learning-note">
          <span className="story-symbol" aria-hidden="true">&lt;/&gt;</span>
          <p className="eyebrow">A builder’s mindset</p>
          <h2 id="learning-title">Learning by<br /><em>making things.</em></h2>
        </Reveal>
        <Reveal className="learning-copy" delay={0.08}>
          <p className="about-lead">My interests sit at the intersection of web development, data science, and machine learning.</p>
          <p>From exploring datasets and predictive models to building web platforms, my projects are a space to put ideas into practice and keep improving.</p>
          <Link className="text-link" to="/projects">See what I’m building <Arrow /></Link>
        </Reveal>
      </section>

      <section className="story-section" aria-labelledby="education-title">
        <Reveal className="story-section-heading centered">
          <p className="eyebrow">Education</p>
          <h2 id="education-title">The foundation.<br /><em>The next chapter.</em></h2>
          <p>A continuing journey through learning, curiosity, and computer science.</p>
        </Reveal>
        <ol className="education-timeline">
          {education.map(({ qualification, school, status, label }, index) => (
            <li key={school}>
              <Reveal className="timeline-entry" delay={index * 0.06}>
                <span className="timeline-dot" aria-hidden="true" />
                <div className="timeline-label"><span className="eyebrow">{label}</span><span className="timeline-status">{status}</span></div>
                <article className="education-card"><span className="timeline-number" aria-hidden="true">0{index + 1}</span><h3>{qualification}</h3><p>{school}</p></article>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <Reveal className="about-cta">
        <p className="eyebrow">Keep the conversation going</p>
        <h2>Have something<br /><em>in mind?</em></h2>
        <p>A project, an idea, or just a hello. I’d love to connect.</p>
        <Link className="button button-primary" to="/contact">Get in touch <Arrow /></Link>
      </Reveal>
    </div>
  );
}
