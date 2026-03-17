import React from 'react';
import { useAuth } from '../context/useAuth';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const { user, logout } = useAuth();

  const handleDropdownItem = (e: React.MouseEvent<HTMLAnchorElement>, page: string) => {
    e.preventDefault();
    onNavigate(page);
  };

  const handleGalleryClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const scrollToGallery = () => {
      if (typeof document === 'undefined') return;
      const section = document.getElementById('gallery');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (currentPage !== 'home') {
      onNavigate('home');
      window.setTimeout(scrollToGallery, 200);
      return;
    }

    scrollToGallery();
  };

  const handleLogout = async () => {
    await logout();
    onNavigate('home');
  };

  const getDashboardRoute = () => {
    if (user?.role === 'admin') return 'admin-dashboard';
    if (user?.role === 'donor') return 'donor-dashboard';
    if (user?.role === 'volunteer') return 'volunteer-dashboard';
    return 'home';
  };

  return (
    <nav className="navbar navbar-expand-xxl navbar-light bg-white shadow-sm">
      <div className="container navbar-container">
        <a className="navbar-brand fw-bold text-primary d-flex align-items-center gap-2" href="#" onClick={() => onNavigate('home')} style={{ whiteSpace: 'nowrap' }}>
          <img
            src="/images/sahayak-logo.png.webp"
            alt="Sahayak NGO logo"
            className="rounded-circle"
            style={{ width: 40, height: 40, objectFit: 'contain' }}
          />
          <span>Sahayak NGO</span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!user && (
              <>
                <li className="nav-item">
                  <a
                    className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                    href="#"
                    onClick={() => onNavigate('home')}
                  >
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
                    href="#"
                    onClick={() => onNavigate('about')}
                  >
                    About
                  </a>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Our Work
                  </a>
                  <ul className="dropdown-menu shadow-sm">
                    <li>
                      <a className="dropdown-item" href="#" onClick={(e) => handleDropdownItem(e, 'child-education')}>
                        <span className="me-2">🎓</span>Child Education
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#" onClick={(e) => handleDropdownItem(e, 'women-empowerment')}>
                        <span className="me-2">👩‍🦱</span>Women Empowerment
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#" onClick={(e) => handleDropdownItem(e, 'old-age-home')}>
                        <span className="me-2">👵</span>Old Age Home
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#" onClick={(e) => handleDropdownItem(e, 'help-needy-people')}>
                        <span className="me-2">🤝</span>Help Needy People
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#" onClick={(e) => handleDropdownItem(e, 'health')}>
                        <span className="me-2">🩺</span>Health
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#" onClick={(e) => handleDropdownItem(e, 'madhav-gaushala')}>
                        <span className="me-2">🐄</span>Madhav Gaushala
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${currentPage === 'campaigns' ? 'active' : ''}`}
                    href="#"
                    onClick={() => onNavigate('campaigns')}
                  >
                    Campaigns
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${currentPage === 'events' ? 'active' : ''}`}
                    href="#"
                    onClick={() => onNavigate('events')}
                  >
                    Events
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${currentPage === 'volunteer' ? 'active' : ''}`}
                    href="#"
                    onClick={() => onNavigate('volunteer')}
                  >
                    Volunteer
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}
                    href="#"
                    onClick={() => onNavigate('contact')}
                  >
                    Contact
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#gallery"
                    onClick={handleGalleryClick}
                  >
                    Gallery
                  </a>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-dark ms-2 text-nowrap"
                    onClick={() => onNavigate('admin-login')}
                  >
                    Admin Login
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-primary ms-2 text-nowrap"
                    onClick={() => onNavigate('donor-login')}
                  >
                    Donor Login
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-success ms-2 text-nowrap"
                    onClick={() => onNavigate('volunteer-login')}
                  >
                    Volunteer Login
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-primary ms-2 text-nowrap"
                    onClick={() => onNavigate('register')}
                  >
                    Register
                  </button>
                </li>
              </>
            )}
            {user && (
              <>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Our Work
                  </a>
                  <ul className="dropdown-menu shadow-sm">
                    <li>
                      <a className="dropdown-item" href="#" onClick={(e) => handleDropdownItem(e, 'child-education')}>
                        <span className="me-2">🎓</span>Child Education
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#" onClick={(e) => handleDropdownItem(e, 'women-empowerment')}>
                        <span className="me-2">👩‍🦱</span>Women Empowerment
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#" onClick={(e) => handleDropdownItem(e, 'old-age-home')}>
                        <span className="me-2">👵</span>Old Age Home
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#" onClick={(e) => handleDropdownItem(e, 'help-needy-people')}>
                        <span className="me-2">🤝</span>Help Needy People
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#" onClick={(e) => handleDropdownItem(e, 'health')}>
                        <span className="me-2">🩺</span>Health
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#" onClick={(e) => handleDropdownItem(e, 'madhav-gaushala')}>
                        <span className="me-2">🐄</span>Madhav Gaushala
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#gallery"
                    onClick={handleGalleryClick}
                  >
                    Gallery
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#"
                    onClick={() => onNavigate(getDashboardRoute())}
                  >
                    Dashboard
                  </a>
                </li>
                <li className="nav-item">
                  <span className="nav-link">Welcome, {user.full_name}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger ms-2" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
