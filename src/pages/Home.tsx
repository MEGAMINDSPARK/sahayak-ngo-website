import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/useAuth';
import PostsFeed from '../components/PostsFeed';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  // role-based CTAs: only donors (or unauthenticated visitors) can donate again; only non-volunteer users should see volunteer signup
  const userRole = user?.role?.toLowerCase();
  const isAdmin = userRole === 'admin';
  const isDonor = userRole === 'donor';
  const disableVolunteerBtn = isAdmin || isDonor;
  const showDonateBtn = !user || userRole === 'donor';
  const showVolunteerBtn = !user || userRole === 'donor';

  const [recentDonations, setRecentDonations] = useState<Array<{ donorName: string; amount: number; date: string }>>([]);
  const [topDonors, setTopDonors] = useState<Array<{ donorName: string; total: number }>>([]);

  const newsItems = [
    {
      title: 'Community Health Drive',
      date: 'March 2026',
      summary: 'Free checkups and medicine kits for families in three neighborhoods this month.'
    },
    {
      title: 'Back-to-School Kits',
      date: 'April 2026',
      summary: 'We are preparing learning kits for students to start the new academic year strong.'
    },
    {
      title: 'Volunteer Orientation',
      date: 'April 2026',
      summary: 'New volunteer onboarding sessions open every Saturday morning.'
    }
  ];

  const factItems = [
    {
      variant: 'info',
      label: 'Did you know?',
      text: 'Recurring monthly contributions help us plan long-term programs without interruptions.'
    },
    {
      variant: 'success',
      label: 'Fast fact:',
      text: 'Community-led projects are more likely to sustain impact after the program ends.'
    },
    {
      variant: 'warning',
      label: 'Quote:',
      text: '"Alone we can do so little; together we can do so much." - Helen Keller'
    }
  ];

  const galleryImages = [
    { url: 'https://images.pexels.com/photos/35247605/pexels-photo-35247605.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Children eating together at a community center in India' },
    { url: 'https://images.pexels.com/photos/5909876/pexels-photo-5909876.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Serving food to children during a community meal' },
    { url: 'https://images.pexels.com/photos/33171273/pexels-photo-33171273.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Elderly man in a rural Indian setting' },
    { url: 'https://images.pexels.com/photos/12055426/pexels-photo-12055426.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Child enjoying a drink in a village gathering' },
    { url: 'https://images.pexels.com/photos/15119089/pexels-photo-15119089.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Rural classroom with students in India' },
    { url: 'https://images.pexels.com/photos/34581269/pexels-photo-34581269.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Children playing outdoors in an Indian neighborhood' },
    { url: 'https://images.pexels.com/photos/20264101/pexels-photo-20264101.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Community women gathered in an Indian neighborhood' },
    { url: 'https://images.pexels.com/photos/29490106/pexels-photo-29490106.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Portrait of an elderly man in traditional attire' },
    { url: 'https://images.pexels.com/photos/7414564/pexels-photo-7414564.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Elderly man with green cap in India' },
    { url: 'https://images.pexels.com/photos/3665348/pexels-photo-3665348.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Elderly man wearing a pink turban at a market' },
    { url: 'https://images.pexels.com/photos/11217218/pexels-photo-11217218.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Elderly man portrait in South Asia' },
    { url: 'https://images.pexels.com/photos/5940089/pexels-photo-5940089.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Elderly man with orange turban in India' },
    { url: 'https://images.pexels.com/photos/4556737/pexels-photo-4556737.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Senior portrait in traditional attire' },
    { url: 'https://images.pexels.com/photos/31207071/pexels-photo-31207071.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Elderly man in a market setting' },
    { url: 'https://images.pexels.com/photos/29061403/pexels-photo-29061403.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Elderly man in traditional Indian clothing' },
    { url: 'https://images.pexels.com/photos/31578404/pexels-photo-31578404.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Elderly man wearing a yellow turban' },
    { url: 'https://images.pexels.com/photos/28219408/pexels-photo-28219408.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Elderly man in traditional headwear' },
    { url: 'https://images.pexels.com/photos/11925918/pexels-photo-11925918.png?auto=compress&cs=tinysrgb&w=800', alt: 'Children near a street food vendor in India' },
    { url: 'https://images.pexels.com/photos/12820067/pexels-photo-12820067.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Blood donation camp in India' },
    { url: 'https://images.pexels.com/photos/12820057/pexels-photo-12820057.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Donor giving blood with a stress ball' },
    { url: 'https://images.pexels.com/photos/13009648/pexels-photo-13009648.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Blood donation close-up in a hospital' }
  ];

  const [lightboxImage, setLightboxImage] = useState<{ url: string; alt: string } | null>(null);

  const handleGalleryImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
    fallbackSeed: number
  ) => {
    const target = event.currentTarget;
    if (target.dataset.fallback === 'true') return;
    target.dataset.fallback = 'true';
    target.src = `https://picsum.photos/seed/ngo-gallery-${fallbackSeed}/800/600`;
  };

  useEffect(() => {
    const fetchDonations = async () => {
      const { data } = await supabase
        .from('donations')
        .select('amount, created_at, users(full_name)')
        .order('created_at', { ascending: false })
        .limit(20);

      const donations = (data || []).map((d: any) => ({
        donorName: d.users?.full_name || 'Anonymous',
        amount: parseFloat(d.amount),
        date: d.created_at
      }));

      setRecentDonations(donations.slice(0, 5));

      const totals: Record<string, number> = {};
      const names: Record<string, string> = {};
      donations.forEach((donation: any) => {
        const key = donation.donorName;
        totals[key] = (totals[key] || 0) + donation.amount;
        names[key] = donation.donorName;
      });

      const donors = Object.keys(totals)
        .map((name) => ({ donorName: names[name], total: totals[name] }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

      setTopDonors(donors);
    };

    fetchDonations();
  }, []);

  useEffect(() => {
    if (!lightboxImage) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage]);

  const recentDonorsSection = useMemo(() => {
    if (recentDonations.length === 0) return null;

    return (
      <section className="py-5 bg-white">
        <div className="container">
          <h2 className="text-center mb-4">Recent Donors</h2>
          <div className="row">
            {recentDonations.map((donation, index) => (
              <div key={index} className="col-md-4 mb-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{donation.donorName}</h5>
                    <p className="mb-1">Donated: ₹{donation.amount.toFixed(2)}</p>
                    <p className="text-muted small">{new Date(donation.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }, [recentDonations]);

  const topDonorsSection = useMemo(() => {
    if (topDonors.length === 0) return null;

    return (
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Top Donors</h2>
          <div className="row">
            {topDonors.map((donor, index) => (
              <div key={index} className="col-md-4 mb-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{donor.donorName}</h5>
                    <p className="mb-0">Total Donated: ₹{donor.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }, [topDonors]);

  return (
    <div>
      <section className="landing-hero position-relative">
        <div id="landingCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="2000" data-bs-pause="false">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#landingCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#landingCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#landingCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active" data-bs-interval="2000">
              <img
                src="/images/slide-1.jpg"
                className="d-block w-100 landing-hero-image" alt="Slide 1"
                loading="eager"
                decoding="async"
              />
              <div className="carousel-caption d-none d-md-block bg-white bg-opacity-80 text-dark p-4 rounded">
                <h1 className="display-4 fw-bold">Welcome to Sahayak NGO</h1>
                <p className="lead fw-bold">
                  Empowering communities through compassion, service, and sustainable development
                </p>
                {showDonateBtn && (
                  <button
                    className="btn btn-dark btn-lg me-2"
                    onClick={() => onNavigate('donate')}
                  >
                    Donate Now
                  </button>
                )}
                {showVolunteerBtn && (
                  <button
                    className={`btn btn-outline-dark btn-lg${disableVolunteerBtn ? ' disabled' : ''}`}
                    onClick={() => {
                      if (!disableVolunteerBtn) onNavigate('volunteer');
                    }}
                    disabled={disableVolunteerBtn}
                  >
                    Become a Volunteer
                  </button>
                )}
              </div>
            </div>
            <div className="carousel-item" data-bs-interval="2000">
              <img
                src="/images/slide-2.jpg"
                // src="/images/slide-2.jpg.jpg"
                className="d-block w-100 landing-hero-image" alt="Slide 2"
                loading="lazy"
                decoding="async"
              />
              <div className="carousel-caption d-none d-md-block bg-white bg-opacity-80 text-dark p-4 rounded">
                <h2 className="fw-bold">Join Hands, Create Change</h2>
                <p className="lead fw-bold">
                  Every small action adds up—whether it’s donating, volunteering, or spreading the word.
                </p>
              </div>
            </div>
            <div className="carousel-item" data-bs-interval="2000">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80"
                className="d-block w-100 landing-hero-image" alt="Slide 3"
                loading="lazy"
                decoding="async"
              />
              <div className="carousel-caption d-none d-md-block bg-white bg-opacity-80 text-dark p-4 rounded">
                <h2 className="fw-bold">Your Support Builds Hope</h2>
                <p className="lead fw-bold">
                  From education to healthcare, your contribution directly supports real people and real change.
                </p>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#landingCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#landingCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Our Impact</h2>
          <div className="row text-center">
            <div className="col-md-3 mb-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h3 className="text-primary">500+</h3>
                  <p className="mb-0">Lives Impacted</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h3 className="text-success">50+</h3>
                  <p className="mb-0">Active Campaigns</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h3 className="text-primary">200+</h3>
                  <p className="mb-0">Volunteers</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h3 className="text-success">₹10L+</h3>
                  <p className="mb-0">Funds Raised</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {recentDonorsSection}
      {topDonorsSection}

      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Our Mission</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">Education</h5>
                  <p className="card-text">
                    Providing quality education to underprivileged children and empowering them with knowledge.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-success">Healthcare</h5>
                  <p className="card-text">
                    Ensuring access to basic healthcare services and medical assistance for those in need.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">Community Development</h5>
                  <p className="card-text">
                    Building sustainable communities through skill development and livelihood programs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container">
          <h2 className="text-center mb-4">News & Announcements</h2>
          <div className="row">
            {newsItems.map((item) => (
              <div key={item.title} className="col-md-4 mb-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title text-primary mb-0">{item.title}</h5>
                      <span className="badge bg-light text-dark">{item.date}</span>
                    </div>
                    <p className="card-text text-muted mb-0">{item.summary}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Interesting Notes</h2>
          <div className="row">
            {factItems.map((fact) => (
              <div key={fact.label} className="col-md-4 mb-3">
                <div className={`alert alert-${fact.variant}`}>
                  <strong>{fact.label}</strong> {fact.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="py-5 bg-light gallery-section">
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-4">
            <div>
              <h2 className="mb-2">Our Gallery – Moments of Helping Hands</h2>
              <p className="text-muted mb-0">Snapshots from food drives, community service, and education support.</p>
            </div>
            <small className="text-muted mt-2 mt-md-0">Click any image to preview</small>
          </div>
          <div className="row g-3">
            {galleryImages.map((image, index) => (
              <div key={`${image.url}-${index}`} className="col-12 col-sm-6 col-lg-3">
                <button
                  type="button"
                  className="gallery-item"
                  onClick={() => setLightboxImage(image)}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="gallery-img"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={(event) => handleGalleryImageError(event, index + 1)}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Latest Updates</h2>
          <PostsFeed />
        </div>
      </section>

      {lightboxImage && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="gallery-lightbox-inner"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="gallery-lightbox-close"
              type="button"
              aria-label="Close preview"
              onClick={() => setLightboxImage(null)}
            >
              ×
            </button>
            <img
              src={lightboxImage.url}
              alt={lightboxImage.alt}
              className="gallery-lightbox-img"
            />
            <p className="gallery-lightbox-caption">{lightboxImage.alt}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;


