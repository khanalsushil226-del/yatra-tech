import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="container">
        <div className="hero-content">
          <div className="eyebrow">
            <span></span>
            Building the future with technology
          </div>

          <h1>
            Technology that moves your{" "}
            <span>business forward.</span>
          </h1>

          <p>
            We create powerful digital solutions that simplify operations,
            connect businesses with their customers, and turn ambitious ideas
            into scalable technology.
          </p>

          <div className="hero-buttons">
            <a href="#contact" className="primary-btn">
              Start a Project
              <ArrowRight size={17} />
            </a>

            <a href="#services" className="secondary-btn">
              Explore Services
              <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      </div>

      <div className="hero-card">
        <div className="card-content">
          <div className="card-icon">
            <Sparkles size={24} />
          </div>

          <div>
            <h3>Your Journey. Our Technology.</h3>

            <p>
              Technology designed around the way modern businesses actually
              work.
            </p>
          </div>
        </div>
      </div>

      <div className="hero-bottom">
        <div>YATRA TECHNOLOGIES</div>

        <div className="scroll">
          <span className="scroll-line"></span>
          Scroll to explore
        </div>
      </div>
    </section>
  );
}

export default Hero;