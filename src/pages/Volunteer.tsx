import React from 'react';
import { useAuth } from '../context/useAuth';

interface VolunteerPageProps {
  onNavigate: (page: string) => void;
}

const Volunteer: React.FC<VolunteerPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const showApplyButton = !user || user.role === 'donor';

  return (
    <div>
      <section
        className="py-5 text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1400&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container text-center">
          <h1 className="display-5 fw-bold mb-3">Volunteer With Sahayak</h1>
          <p className="lead mb-4">Join our community of changemakers and make impact where it matters most.</p>
          {showApplyButton && (
            <button className="btn btn-light btn-lg" onClick={() => onNavigate('register')}>
              Apply to Volunteer
            </button>
          )}
        </div>
      </section>
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4">
              <h2 className="text-primary">Why Volunteer</h2>
              <p>
                Our volunteers lead community drives, mentor students, and support on-ground health camps.
                Whether you can give a few hours a week or join during weekends, there is a role for you.
              </p>
              <ul>
                <li>Skill-based opportunities across education, health, and community outreach</li>
                <li>Training and mentorship from experienced coordinators</li>
                <li>Certificate of appreciation for active volunteers</li>
              </ul>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80"
                alt="Volunteers helping"
                className="img-fluid rounded shadow-sm"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">How You Can Help</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">Teach & Mentor</h5>
                  <p className="card-text">Support after-school programs and guide students toward confidence.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-success">Health Camps</h5>
                  <p className="card-text">Assist medical teams in organizing health check-ups and awareness drives.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">Community Outreach</h5>
                  <p className="card-text">Coordinate distribution drives and connect with families in need.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Volunteer;
