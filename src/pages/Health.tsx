import React from 'react';
import { useAuth } from '../context/useAuth';

interface HealthProps {
  onNavigate: (page: string) => void;
}

const Health: React.FC<HealthProps> = ({ onNavigate }) => {
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
            "url('https://images.unsplash.com/photo-1504814532849-927e0a3937b2?auto=format&fit=crop&w=1600&q=80')"
        }}
      >
        <div className="container ourwork-hero-content">
          <div className="d-inline-flex ourwork-chip mb-3">Healthcare • Prevention • Awareness</div>
          <h1 className="display-5 fw-bold mb-3">Health</h1>
          <p className="lead mb-0">Affordable care, awareness, and preventive health services.</p>
          <div className="ourwork-kpi-grid">
            <div className="ourwork-kpi">
              <h4>1,100+</h4>
              <span>Health checkups</span>
            </div>
            <div className="ourwork-kpi">
              <h4>22</h4>
              <span>Medical camps</span>
            </div>
            <div className="ourwork-kpi">
              <h4>78%</h4>
              <span>Early diagnosis</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4">
              <h2 className="ourwork-section-title">Health for Every Family</h2>
              <p>
                We organize mobile health camps, provide basic diagnostics, and connect families to
                public health services. Our focus is preventive care and early intervention.
              </p>
              <p>
                Community health workers deliver awareness programs on nutrition, hygiene, and maternal health.
              </p>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="ourwork-pill">Health Camps</span>
                <span className="ourwork-pill">Nutrition Support</span>
                <span className="ourwork-pill">Awareness</span>
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
                  src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80"
                  alt="Health camp support"
                  className="img-fluid"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=900&q=80"
                  alt="Medical volunteers"
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
                  <h5 className="text-primary">Health Camps</h5>
                  <p className="mb-0">Free checkups, screenings, and essential medicine support.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card ourwork-feature-card">
                <div className="card-body">
                  <h5 className="text-success">Nutrition Support</h5>
                  <p className="mb-0">Counseling and supplementation for children and mothers.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card ourwork-feature-card">
                <div className="card-body">
                  <h5 className="text-primary">Health Awareness</h5>
                  <p className="mb-0">Workshops on hygiene, mental wellness, and preventive care.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="ourwork-impact-grid mt-4">
            <div className="ourwork-impact">
              <h5 className="mb-1">Early Detection</h5>
              <p className="mb-0">Screenings help identify risks early.</p>
            </div>
            <div className="ourwork-impact">
              <h5 className="mb-1">Maternal Care</h5>
              <p className="mb-0">Support for mothers and newborns.</p>
            </div>
            <div className="ourwork-impact">
              <h5 className="mb-1">Healthy Habits</h5>
              <p className="mb-0">Awareness programs build lifelong health.</p>
            </div>
          </div>

          <div className="ourwork-quote mt-4">
            “Good health is the foundation of thriving communities.”
          </div>
        </div>
      </section>
    </div>
  );
};

export default Health;
