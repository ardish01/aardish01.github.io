import { Link } from 'react-router';
import { Arrow, Reveal } from '../components.jsx';
import { profile } from '../data.js';
import portrait from '../../assets/images/aardish-portrait.png';

export default function Home() {
  return (
    <div className="home-shell">
      <section className="hero" aria-labelledby="hero-title">
        <Reveal className="hero-copy">
          <h1 id="hero-title" className="hero-title">
            <span>Aardish</span><span><em>Duwal.</em></span>
          </h1>
          <p className="hero-intro">
            Building for the web. Exploring what data can do.
            {' '}I’m a {profile.role.toLowerCase()} at {profile.company} and a data annotator at CloudFactory,
            with a curiosity for machine learning and making complex things feel simple.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/projects">Explore my work <Arrow /></Link>
            <Link className="text-link" to="/about">A little about me <Arrow diagonal={false} /></Link>
          </div>
        </Reveal>
        <Reveal className="portrait-wrap" delay={0.12}>
          <figure className="portrait-figure">
            <div className="portrait-frame">
              <img src={portrait} alt="Black-and-white portrait of Aardish Duwal wearing sunglasses"
                width="1145" height="1374" fetchPriority="high" />
            </div>
            <figcaption className="portrait-caption">
              <span>Based in {profile.location}</span><span>01 / Portrait</span>
            </figcaption>
            <span className="portrait-stamp" aria-hidden="true">Think.<br />Build.<br />Repeat.</span>
          </figure>
        </Reveal>
      </section>
      <Reveal className="home-bottom" delay={0.2}>
        <span className="home-signature">A developer with a data-driven curiosity.</span>
        <span>Web development / Data / Machine learning</span>
      </Reveal>
    </div>
  );
}
