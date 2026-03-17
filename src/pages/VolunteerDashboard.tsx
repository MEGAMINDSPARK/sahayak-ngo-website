import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/useAuth';
import PostsFeed from '../components/PostsFeed';
import ProfileSection from '../components/ProfileSection';
import NotificationBell from '../components/NotificationBell';

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  raised_amount: number;
  image_url?: string | null;
}

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
}

interface Message {
  id: string;
  subject: string;
  content: string;
  created_at: string;
}

interface VolunteerMessage {
  id: string;
  subject: string;
  message: string;
  created_at: string;
  admin_reply?: string | null;
  replied_at?: string | null;
}

interface VolunteerActivity {
  id: string;
  activity_type: string;
  title: string;
  description: string | null;
  created_at: string;
}

interface VolunteerUpload {
  id: string;
  file_url: string;
  description: string | null;
  created_at: string;
}

interface VolunteerRecognition {
  id: string;
  award_type: string;
  note: string | null;
  created_at: string;
}
interface Beneficiary {
  id: string;
  beneficiary_code?: string;
  name: string;
  age: number;
  address: string;
  need_description: string;
  status: string;
  phone?: string;
  email?: string;
  gender?: string;
  date_of_birth?: string;
  id_type?: string;
  id_number?: string;
  id_image_url?: string | null;
}

interface VolunteerStatus {
  id: string;
  volunteer_code?: string;
  status: string;
  skills: string;
  availability: string;
  experience: string;
  phone?: string;
  address?: string;
  gender?: string;
  date_of_birth?: string;
  id_type?: string;
  id_number?: string;
  id_image_url?: string | null;
}

interface VolunteerDashboardProps {
  onNavigate: (page: string) => void;
}

