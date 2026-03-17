import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/useAuth';

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  raised_amount: number;
  status: string;
  location?: string | null;
  image_url?: string | null;
}

interface CampaignsProps {
  onNavigate: (page: string, campaignId?: string) => void;
}

const Campaigns: React.FC<CampaignsProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const getMapSrc = (location: string) => {
    return `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
  };

  const showDonate = !user || user?.role === 'donor'; // admin & volunteer should not see the donate button
  return (
    <div>
      <section
        className="py-5 text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&w=1400&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container text-center">
          <h1 className="display-5 fw-bold mb-3">Active Campaigns</h1>
          <p className="lead mb-0">Support our campaigns and make a difference in someone's life.</p>
        </div>
      </section>

      <div className="container py-5">

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="alert alert-info text-center">
          No active campaigns at the moment. Check back soon!
        </div>
      ) : (
        <div className="row">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                {campaign.image_url && (
                  <img
                    src={campaign.image_url}
                    alt={campaign.title}
                    className="card-img-top"
                    style={{ maxHeight: 200, objectFit: 'cover' }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-primary">{campaign.title}</h5>
                  <p className="card-text">{campaign.description}</p>
                  {campaign.location && (
                    <p className="text-muted mb-2">Location: {campaign.location}</p>
                  )}
                  {campaign.location && (
                    <div className="ratio ratio-16x9 mb-3">
                      <iframe
                        title={`${campaign.title} location`}
                        src={getMapSrc(campaign.location)}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded border"
                      />
                    </div>
                  )}
                  <div className="mb-3 mt-auto">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Raised: ₹{campaign.raised_amount}</span>
                      <span>Goal: ₹{campaign.goal_amount}</span>
                    </div>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: `${calculateProgress(campaign.raised_amount, campaign.goal_amount)}%` }}
                      ></div>
                    </div>
                  </div>
                  {showDonate && (
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => onNavigate('donate', campaign.id)}
                    >
                      Donate Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default Campaigns;
