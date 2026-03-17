const About = () => {
  return (
    <div>
      <section
        className="py-5 text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container text-center">
          <h1 className="display-5 fw-bold mb-3">About Sahayak NGO</h1>
          <p className="lead mb-0">Building resilient communities through compassion and service.</p>
        </div>
      </section>

      <div className="container py-5">
        <div className="row">
          <div className="col-md-6 mb-4">
            <h3 className="text-primary">Our Story</h3>
            <p>
              Founded in 2015, Sahayak NGO has been dedicated to serving underprivileged
              communities across India. Our mission is to create sustainable change through
              education, healthcare, and community development programs.
            </p>
            <p>
              We believe that every individual deserves access to basic necessities and
              opportunities for growth. Through the support of our donors and volunteers,
              we've impacted thousands of lives.
            </p>
            <p>
              From urban learning centers to rural health outreach, our teams work alongside local
              leaders to design programs that are inclusive, measurable, and community-owned.
            </p>
          </div>
          <div className="col-md-6 mb-4">
            <h3 className="text-success">Our Vision</h3>
            <p>
              To build a society where every individual has access to education, healthcare,
              and livelihood opportunities, empowering them to lead dignified lives.
            </p>
            <h3 className="text-primary mt-4">Our Values</h3>
            <ul>
              <li>Compassion and Empathy</li>
              <li>Transparency and Accountability</li>
              <li>Sustainable Development</li>
              <li>Community Empowerment</li>
            </ul>
          </div>
        </div>

        <div className="row align-items-center mt-4">
          <div className="col-lg-6 mb-4">
            <img
              src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80"
              alt="Children learning together"
              className="img-fluid rounded shadow-sm"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="col-lg-6">
            <h3 className="text-primary">What We Do</h3>
            <p>
              We run long-term programs in three focus areas: foundational learning, community
              healthcare, and livelihood enablement. Each program is built with local partners and
              tracked with transparent impact goals.
            </p>
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="text-success">Education</h5>
                    <p className="mb-0">After-school support, teacher training, and learning resources.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="text-primary">Healthcare</h5>
                    <p className="mb-0">Mobile clinics, preventive care, and nutrition awareness.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="text-success">Livelihoods</h5>
                    <p className="mb-0">Skill training, micro-enterprise support, and placements.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="text-primary">Disaster Relief</h5>
                    <p className="mb-0">Rapid response kits and recovery planning with communities.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row text-center mt-4">
          <div className="col-md-4 mb-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h2 className="text-primary mb-1">500+</h2>
                <p className="mb-0">Families supported each year</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h2 className="text-success mb-1">60+</h2>
                <p className="mb-0">Community partners across India</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h2 className="text-primary mb-1">200+</h2>
                <p className="mb-0">Active volunteers and mentors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
