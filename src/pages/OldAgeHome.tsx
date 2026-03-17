import React from 'react';
import { useAuth } from '../context/useAuth';

interface OldAgeHomeProps {
  onNavigate: (page: string) => void;
}

const OldAgeHome: React.FC<OldAgeHomeProps> = ({ onNavigate }) => {
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
            "url('https://images.pexels.com/photos/18786324/pexels-photo-18786324.jpeg?auto=compress&cs=tinysrgb&w=1600')"
        }}
      >
        <div className="container ourwork-hero-content">
          <div className="d-inline-flex ourwork-chip mb-3">Care • Companionship • Dignity</div>
          <h1 className="display-5 fw-bold mb-3">Old Age Home</h1>
          <p className="lead mb-0">Compassionate care and dignity for senior citizens.</p>
          <div className="ourwork-kpi-grid">
            <div className="ourwork-kpi">
              <h4>320+</h4>
              <span>Seniors supported</span>
            </div>
            <div className="ourwork-kpi">
              <h4>18</h4>
              <span>Care programs</span>
            </div>
            <div className="ourwork-kpi">
              <h4>24x7</h4>
              <span>Well-being checks</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4">
              <h2 className="ourwork-section-title">Respectful Care</h2>
              <p>
                Our old age home initiatives provide safe housing, nutritious meals, and healthcare support.
                We focus on companionship and emotional well-being for every senior.
              </p>
              <p>
                Volunteers organize cultural events, wellness check-ups, and recreational activities.
              </p>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="ourwork-pill">Health Support</span>
                <span className="ourwork-pill">Nutrition</span>
                <span className="ourwork-pill">Community Visits</span>
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
                  src="https://images.pexels.com/photos/12572373/pexels-photo-12572373.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Smiling elderly Indian woman"
                  className="img-fluid"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="https://images.pexels.com/photos/17041934/pexels-photo-17041934.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Elderly man portrait"
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
                  <h5 className="text-primary">Health Support</h5>
                  <p className="mb-0">Routine check-ups, medicine assistance, and emergency care.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card ourwork-feature-card">
                <div className="card-body">
                  <h5 className="text-success">Nutrition & Safety</h5>
                  <p className="mb-0">Balanced meals, hygiene, and a safe living environment.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card ourwork-feature-card">
                <div className="card-body">
                  <h5 className="text-primary">Companionship</h5>
                  <p className="mb-0">Community gatherings and meaningful connections.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="ourwork-impact-grid mt-4">
            <div className="ourwork-impact">
              <h5 className="mb-1">Dignified Living</h5>
              <p className="mb-0">Safe, respectful care that prioritizes independence.</p>
            </div>
            <div className="ourwork-impact">
              <h5 className="mb-1">Emotional Well-being</h5>
              <p className="mb-0">Companionship reduces loneliness and isolation.</p>
            </div>
            <div className="ourwork-impact">
              <h5 className="mb-1">Healthy Outcomes</h5>
              <p className="mb-0">Preventive care improves long-term health.</p>
            </div>
          </div>

          <div className="ourwork-quote mt-4">
            “Every senior deserves care, respect, and a place to call home.”
          </div>
        </div>
      </section>
    </div>
  );
};

export default OldAgeHome;
