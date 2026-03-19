import React from 'react';
import { useAuth } from '../context/useAuth';

interface WomenEmpowermentProps {
  onNavigate: (page: string) => void;
}

const WomenEmpowerment: React.FC<WomenEmpowermentProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const userRole = user?.role?.toLowerCase();
  const isAdmin = userRole === 'admin';
  const canDonate = !user || userRole === 'donor';
  const disableVolunteerBtn = isAdmin || userRole === 'donor';
  return (
    <div>
      <section
        className="ourwork-hero"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/31308739/pexels-photo-31308739.jpeg?auto=compress&cs=tinysrgb&w=1600')"
        }}
      >
        <div className="container ourwork-hero-content">
          <div className="d-inline-flex ourwork-chip mb-3">Livelihood • Safety • Leadership</div>
          <h1 className="display-5 fw-bold mb-3">Women Empowerment</h1>
          <p className="lead mb-0">Supporting dignity, safety, and economic independence for women.</p>
          <div className="ourwork-kpi-grid">
            <div className="ourwork-kpi">
              <h4>540+</h4>
              <span>Women trained</span>
            </div>
            <div className="ourwork-kpi">
              <h4>48</h4>
              <span>Self-help groups</span>
            </div>
            <div className="ourwork-kpi">
              <h4>70%</h4>
              <span>Income growth</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4">
              <h2 className="ourwork-section-title">Creating Opportunity</h2>
              <p>
                We invest in skill-building, leadership, and livelihood programs that help women
                build sustainable income and confidence.
              </p>
              <p>
                From vocational training to financial literacy, we make sure women can lead their communities.
              </p>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="ourwork-pill">Skill Training</span>
                <span className="ourwork-pill">Financial Literacy</span>
                <span className="ourwork-pill">Mentorship</span>
              </div>
              <div className="d-flex flex-wrap gap-3">
                {canDonate && (
                  <button
                    className="btn btn-primary"
                    onClick={() => onNavigate('donate')}
                  >
                    Donate Now
                  </button>
                )}
                <button
                  className={`btn btn-outline-primary${disableVolunteerBtn ? ' disabled' : ''}`}
                  onClick={() => {
                    if (!disableVolunteerBtn) onNavigate('volunteer');
                  }}
                  disabled={disableVolunteerBtn}
                >
                  Become Volunteer
                </button>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="ourwork-image-stack">
                <img
                  src="https://images.pexels.com/photos/28704408/pexels-photo-28704408.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Women empowerment program"
                  className="img-fluid"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="https://images.pexels.com/photos/14225259/pexels-photo-14225259.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Community leadership"
                  className="img-fluid stacked"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card ourwork-feature-card">
                <div className="card-body">
                  <h5 className="text-primary">Skill Training</h5>
                  <p className="mb-0">Tailoring, digital literacy, and entrepreneurship workshops.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card ourwork-feature-card">
                <div className="card-body">
                  <h5 className="text-success">Self-Help Groups</h5>
                  <p className="mb-0">Peer networks for savings, loans, and collective growth.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card ourwork-feature-card">
                <div className="card-body">
                  <h5 className="text-primary">Safety & Wellness</h5>
                  <p className="mb-0">Awareness sessions on health, rights, and personal safety.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="ourwork-impact-grid mt-4">
            <div className="ourwork-impact">
              <h5 className="mb-1">Income Growth</h5>
              <p className="mb-0">Women-led enterprises are creating stable livelihoods.</p>
            </div>
            <div className="ourwork-impact">
              <h5 className="mb-1">Leadership Circles</h5>
              <p className="mb-0">Peer networks mentor new leaders every quarter.</p>
            </div>
            <div className="ourwork-impact">
              <h5 className="mb-1">Community Safety</h5>
              <p className="mb-0">Workshops improve awareness of rights and safety.</p>
            </div>
          </div>

          <div className="ourwork-quote mt-4">
            “Empowered women build empowered communities—and lasting change.”
          </div>
        </div>
      </section>
    </div>
  );
};

export default WomenEmpowerment;
