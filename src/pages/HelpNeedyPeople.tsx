import React from 'react';
import { useAuth } from '../context/useAuth';

interface HelpNeedyPeopleProps {
  onNavigate: (page: string) => void;
}

const HelpNeedyPeople: React.FC<HelpNeedyPeopleProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const userRole = user?.role?.toLowerCase();
  const isAdmin = userRole === 'admin';
  const disableVolunteerBtn = isAdmin || userRole === 'donor';
  return (
    <div>
      <section
        className="ourwork-hero"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1600&q=80')"
        }}
      >
        <div className="container ourwork-hero-content">
          <div className="d-inline-flex ourwork-chip mb-3">Relief • Essentials • Hope</div>
          <h1 className="display-5 fw-bold mb-3">Help Needy People</h1>
          <p className="lead mb-0">Immediate relief and long-term support for families in crisis.</p>
          <div className="ourwork-kpi-grid">
            <div className="ourwork-kpi">
              <h4>2,800+</h4>
              <span>Meals served</span>
            </div>
            <div className="ourwork-kpi">
              <h4>640</h4>
              <span>Families supported</span>
            </div>
            <div className="ourwork-kpi">
              <h4>12</h4>
              <span>Relief drives</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4">
              <h2 className="ourwork-section-title">Relief That Reaches</h2>
              <p>
                We provide food kits, clothing, hygiene essentials, and shelter support for families
                facing hardship. Our teams coordinate quick response during emergencies.
              </p>
              <p>
                Every donation helps stabilize households and connect them to ongoing support services.
              </p>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="ourwork-pill">Food Kits</span>
                <span className="ourwork-pill">Emergency Relief</span>
                <span className="ourwork-pill">Shelter Support</span>
              </div>
              <div className="d-flex flex-wrap gap-3">
                <button
                  className={`btn btn-primary${isAdmin ? ' disabled' : ''}`}
                  onClick={() => {
                    if (!isAdmin) onNavigate('donate');
                  }}
                  disabled={isAdmin}
                >
                  Donate Now
                </button>
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
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80"
                  alt="Helping communities"
                  className="img-fluid"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=80"
                  alt="Community relief support"
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
                  <h5 className="text-primary">Food & Essentials</h5>
                  <p className="mb-0">Monthly kits with grains, nutrition, and hygiene supplies.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card ourwork-feature-card">
                <div className="card-body">
                  <h5 className="text-success">Emergency Relief</h5>
                  <p className="mb-0">Rapid-response teams for floods, heat waves, and local crises.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card ourwork-feature-card">
                <div className="card-body">
                  <h5 className="text-primary">Community Support</h5>
                  <p className="mb-0">Connecting families to education, healthcare, and job support.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="ourwork-impact-grid mt-4">
            <div className="ourwork-impact">
              <h5 className="mb-1">Faster Response</h5>
              <p className="mb-0">Relief teams reach families within 48 hours.</p>
            </div>
            <div className="ourwork-impact">
              <h5 className="mb-1">Community Reach</h5>
              <p className="mb-0">Local partners help identify urgent needs.</p>
            </div>
            <div className="ourwork-impact">
              <h5 className="mb-1">Sustained Care</h5>
              <p className="mb-0">Ongoing support keeps families stable.</p>
            </div>
          </div>

          <div className="ourwork-quote mt-4">
            “In every crisis, a small act of kindness becomes a lifeline.”
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpNeedyPeople;
