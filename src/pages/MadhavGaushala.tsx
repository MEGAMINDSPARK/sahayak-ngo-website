import React from 'react';
import { useAuth } from '../context/useAuth';

interface MadhavGaushalaProps {
  onNavigate: (page: string) => void;
}

const MadhavGaushala: React.FC<MadhavGaushalaProps> = ({ onNavigate }) => {
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
            "url('https://images.unsplash.com/photo-1723174713367-b6e6bdf708cf?auto=format&fit=crop&w=1600&q=80')"
        }}
      >
        <div className="container ourwork-hero-content">
          <div className="d-inline-flex ourwork-chip mb-3">Shelter • Care • Sustainability</div>
          <h1 className="display-5 fw-bold mb-3">Madhav Gaushala</h1>
          <p className="lead mb-0">Caring for cows with compassion, shelter, and medical care.</p>
          <div className="ourwork-kpi-grid">
            <div className="ourwork-kpi">
              <h4>420+</h4>
              <span>Animals sheltered</span>
            </div>
            <div className="ourwork-kpi">
              <h4>16</h4>
              <span>Veterinary camps</span>
            </div>
            <div className="ourwork-kpi">
              <h4>12</h4>
              <span>Community partners</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4">
              <h2 className="ourwork-section-title">Protecting and Nurturing</h2>
              <p>
                Madhav Gaushala provides safe shelter, nutritious feed, and veterinary care for rescued cows.
                We also support sustainable farming and biogas initiatives for nearby communities.
              </p>
              <p>
                Your support helps us expand infrastructure and ensure continuous care for animals.
              </p>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="ourwork-pill">Shelter & Feed</span>
                <span className="ourwork-pill">Veterinary Care</span>
                <span className="ourwork-pill">Biogas Programs</span>
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
                  src="https://images.unsplash.com/photo-1714321633665-405f4e33599d?auto=format&fit=crop&w=1200&q=80"
                  alt="Cows in a shelter"
                  className="img-fluid"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="https://images.unsplash.com/photo-1557722684-93001c7f78f7?auto=format&fit=crop&w=1200&q=80"
                  alt="Gaushala caretakers"
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
                  <h5 className="text-primary">Shelter & Feed</h5>
                  <p className="mb-0">Safe grazing spaces and balanced nutrition year-round.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card ourwork-feature-card">
                <div className="card-body">
                  <h5 className="text-success">Veterinary Care</h5>
                  <p className="mb-0">Regular health checks, vaccinations, and treatment.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card ourwork-feature-card">
                <div className="card-body">
                  <h5 className="text-primary">Community Impact</h5>
                  <p className="mb-0">Biogas and organic fertilizer initiatives benefiting local families.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="ourwork-impact-grid mt-4">
            <div className="ourwork-impact">
              <h5 className="mb-1">Safe Shelter</h5>
              <p className="mb-0">Protected spaces for rescued animals.</p>
            </div>
            <div className="ourwork-impact">
              <h5 className="mb-1">Sustainable Care</h5>
              <p className="mb-0">Eco-friendly practices support rural livelihoods.</p>
            </div>
            <div className="ourwork-impact">
              <h5 className="mb-1">Healthier Herds</h5>
              <p className="mb-0">Preventive care improves animal wellbeing.</p>
            </div>
          </div>

          <div className="ourwork-quote mt-4">
            “Compassion for animals builds a more humane society.”
          </div>
        </div>
      </section>
    </div>
  );
};

export default MadhavGaushala;
