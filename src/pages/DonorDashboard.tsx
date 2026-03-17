import React, { useCallback, useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/useAuth';
import PostsFeed from '../components/PostsFeed';
import ProfileSection from '../components/ProfileSection';
import NotificationBell from '../components/NotificationBell';

interface Donation {
  id: string;
  amount: number;
  payment_method: string;
  transaction_id: string;
  created_at: string;
  campaigns: {
    title: string;
  };
}

interface DonorMessage {
  id: string;
  subject: string;
  message: string;
  created_at: string;
  admin_reply?: string | null;
  replied_at?: string | null;
}

interface DonorSupport {
  id: string;
  issue_type: string;
  subject: string;
  message: string;
  created_at: string;
  admin_reply?: string | null;
  replied_at?: string | null;
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  raised_amount: number;
  status: string;
  image_url?: string | null;
}

interface Message {
  id: string;
  subject: string;
  content: string;
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
}

interface DonorDashboardProps {
  onNavigate: (page: string, campaignId?: string) => void;
}

const DonorDashboard: React.FC<DonorDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [donations, setDonations] = useState<Donation[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [totalDonated, setTotalDonated] = useState(0);
  const [donorMessages, setDonorMessages] = useState<DonorMessage[]>([]);
  const [supportTickets, setSupportTickets] = useState<DonorSupport[]>([]);
  const [messageForm, setMessageForm] = useState({ subject: '', message: '' });
  const [supportForm, setSupportForm] = useState({ issue_type: 'Donation issue', subject: '', message: '' });
  const [topDonor, setTopDonor] = useState<{ name: string; total: number; id: string } | null>(null);

  const fetchDonations = useCallback(async () => {
    const { data } = await supabase
      .from('donations')
      .select('*, campaigns(title)')
      .eq('donor_id', user?.id)
      .order('created_at', { ascending: false });

    if (data) {
      setDonations(data);
      const total = data.reduce((sum, d) => sum + parseFloat(d.amount), 0);
      setTotalDonated(total);
    }
  }, [user?.id]);

  const fetchCampaigns = useCallback(async () => {
    const { data } = await supabase
      .from('campaigns')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    setCampaigns(data || []);
  }, []);

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('recipient_type', 'donors')
      .order('created_at', { ascending: false });
    const normalizeText = (value: string) =>
      value.trim().replace(/\s+/g, ' ').toLowerCase();
    const uniqueMessages = (data || []).filter((message, index, array) => {
      const key = `${normalizeText(message.subject)}::${normalizeText(message.content)}`;
      return (
        array.findIndex(
          (item) =>
            `${normalizeText(item.subject)}::${normalizeText(item.content)}` === key
        ) === index
      );
    });
    setMessages(uniqueMessages);
  }, []);

  const fetchEvents = useCallback(async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });
    setEvents(data || []);
  }, []);

  const fetchDonorMessages = useCallback(async () => {
    const { data } = await supabase
      .from('donor_messages')
      .select('*')
      .eq('donor_id', user?.id)
      .order('created_at', { ascending: false });
    setDonorMessages((data || []) as DonorMessage[]);
  }, [user?.id]);

  const fetchSupportTickets = useCallback(async () => {
    const { data } = await supabase
      .from('donor_support')
      .select('*')
      .eq('donor_id', user?.id)
      .order('created_at', { ascending: false });
    setSupportTickets((data || []) as DonorSupport[]);
  }, [user?.id]);

  const fetchTopDonor = useCallback(async () => {
    const { data } = await supabase
      .from('donations')
      .select('donor_id, amount, users(full_name)')
      .order('created_at', { ascending: false });

    if (!data || data.length === 0) {
      setTopDonor(null);
      return;
    }

    const totals: Record<string, { total: number; name: string }> = {};
    data.forEach((donation: any) => {
      const id = donation.donor_id;
      if (!id) return;
      const name = donation.users?.full_name || 'Anonymous';
      totals[id] = totals[id] || { total: 0, name };
      totals[id].total += parseFloat(donation.amount);
    });

    const top = Object.entries(totals)
      .map(([id, value]) => ({ id, ...value }))
      .sort((a, b) => b.total - a.total)[0];

    setTopDonor(top || null);
  }, []);

  useEffect(() => {
    if (user?.role?.toLowerCase() !== 'donor') {
      onNavigate('home');
      return;
    }
    fetchDonations();
    fetchCampaigns();
    fetchMessages();
    fetchEvents();
    fetchDonorMessages();
    fetchSupportTickets();
    fetchTopDonor();
  }, [
    user,
    onNavigate,
    fetchDonations,
    fetchCampaigns,
    fetchMessages,
    fetchEvents,
    fetchDonorMessages,
    fetchSupportTickets,
    fetchTopDonor
  ]);

  const notifyAdmins = async (payload: { icon: string; message: string }) => {
    const { data: admins } = await supabase.from('users').select('id').eq('role', 'admin');
    const adminIds = (admins || []).map((a: any) => a.id);
    if (adminIds.length === 0) return;
    await supabase.from('notifications').insert(
      adminIds.map((id) => ({
        recipient_id: id,
        icon: payload.icon,
        message: payload.message,
        is_read: false
      }))
    );
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from('donor_messages').insert([
      {
        donor_id: user.id,
        subject: messageForm.subject,
        message: messageForm.message
      }
    ]);
    if (error) {
      alert(error.message || 'Failed to send message.');
      return;
    }
    setMessageForm({ subject: '', message: '' });
    fetchDonorMessages();
    await notifyAdmins({
      icon: '💬',
      message: `Donor message from ${user.full_name}: ${messageForm.subject}`
    });
  };

  const handleSendSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from('donor_support').insert([
      {
        donor_id: user.id,
        issue_type: supportForm.issue_type,
        subject: supportForm.subject,
        message: supportForm.message
      }
    ]);
    if (error) {
      alert(error.message || 'Failed to submit support request.');
      return;
    }
    setSupportForm({ issue_type: 'Donation issue', subject: '', message: '' });
    fetchSupportTickets();
    await notifyAdmins({
      icon: '🆘',
      message: `Support request from ${user.full_name}: ${supportForm.subject}`
    });
  };

  const loadLogoDataUrl = (src: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });
  };

  const generateReceipt = async (donation: Donation) => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const dateObj = new Date(donation.created_at);
    const date = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    const time = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const donorName = user?.full_name || 'Anonymous';
    const donorEmail = user?.email || 'Not provided';
    const amount = `INR ${donation.amount}`;
    const paymentMethod = donation.payment_method.toUpperCase();

    doc.setFont('courier', 'normal');
    doc.setFontSize(11);

    const logoDataUrl = await loadLogoDataUrl('/images/sahayak-logo.png.webp');
    if (logoDataUrl) {
      doc.addImage(logoDataUrl, 'PNG', 20, 20, 48, 48);
    }

    const lines = [
      '+======================================================+',
      '                         SAHAYAK NGO',
      '              Helping Hands for a Better Tomorrow',
      '+======================================================+',
      '',
      '                    OFFICIAL DONATION RECEIPT',
      '',
      `Receipt No      : ${donation.transaction_id}`,
      `Transaction ID  : ${donation.transaction_id}`,
      `Date            : ${date}`,
      `Time            : ${time}`,
      '',
      '--------------------------------------------------------',
      '',
      'Donor Details',
      '',
      `Donor Name      : ${donorName}`,
      `Email           : ${donorEmail}`,
      '',
      '--------------------------------------------------------',
      '',
      'Donation Details',
      '',
      `Campaign        : ${donation.campaigns.title}`,
      `Amount Donated  : ${amount}`,
      `Payment Method  : ${paymentMethod}`,
      'Payment Status  : SUCCESSFUL',
      '',
      '--------------------------------------------------------',
      '',
      'Message From Sahayak NGO',
      '',
      'Thank you for your generous donation.',
      '',
      'Your contribution helps us provide food,',
      'education, and essential support to people',
      'in need. Your support makes a real difference',
      'in the lives of many families.',
      '',
      'Together we are building a better future.',
      '',
      '--------------------------------------------------------',
      '',
      'NGO Details',
      '',
      'Organization    : Sahayak NGO',
      'Email           : sahayakngo@gmail.com',
      'Website         : www.sahayakngo.org',
      'Address         : India',
      '',
      '--------------------------------------------------------',
      'This is a computer generated receipt.',
      'No signature is required.',
      '',
      '              THANK YOU FOR YOUR SUPPORT',
      '--------------------------------------------------------'
    ];

    doc.text(lines, 20, 100, { lineHeightFactor: 1.2 });
    doc.save(`receipt_${donation.transaction_id}.pdf`);
  };

  const calculateProgress = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const showDonate = !user;

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <h2 className="mb-0">Donor Dashboard</h2>
        </div>
        <div className="d-flex align-items-center gap-3">
          {user?.id && <NotificationBell recipientId={user.id} />}
          <div className="profile-avatar profile-avatar-lg">
            {user?.profile_image ? (
              <img src={user.profile_image} alt={user.full_name || 'Donor'} />
            ) : (
              <span>{user?.full_name ? user.full_name[0] : 'D'}</span>
            )}
          </div>
        </div>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'donations' ? 'active' : ''}`}
            onClick={() => setActiveTab('donations')}
          >
            My Donations
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'campaigns' ? 'active' : ''}`}
            onClick={() => setActiveTab('campaigns')}
          >
            Campaigns
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'message-admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('message-admin')}
          >
            Message Admin
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'support' ? 'active' : ''}`}
            onClick={() => setActiveTab('support')}
          >
            Support / Help
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Events
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'updates' ? 'active' : ''}`}
            onClick={() => setActiveTab('updates')}
          >
            Updates
          </button>
        </li>
      </ul>

      {activeTab === 'profile' && (
        <ProfileSection />
      )}

      {activeTab === 'overview' && (
        <div>
          {topDonor && (
            <div className="alert alert-primary d-flex flex-wrap align-items-center justify-content-between gap-2">
              <div>
                <strong>🏆 Top Donor Badge</strong>
                <div className="text-muted">
                  {topDonor.name} • ₹{topDonor.total.toFixed(0)} • {topDonor.id === user?.id ? 'You are the Top Supporter!' : 'Top Supporter'}
                </div>
              </div>
            </div>
          )}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <h5>Total Donated</h5>
                  <h3>₹{totalDonated.toFixed(2)}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <h5>Total Donations</h5>
                  <h3>{donations.length}</h3>
                </div>
              </div>
            </div>
          </div>
          <h4>Recent Donations</h4>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.slice(0, 5).map((donation) => (
                  <tr key={donation.id}>
                    <td>{donation.campaigns.title}</td>
                    <td>₹{donation.amount}</td>
                    <td>{new Date(donation.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'donations' && (
        <div>
          <h4 className="mb-3">Donation History</h4>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id}>
                    <td>{donation.campaigns.title}</td>
                    <td>₹{donation.amount}</td>
                    <td>{donation.payment_method.toUpperCase()}</td>
                    <td>{donation.transaction_id}</td>
                    <td>{new Date(donation.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => generateReceipt(donation)}
                      >
                        Download Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div>
          <h4 className="mb-3">Active Campaigns</h4>
          <div className="row">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm campaign-card">
                  <div className="campaign-card-overlay">
                    <button
                      className="btn btn-primary"
                      onClick={() => onNavigate('donate', campaign.id)}
                    >
                      Donate to this Campaign
                    </button>
                  </div>
                  {campaign.image_url && (
                    <img
                      src={campaign.image_url}
                      alt={campaign.title}
                      style={{ width: '100%', height: 160, objectFit: 'cover' }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title text-primary">{campaign.title}</h5>
                    <p className="card-text">{campaign.description}</p>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Raised: ₹{campaign.raised_amount}</span>
                        <span>Goal: ₹{campaign.goal_amount}</span>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{
                            width: `${calculateProgress(campaign.raised_amount, campaign.goal_amount)}%`
                          }}
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
        </div>
      )}

      {activeTab === 'messages' && (
        <div>
          <h4 className="mb-3">Messages from Admin</h4>
          {messages.length === 0 ? (
            <div className="alert alert-info">No messages yet</div>
          ) : (
            <div>
              {messages.map((message) => (
                <div key={message.id} className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">{message.subject}</h5>
                    <p className="card-text">{message.content}</p>
                    <p className="text-muted mb-0">
                      <small>{new Date(message.created_at).toLocaleDateString()}</small>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'message-admin' && (
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="mb-3">Send a Message to Admin</h4>
                <form onSubmit={handleSendMessage}>
                  <div className="mb-3">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      value={messageForm.subject}
                      onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      rows={5}
                      value={messageForm.message}
                      onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">Send Message</button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="mb-3">Your Messages</h4>
                {donorMessages.length === 0 ? (
                  <div className="text-muted">No messages yet.</div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {donorMessages.map((item) => (
                      <div key={item.id} className="border rounded p-3">
                        <div className="d-flex justify-content-between">
                          <strong>{item.subject}</strong>
                          <small className="text-muted">{new Date(item.created_at).toLocaleDateString()}</small>
                        </div>
                        <p className="mb-2">{item.message}</p>
                        {item.admin_reply && (
                          <div className="alert alert-info mb-0">
                            <strong>Admin Reply:</strong> {item.admin_reply}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'support' && (
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="mb-3">Support / Help</h4>
                <form onSubmit={handleSendSupport}>
                  <div className="mb-3">
                    <label className="form-label">Issue Type</label>
                    <select
                      className="form-select"
                      value={supportForm.issue_type}
                      onChange={(e) => setSupportForm({ ...supportForm, issue_type: e.target.value })}
                    >
                      <option value="Donation issue">Donation issue</option>
                      <option value="Payment problem">Payment problem</option>
                      <option value="Campaign information">Campaign information</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      value={supportForm.subject}
                      onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      rows={5}
                      value={supportForm.message}
                      onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">Submit Ticket</button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="mb-3">Support History</h4>
                {supportTickets.length === 0 ? (
                  <div className="text-muted">No support tickets yet.</div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {supportTickets.map((item) => (
                      <div key={item.id} className="border rounded p-3">
                        <div className="d-flex justify-content-between">
                          <strong>{item.subject}</strong>
                          <small className="text-muted">{new Date(item.created_at).toLocaleDateString()}</small>
                        </div>
                        <p className="mb-1 text-muted">{item.issue_type}</p>
                        <p className="mb-2">{item.message}</p>
                        {item.admin_reply && (
                          <div className="alert alert-info mb-0">
                            <strong>Admin Reply:</strong> {item.admin_reply}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div>
          <h4 className="mb-3">Upcoming Events</h4>
          {events.length === 0 ? (
            <div className="alert alert-info">No upcoming events</div>
          ) : (
            <div className="row">
              {events.map((event) => (
                <div key={event.id} className="col-md-6 mb-4">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title text-primary">{event.title}</h5>
                      <p className="card-text">{event.description}</p>
                      <p className="mb-1">
                        <strong>Date:</strong> {new Date(event.event_date).toLocaleString()}
                      </p>
                      <p className="mb-0">
                        <strong>Location:</strong> {event.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'updates' && (
        <div>
          <h4 className="mb-3">Latest Updates</h4>
          <PostsFeed />
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;





