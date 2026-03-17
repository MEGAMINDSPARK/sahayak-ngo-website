import React from 'react';
import { useAuth } from '../context/useAuth';

interface ChildEducationProps {
  onNavigate: (page: string) => void;
}

const ChildEducation: React.FC<ChildEducationProps> = ({ onNavigate }) => {
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
            "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80')"
        }}
      >
        <div className="container ourwork-hero-content">
          <div className="d-inline-flex ourwork-chip mb-3">Education • Literacy • Mentorship</div>
          <h1 className="display-5 fw-bold mb-3">Child Education</h1>
          <p className="lead mb-0">Building strong learning foundations for every child.</p>
          <div className="ourwork-kpi-grid">
            <div className="ourwork-kpi">
              <h4>1200+</h4>
              <span>Students supported</span>
            </div>
            <div className="ourwork-kpi">
              <h4>35</h4>
              <span>Learning centers</span>
            </div>
            <div className="ourwork-kpi">
              <h4>90%</h4>
              <span>Attendance improvement</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4">
              <h2 className="ourwork-section-title">Why Education Matters</h2>
              <p>
                Sahayak NGO supports under-resourced schools and learning centers across India.
                We provide academic support, creative learning tools, and safe spaces where children can thrive.
              </p>
              <p>
                Our volunteers mentor students, strengthen foundational literacy, and help children stay in school.
              </p>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="ourwork-pill">Learning Kits</span>
                <span className="ourwork-pill">After-School Clubs</span>
                <span className="ourwork-pill">Teacher Support</span>
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
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80"
                  alt="Children studying with support"
                  className="img-fluid"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=900&q=80"
                  alt="Classroom learning"
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
                  <h5 className="text-primary">Learning Kits</h5>
                  <p className="mb-0">Books, stationery, and digital tools to keep children engaged.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card ourwork-feature-card">
                <div className="card-body">
                  <h5 className="text-success">After-School Clubs</h5>
                  <p className="mb-0">Remedial classes and mentorship sessions for confidence building.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card ourwork-feature-card">
                <div className="card-body">
                  <h5 className="text-primary">Teacher Support</h5>
                  <p className="mb-0">Training and resources for educators in underserved communities.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="ourwork-impact-grid mt-4">
            <div className="ourwork-impact">
              <h5 className="mb-1">Enrollment Growth</h5>
              <p className="mb-0">Families report higher enrollment after community outreach.</p>
            </div>
            <div className="ourwork-impact">
              <h5 className="mb-1">Better Retention</h5>
              <p className="mb-0">Consistent learning pathways reduce dropout risk.</p>
            </div>
            <div className="ourwork-impact">
              <h5 className="mb-1">Stronger Confidence</h5>
              <p className="mb-0">Students gain confidence in reading and speaking.</p>
            </div>
          </div>

          <div className="ourwork-quote mt-4">
            “Education is the most powerful tool to change the life of a child—and their entire community.”
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChildEducation;