const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [volunteerStatus, setVolunteerStatus] = useState<VolunteerStatus | null>(null);
  const [volunteerMessages, setVolunteerMessages] = useState<VolunteerMessage[]>([]);
  const [volunteerActivities, setVolunteerActivities] = useState<VolunteerActivity[]>([]);
  const [volunteerUploads, setVolunteerUploads] = useState<VolunteerUpload[]>([]);
  const [volunteerRecognitions, setVolunteerRecognitions] = useState<VolunteerRecognition[]>([]);
  const [showBeneficiaryModal, setShowBeneficiaryModal] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [beneficiaryForm, setBeneficiaryForm] = useState({
    name: '',
    age: '',
    address: '',
    need_description: '',
    phone: '',
    email: '',
    gender: '',
    date_of_birth: '',
    id_type: '',
    id_number: ''
  });
  const [beneficiaryIdFile, setBeneficiaryIdFile] = useState<File | null>(null);
  const [volunteerForm, setVolunteerForm] = useState({
    skills: '',
    availability: '',
    experience: '',
    phone: '',
    address: '',
    gender: '',
    date_of_birth: '',
    id_type: '',
    id_number: ''
  });
  const [volunteerIdFile, setVolunteerIdFile] = useState<File | null>(null);
  const [messageForm, setMessageForm] = useState({ subject: '', message: '' });
  const [activityForm, setActivityForm] = useState({
    activity_type: 'Task completed',
    title: '',
    description: ''
  });
  const [uploadForm, setUploadForm] = useState({ description: '' });
  const [uploadFile, setUploadFile] = useState<File | null>(null);

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

  const checkVolunteerStatus = useCallback(async () => {
    const { data } = await supabase
      .from('volunteers')
      .select('*')
      .eq('user_id', user?.id)
      .maybeSingle();

    setVolunteerStatus(data);
  }, [user?.id]);

  const fetchCampaigns = useCallback(async () => {
    const { data } = await supabase
      .from('campaigns')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    setCampaigns(data || []);
  }, []);

  const fetchEvents = useCallback(async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });
    setEvents(data || []);
  }, []);

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('recipient_type', 'volunteers')
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

  const fetchBeneficiaries = useCallback(async () => {
    const { data } = await supabase
      .from('beneficiaries')
      .select('*')
      .eq('added_by', user?.id)
      .order('created_at', { ascending: false });
    setBeneficiaries(data || []);
  }, [user?.id]);

  const fetchVolunteerMessages = useCallback(async () => {
    const { data } = await supabase
      .from('volunteer_messages')
      .select('*')
      .eq('volunteer_id', user?.id)
      .order('created_at', { ascending: false });
    setVolunteerMessages((data || []) as VolunteerMessage[]);
  }, [user?.id]);

  const fetchVolunteerActivities = useCallback(async () => {
    const { data } = await supabase
      .from('volunteer_activities')
      .select('*')
      .eq('volunteer_id', user?.id)
      .order('created_at', { ascending: false });
    setVolunteerActivities((data || []) as VolunteerActivity[]);
  }, [user?.id]);

  const fetchVolunteerUploads = useCallback(async () => {
    const { data } = await supabase
      .from('volunteer_uploads')
      .select('*')
      .eq('volunteer_id', user?.id)
      .order('created_at', { ascending: false });
    setVolunteerUploads((data || []) as VolunteerUpload[]);
  }, [user?.id]);

  const fetchVolunteerRecognitions = useCallback(async () => {
    const { data } = await supabase
      .from('volunteer_recognitions')
      .select('*')
      .eq('volunteer_id', user?.id)
      .order('created_at', { ascending: false });
    setVolunteerRecognitions((data || []) as VolunteerRecognition[]);
  }, [user?.id]);

  useEffect(() => {
    if (user?.role?.toLowerCase() !== 'volunteer') {
      onNavigate('home');
      return;
    }
    checkVolunteerStatus();
    fetchCampaigns();
    fetchEvents();
    fetchMessages();
    fetchBeneficiaries();
    fetchVolunteerMessages();
    fetchVolunteerActivities();
    fetchVolunteerUploads();
    fetchVolunteerRecognitions();
  }, [
    user,
    onNavigate,
    checkVolunteerStatus,
    fetchCampaigns,
    fetchEvents,
    fetchMessages,
    fetchBeneficiaries,
    fetchVolunteerMessages,
    fetchVolunteerActivities,
    fetchVolunteerUploads,
    fetchVolunteerRecognitions
  ]);

  const handleVolunteerApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteerIdFile) {
      alert('Please upload a government ID image.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(volunteerIdFile.type)) {
      alert('Please upload a JPG, PNG, or WEBP image.');
      return;
    }

    const maxSizeMb = 3;
    if (volunteerIdFile.size > maxSizeMb * 1024 * 1024) {
      alert(`ID image must be less than ${maxSizeMb}MB.`);
      return;
    }

    const fileExt = volunteerIdFile.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filePath = `volunteer-${user?.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('volunteer-ids')
      .upload(filePath, volunteerIdFile, { upsert: true });

    if (uploadError) {
      alert(uploadError.message || 'Failed to upload ID image.');
      return;
    }

    const { data: publicData } = supabase.storage
      .from('volunteer-ids')
      .getPublicUrl(filePath);

    const idImageUrl = publicData?.publicUrl || null;

    const volunteerCode = `VOL-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

    const { error } = await supabase.from('volunteers').insert([
      {
        user_id: user?.id,
        ...volunteerForm,
        status: 'pending',
        id_image_url: idImageUrl,
        volunteer_code: volunteerCode
      }
    ]);

    if (!error) {
      setShowVolunteerModal(false);
      setVolunteerForm({
        skills: '',
        availability: '',
        experience: '',
        phone: '',
        address: '',
        gender: '',
        date_of_birth: '',
        id_type: '',
        id_number: ''
      });
      setVolunteerIdFile(null);
      checkVolunteerStatus();
      alert('Volunteer application submitted! Waiting for admin approval.');
      await notifyAdmins({
        icon: '📝',
        message: `New volunteer application from ${user?.full_name || 'a volunteer'}.`
      });
      await supabase.from('volunteer_activities').insert([
        {
          volunteer_id: user?.id,
          activity_type: 'Application',
          title: 'Volunteer application submitted',
          description: 'Submitted volunteer application for review.'
        }
      ]);
    }
  };

  const handleAddBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!beneficiaryIdFile) {
      alert('Please upload a government ID image.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(beneficiaryIdFile.type)) {
      alert('Please upload a JPG, PNG, or WEBP image.');
      return;
    }

    const maxSizeMb = 3;
    if (beneficiaryIdFile.size > maxSizeMb * 1024 * 1024) {
      alert(`ID image must be less than ${maxSizeMb}MB.`);
      return;
    }

    let idImageUrl: string | null = null;
    const fileExt = beneficiaryIdFile.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filePath = `beneficiary-${user?.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('beneficiary-ids')
      .upload(filePath, beneficiaryIdFile, { upsert: true });

    if (uploadError) {
      alert(uploadError.message || 'Failed to upload ID image.');
      return;
    }

    const { data: publicData } = supabase.storage
      .from('beneficiary-ids')
      .getPublicUrl(filePath);

    idImageUrl = publicData?.publicUrl || null;

    const beneficiaryCode = `BEN-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

    const { error } = await supabase.from('beneficiaries').insert([
      {
        ...beneficiaryForm,
        age: parseInt(beneficiaryForm.age),
        added_by: user?.id,
        status: 'pending',
        id_image_url: idImageUrl,
        beneficiary_code: beneficiaryCode
      }
    ]);

    if (!error) {
      setShowBeneficiaryModal(false);
      setBeneficiaryForm({
        name: '',
        age: '',
        address: '',
        need_description: '',
        phone: '',
        email: '',
        gender: '',
        date_of_birth: '',
        id_type: '',
        id_number: ''
      });
      setBeneficiaryIdFile(null);
      fetchBeneficiaries();
      alert('Beneficiary added! Waiting for admin approval.');
      await notifyAdmins({
        icon: '🧾',
        message: `New beneficiary added by ${user?.full_name || 'a volunteer'}: ${beneficiaryForm.name}`
      });
      await supabase.from('volunteer_activities').insert([
        {
          volunteer_id: user?.id,
          activity_type: 'Beneficiary',
          title: 'Added beneficiary',
          description: beneficiaryForm.name
        }
      ]);
      fetchVolunteerActivities();
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from('volunteer_messages').insert([
      {
        volunteer_id: user.id,
        subject: messageForm.subject,
        message: messageForm.message
      }
    ]);
    if (error) {
      alert(error.message || 'Failed to send message.');
      return;
    }
    setMessageForm({ subject: '', message: '' });
    fetchVolunteerMessages();
    await notifyAdmins({
      icon: '💬',
      message: `Volunteer message from ${user.full_name}: ${messageForm.subject}`
    });
    await supabase.from('volunteer_activities').insert([
      {
        volunteer_id: user.id,
        activity_type: 'Message',
        title: 'Sent message to admin',
        description: messageForm.subject
      }
    ]);
    fetchVolunteerActivities();
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from('volunteer_activities').insert([
      {
        volunteer_id: user.id,
        activity_type: activityForm.activity_type,
        title: activityForm.title,
        description: activityForm.description
      }
    ]);
    if (error) {
      alert(error.message || 'Failed to save activity.');
      return;
    }
    setActivityForm({ activity_type: 'Task completed', title: '', description: '' });
    fetchVolunteerActivities();
  };

  const handleUploadProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !uploadFile) {
      alert('Please select a file.');
      return;
    }
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(uploadFile.type)) {
      alert('Upload JPG, PNG, or WEBP only.');
      return;
    }
    const fileExt = uploadFile.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filePath = `volunteer-${user.id}-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('volunteer-proofs')
      .upload(filePath, uploadFile, { upsert: true });
    if (uploadError) {
      alert(uploadError.message || 'Failed to upload file.');
      return;
    }
    const { data } = supabase.storage.from('volunteer-proofs').getPublicUrl(filePath);
    const fileUrl = data?.publicUrl || '';
    const { error } = await supabase.from('volunteer_uploads').insert([
      {
        volunteer_id: user.id,
        file_url: fileUrl,
        description: uploadForm.description
      }
    ]);
    if (error) {
      alert(error.message || 'Failed to save upload.');
      return;
    }
    setUploadForm({ description: '' });
    setUploadFile(null);
    fetchVolunteerUploads();
    await notifyAdmins({
      icon: '📸',
      message: `New activity proof uploaded by ${user.full_name}.`
    });
    await supabase.from('volunteer_activities').insert([
      {
        volunteer_id: user.id,
        activity_type: 'Upload',
        title: 'Uploaded activity proof',
        description: uploadForm.description
      }
    ]);
    fetchVolunteerActivities();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
        <h2 className="mb-0">Volunteer Dashboard</h2>
        <div className="d-flex align-items-center gap-3">
          {user?.id && <NotificationBell recipientId={user.id} />}
          <div className="profile-avatar profile-avatar-lg">
            {user?.profile_image ? (
              <img src={user.profile_image} alt={user.full_name || 'Volunteer'} />
            ) : (
              <span>{user?.full_name ? user.full_name[0] : 'V'}</span>
            )}
          </div>
        </div>
      </div>

      {!volunteerStatus && (
        <div className="alert alert-warning mb-4">
          <p className="mb-2">You haven't applied as a volunteer yet.</p>
          <button className="btn btn-primary" onClick={() => setShowVolunteerModal(true)}>
            Apply Now
          </button>
        </div>
      )}

      {volunteerStatus && volunteerStatus.status === 'pending' && (
        <div className="alert alert-info mb-4">
          Your volunteer application is pending admin approval.
        </div>
      )}

      {volunteerStatus && volunteerStatus.status === 'rejected' && (
        <div className="alert alert-danger mb-4">
          Your volunteer application was rejected. Please contact admin for more information.
        </div>
      )}

      {volunteerStatus && volunteerStatus.status === 'approved' && (
        <div className="alert alert-success mb-4">
          You are an approved volunteer! Thank you for your service.
        </div>
      )}

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
            className={`nav-link ${activeTab === 'campaigns' ? 'active' : ''}`}
            onClick={() => setActiveTab('campaigns')}
          >
            Campaigns
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
            className={`nav-link ${activeTab === 'beneficiaries' ? 'active' : ''}`}
            onClick={() => setActiveTab('beneficiaries')}
          >
            Beneficiaries
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
            className={`nav-link ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            Activity History
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'uploads' ? 'active' : ''}`}
            onClick={() => setActiveTab('uploads')}
          >
            Upload Proof
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'recognition' ? 'active' : ''}`}
            onClick={() => setActiveTab('recognition')}
          >
            Recognition
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

      {activeTab === 'overview' && (
        <div>
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <h5>Active Campaigns</h5>
                  <h3>{campaigns.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <h5>Upcoming Events</h5>
                  <h3>{events.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <h5>Beneficiaries Added</h5>
                  <h3>{beneficiaries.length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <ProfileSection />
      )}

      {activeTab === 'campaigns' && (
        <div>
          <h4 className="mb-3">Active Campaigns</h4>
          <div className="row">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
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
                            width: `${Math.min((campaign.raised_amount / campaign.goal_amount) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                        <strong>Date:</strong> {formatDate(event.event_date)}
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

      {activeTab === 'beneficiaries' && (
        <div>
          <button
            className="btn btn-primary mb-3"
            onClick={() => setShowBeneficiaryModal(true)}
            disabled={volunteerStatus?.status !== 'approved'}
          >
            Add Beneficiary
          </button>
          {volunteerStatus?.status !== 'approved' && (
            <p className="text-muted">You must be an approved volunteer to add beneficiaries.</p>
          )}
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Address</th>
                  <th>Need</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {beneficiaries.map((beneficiary) => (
                  <tr key={beneficiary.id}>
                    <td>{beneficiary.name}</td>
                    <td>{beneficiary.age}</td>
                    <td>{beneficiary.address}</td>
                    <td>{beneficiary.need_description}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          beneficiary.status === 'approved'
                            ? 'success'
                            : beneficiary.status === 'pending'
                            ? 'warning'
                            : 'danger'
                        }`}
                      >
                        {beneficiary.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                <h4 className="mb-3">Send Message to Admin</h4>
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
                {volunteerMessages.length === 0 ? (
                  <div className="text-muted">No messages yet.</div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {volunteerMessages.map((item) => (
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

      {activeTab === 'activity' && (
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="mb-3">Log an Activity</h4>
                <form onSubmit={handleAddActivity}>
                  <div className="mb-3">
                    <label className="form-label">Type</label>
                    <select
                      className="form-select"
                      value={activityForm.activity_type}
                      onChange={(e) => setActivityForm({ ...activityForm, activity_type: e.target.value })}
                    >
                      <option>Task completed</option>
                      <option>Campaign participated</option>
                      <option>Field visit</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={activityForm.title}
                      onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      value={activityForm.description}
                      onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">Save Activity</button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="mb-3">Your Activity History</h4>
                {volunteerActivities.length === 0 ? (
                  <div className="text-muted">No activities yet.</div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {volunteerActivities.map((activity) => (
                      <div key={activity.id} className="border rounded p-3">
                        <div className="d-flex justify-content-between">
                          <strong>{activity.title}</strong>
                          <small className="text-muted">{new Date(activity.created_at).toLocaleDateString()}</small>
                        </div>
                        <div className="text-muted">{activity.activity_type}</div>
                        {activity.description && <p className="mb-0">{activity.description}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'uploads' && (
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="mb-3">Upload Activity Proof</h4>
                <form onSubmit={handleUploadProof}>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      className="form-control"
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Upload Photo</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Upload</button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="mb-3">Your Uploads</h4>
                {volunteerUploads.length === 0 ? (
                  <div className="text-muted">No uploads yet.</div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {volunteerUploads.map((upload) => (
                      <div key={upload.id} className="border rounded p-3">
                        <div className="d-flex justify-content-between">
                          <strong>{upload.description || 'Activity proof'}</strong>
                          <small className="text-muted">{new Date(upload.created_at).toLocaleDateString()}</small>
                        </div>
                        <img
                          src={upload.file_url}
                          alt="Activity proof"
                          className="img-fluid rounded mt-2"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recognition' && (
        <div>
          <h4 className="mb-3">Recognition</h4>
          {volunteerRecognitions.length === 0 ? (
            <div className="text-muted">No recognitions awarded yet.</div>
          ) : (
            <div className="row g-3">
              {volunteerRecognitions.map((item) => (
                <div key={item.id} className="col-md-6">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5 className="mb-1">🏅 {item.award_type}</h5>
                      {item.note && <p className="mb-2">{item.note}</p>}
                      <small className="text-muted">{new Date(item.created_at).toLocaleDateString()}</small>
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

      {showVolunteerModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Volunteer Application</h5>
                <button type="button" className="btn-close" onClick={() => setShowVolunteerModal(false)}></button>
              </div>
              <form onSubmit={handleVolunteerApplication}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Skills</label>
                    <input
                      type="text"
                      className="form-control"
                      value={volunteerForm.skills}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, skills: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Availability</label>
                    <input
                      type="text"
                      className="form-control"
                      value={volunteerForm.availability}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, availability: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Experience</label>
                    <textarea
                      className="form-control"
                      value={volunteerForm.experience}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, experience: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={volunteerForm.phone}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={volunteerForm.address}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select"
                      value={volunteerForm.gender}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, gender: e.target.value })}
                      required
                    >
                      <option value="">Select</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      className="form-control"
                      value={volunteerForm.date_of_birth}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, date_of_birth: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Government ID Type</label>
                    <input
                      type="text"
                      className="form-control"
                      value={volunteerForm.id_type}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, id_type: e.target.value })}
                      placeholder="Aadhaar, PAN, Voter ID, etc."
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Government ID Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={volunteerForm.id_number}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, id_number: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Government ID Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setVolunteerIdFile(e.target.files?.[0] || null)}
                      required
                    />
                    <div className="form-text">Upload JPG/PNG/WEBP, max 3MB.</div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowVolunteerModal(false)}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showBeneficiaryModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Beneficiary</h5>
                <button type="button" className="btn-close" onClick={() => setShowBeneficiaryModal(false)}></button>
              </div>
              <form onSubmit={handleAddBeneficiary}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={beneficiaryForm.name}
                      onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      className="form-control"
                      value={beneficiaryForm.age}
                      onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, age: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={beneficiaryForm.address}
                      onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Need Description</label>
                    <textarea
                      className="form-control"
                      value={beneficiaryForm.need_description}
                      onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, need_description: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={beneficiaryForm.phone}
                      onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={beneficiaryForm.email}
                      onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, email: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select"
                      value={beneficiaryForm.gender}
                      onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, gender: e.target.value })}
                    >
                      <option value="">Select</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      className="form-control"
                      value={beneficiaryForm.date_of_birth}
                      onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, date_of_birth: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Government ID Type</label>
                    <input
                      type="text"
                      className="form-control"
                      value={beneficiaryForm.id_type}
                      onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, id_type: e.target.value })}
                      placeholder="Aadhaar, PAN, Voter ID, etc."
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Government ID Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={beneficiaryForm.id_number}
                      onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, id_number: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Government ID Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setBeneficiaryIdFile(e.target.files?.[0] || null)}
                      required
                    />
                    <div className="form-text">Upload JPG/PNG/WEBP, max 3MB.</div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowBeneficiaryModal(false)}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Beneficiary
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboard;
