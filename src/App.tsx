import { useEffect, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Campaigns from './pages/Campaigns';
import Donate from './pages/Donate';
import Events from './pages/Events';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import DonorDashboard from './pages/DonorDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import Volunteer from './pages/Volunteer';
import AdminLogin from './pages/AdminLogin';
import DonorLogin from './pages/DonorLogin';
import VolunteerLogin from './pages/VolunteerLogin';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Faq from './pages/Faq';
import ChildEducation from './pages/ChildEducation';
import WomenEmpowerment from './pages/WomenEmpowerment';
import OldAgeHome from './pages/OldAgeHome';
import HelpNeedyPeople from './pages/HelpNeedyPeople';
import Health from './pages/Health';
import MadhavGaushala from './pages/MadhavGaushala';
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | undefined>(undefined);

  const getLocationState = () => {
    if (typeof window === 'undefined') return { page: 'home', campaignId: undefined as string | undefined };
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page') || 'home';
    const campaignId = params.get('campaignId') || undefined;
    return { page, campaignId };
  };

  const handleNavigate = (page: string, campaignId?: string) => {
    setCurrentPage(page);
    if (campaignId) {
      setSelectedCampaignId(campaignId);
    } else {
      setSelectedCampaignId(undefined);
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();
      params.set('page', page);
      if (campaignId) params.set('campaignId', campaignId);
      window.history.pushState({ page, campaignId }, '', `?${params.toString()}`);
    }
    // ensure the new page starts at the top
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const { page, campaignId } = getLocationState();
    setCurrentPage(page);
    setSelectedCampaignId(campaignId);

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as { page?: string; campaignId?: string } | null;
      if (state?.page) {
        setCurrentPage(state.page);
        setSelectedCampaignId(state.campaignId);
        return;
      }
      const locationState = getLocationState();
      setCurrentPage(locationState.page);
      setSelectedCampaignId(locationState.campaignId);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'about':
        return <About />;
      case 'campaigns':
        return <Campaigns onNavigate={handleNavigate} />;
      case 'donate':
        return <Donate onNavigate={handleNavigate} selectedCampaignId={selectedCampaignId} />;
      case 'events':
        return <Events />;
      case 'volunteer':
        return <Volunteer onNavigate={handleNavigate} />;
      case 'contact':
        return <Contact />;
      case 'privacy-policy':
        return <PrivacyPolicy />;
      case 'terms':
        return <Terms />;
      case 'faq':
        return <Faq />;
      case 'child-education':
        return <ChildEducation onNavigate={handleNavigate} />;
      case 'women-empowerment':
        return <WomenEmpowerment onNavigate={handleNavigate} />;
      case 'old-age-home':
        return <OldAgeHome onNavigate={handleNavigate} />;
      case 'help-needy-people':
        return <HelpNeedyPeople onNavigate={handleNavigate} />;
      case 'health':
        return <Health onNavigate={handleNavigate} />;
      case 'madhav-gaushala':
        return <MadhavGaushala onNavigate={handleNavigate} />;
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'admin-login':
        return <AdminLogin onNavigate={handleNavigate} />;
      case 'donor-login':
        return <DonorLogin onNavigate={handleNavigate} />;
      case 'volunteer-login':
        return <VolunteerLogin onNavigate={handleNavigate} />;
      case 'register':
        return <Register onNavigate={handleNavigate} />;
      case 'admin-dashboard':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'donor-dashboard':
        return <DonorDashboard onNavigate={handleNavigate} />;
      case 'volunteer-dashboard':
        return <VolunteerDashboard onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
        <main className="flex-grow-1">
          {renderPage()}
        </main>
        <Footer onNavigate={handleNavigate} />
      </div>
    </AuthProvider>
  );
}

export default App;
