import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/useAuth';
import '../styles/AdminDashboard.css';
import NotificationBell from '../components/NotificationBell';

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  raised_amount: number;
  status: string;
  image_url?: string | null;
}

interface Volunteer {
  id: string;
  volunteer_code?: string;
  user_id: string;
  skills: string;
  availability: string;
  experience: string;
  status: string;
  users: UserRef | UserRef[] | null;
  phone?: string;
  address?: string;
  gender?: string;
  date_of_birth?: string;
  id_type?: string;
  id_number?: string;
  id_image_url?: string | null;
}

interface Donor {
  id: string;
  email: string;
  full_name: string;
}

interface Beneficiary {
  id: string;
  beneficiary_code?: string;
  name: string;
  age: number;
  address: string;
  need_description: string;
  status: string;
  added_by: string;
  phone?: string;
  email?: string;
  gender?: string;
  date_of_birth?: string;
  id_type?: string;
  id_number?: string;
  id_image_url?: string | null;
}

interface DonorMessage {
  id: string;
  donor_id: string;
  subject: string;
  message: string;
  created_at: string;
  admin_reply?: string | null;
  replied_at?: string | null;
  users?: UserRef | UserRef[] | null;
}

interface DonorSupport {
  id: string;
  donor_id: string;
  issue_type: string;
  subject: string;
  message: string;
  created_at: string;
  admin_reply?: string | null;
  replied_at?: string | null;
  users?: UserRef | UserRef[] | null;
}
interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  event_date: string | null;
  location: string | null;
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  location: string | null;
  created_at: string;
}

interface Stats {
  totalDonations: number;
  totalDonors: number;
  totalVolunteers: number;
  totalCampaigns: number;
  totalBeneficiaries: number;
}

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

interface Donation {
  id: string;
  amount: number;
  payment_method: string;
  transaction_id: string;
  created_at: string;
  donor_id?: string | null;
  campaign_id?: string | null;
  users?: UserRef | UserRef[] | null;
  campaigns?: CampaignRef | CampaignRef[] | null;
}

interface VolunteerMessage {
  id: string;
  volunteer_id: string;
  subject: string;
  message: string;
  created_at: string;
  admin_reply?: string | null;
  replied_at?: string | null;
  users?: UserRef | UserRef[] | null;
}

interface VolunteerUpload {
  id: string;
  volunteer_id: string;
  file_url: string;
  description: string | null;
  created_at: string;
  users?: UserRef | UserRef[] | null;
}

interface VolunteerRecognition {
  id: string;
  volunteer_id: string;
  award_type: string;
  note: string | null;
  created_at: string;
  users?: UserRef | UserRef[] | null;
}

type UserRef = { full_name: string; email: string };
type CampaignRef = { title: string };

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<Stats>({
    totalDonations: 0,
    totalDonors: 0,
    totalVolunteers: 0,
    totalCampaigns: 0,
    totalBeneficiaries: 0
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [donorMessages, setDonorMessages] = useState<DonorMessage[]>([]);
  const [supportTickets, setSupportTickets] = useState<DonorSupport[]>([]);
  const [donorReplyDrafts, setDonorReplyDrafts] = useState<Record<string, string>>({});
  const [supportReplyDrafts, setSupportReplyDrafts] = useState<Record<string, string>>({});
  const [volunteerMessages, setVolunteerMessages] = useState<VolunteerMessage[]>([]);
  const [volunteerUploads, setVolunteerUploads] = useState<VolunteerUpload[]>([]);
  const [volunteerRecognitions, setVolunteerRecognitions] = useState<VolunteerRecognition[]>([]);
  const [recognitionForm, setRecognitionForm] = useState({ volunteer_id: '', award_type: 'Star Volunteer Badge', note: '' });
  const [volunteerReplyDrafts, setVolunteerReplyDrafts] = useState<Record<string, string>>({});

  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showVolunteerView, setShowVolunteerView] = useState(false);
  const [showBeneficiaryView, setShowBeneficiaryView] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [postError, setPostError] = useState('');
  const [postSubmitting, setPostSubmitting] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    description: '',
    goal_amount: '',
    image_url: ''
  });
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_date: '',
    location: ''
  });
  const [messageForm, setMessageForm] = useState({
    recipient_type: 'donors',
    subject: '',
    content: ''
  });
  const [postForm, setPostForm] = useState({
    title: '',
    description: '',
    image_url: '',
    event_date: '',
    location: ''
  });

  useEffect(() => {
    if (user?.role?.toLowerCase() !== 'admin') {
      onNavigate('home');
      return;
    }
    fetchStats();
    fetchCampaigns();
    fetchVolunteers();
    fetchDonors();
    fetchBeneficiaries();
    fetchPosts();
    fetchEvents();
    fetchDonations();
    fetchDonorMessages();
    fetchSupportTickets();
    fetchVolunteerMessages();
    fetchVolunteerUploads();
    fetchVolunteerRecognitions();

    const interval = window.setInterval(() => {
      fetchCampaigns();
      fetchDonations();
      fetchStats();
    }, 30000);

    return () => window.clearInterval(interval);
  }, [user, onNavigate]);

  const fetchStats = async () => {
    const { data: donations } = await supabase.from('donations').select('amount');
    const totalDonations = donations?.reduce((sum, d) => sum + parseFloat(d.amount), 0) || 0;

    const { data: donorsData } = await supabase.from('users').select('id').eq('role', 'donor');
    const { data: volunteersData } = await supabase.from('volunteers').select('id').eq('status', 'approved');
    const { data: campaignsData } = await supabase.from('campaigns').select('id');
    const { data: beneficiariesData } = await supabase.from('beneficiaries').select('id');

    setStats({
      totalDonations,
      totalDonors: donorsData?.length || 0,
      totalVolunteers: volunteersData?.length || 0,
      totalCampaigns: campaignsData?.length || 0,
      totalBeneficiaries: beneficiariesData?.length || 0
    });
  };

  const fetchCampaigns = async () => {
    const { data } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false });
    setCampaigns(data || []);
  };

  const fetchVolunteers = async () => {
    const { data } = await supabase
      .from('volunteers')
      .select('*, users(full_name, email)')
      .order('created_at', { ascending: false });
    setVolunteers(data || []);
  };

  const fetchDonors = async () => {
    const { data } = await supabase.from('users').select('*').eq('role', 'donor');
    setDonors(data || []);
  };

  const fetchBeneficiaries = async () => {
    const { data } = await supabase.from('beneficiaries').select('*').order('created_at', { ascending: false });
    setBeneficiaries(data || []);
  };

  const fetchPosts = async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
  };

  const fetchEvents = async () => {
    const { data } = await supabase.from('events').select('*').order('event_date', { ascending: true });
    setEvents(data || []);
  };

  const fetchDonations = async () => {
    const { data } = await supabase
      .from('donations')
      .select('id, amount, payment_method, transaction_id, created_at, donor_id, campaign_id, users(full_name, email), campaigns(title)')
      .order('created_at', { ascending: false });

    if (!data || data.length === 0) {
      setDonations([]);
      return;
    }

    const needsManualJoin = data.some((item: any) => !item.users || !item.campaigns);

    if (!needsManualJoin) {
      setDonations(data as Donation[]);
      return;
    }

    const donorIds = Array.from(new Set(data.map((d: any) => d.donor_id).filter(Boolean)));
    const campaignIds = Array.from(new Set(data.map((d: any) => d.campaign_id).filter(Boolean)));

    const [{ data: donorsData }, { data: campaignsData }] = await Promise.all([
      supabase.from('users').select('id, full_name, email').in('id', donorIds),
      supabase.from('campaigns').select('id, title').in('id', campaignIds)
    ]);

    const donorMap = new Map((donorsData || []).map((u: any) => [u.id, u]));
    const campaignMap = new Map((campaignsData || []).map((c: any) => [c.id, c]));

    const merged = data.map((d: any) => ({
      ...d,
      users: d.users || (d.donor_id ? donorMap.get(d.donor_id) : null),
      campaigns: d.campaigns || (d.campaign_id ? campaignMap.get(d.campaign_id) : null)
    }));

    setDonations(merged as Donation[]);
  };

  const fetchDonorMessages = async () => {
    const { data } = await supabase
      .from('donor_messages')
      .select('id, donor_id, subject, message, admin_reply, replied_at, created_at, users(full_name, email)')
      .order('created_at', { ascending: false });

    if (!data || data.length === 0) {
      setDonorMessages([]);
      return;
    }

    const needsManualJoin = data.some((item: any) => !item.users);
    if (!needsManualJoin) {
      setDonorMessages((data || []) as DonorMessage[]);
      return;
    }

    const donorIds = Array.from(new Set(data.map((d: any) => d.donor_id).filter(Boolean)));
    const { data: donorsData } = await supabase.from('users').select('id, full_name, email').in('id', donorIds);
    const donorMap = new Map((donorsData || []).map((u: any) => [u.id, u]));
    const merged = data.map((d: any) => ({
      ...d,
      users: d.users || (d.donor_id ? donorMap.get(d.donor_id) : null)
    }));
    setDonorMessages(merged as DonorMessage[]);
  };

  const fetchSupportTickets = async () => {
    const { data } = await supabase
      .from('donor_support')
      .select('*, users(full_name, email)')
      .order('created_at', { ascending: false });
    setSupportTickets((data || []) as DonorSupport[]);
  };

  const fetchVolunteerMessages = async () => {
    const { data } = await supabase
      .from('volunteer_messages')
      .select('*, users(full_name, email)')
      .order('created_at', { ascending: false });
    setVolunteerMessages((data || []) as VolunteerMessage[]);
  };

  const fetchVolunteerUploads = async () => {
    const { data } = await supabase
      .from('volunteer_uploads')
      .select('*, users(full_name, email)')
      .order('created_at', { ascending: false });
    setVolunteerUploads((data || []) as VolunteerUpload[]);
  };

  const fetchVolunteerRecognitions = async () => {
    const { data } = await supabase
      .from('volunteer_recognitions')
      .select('*, users(full_name, email)')
      .order('created_at', { ascending: false });
    setVolunteerRecognitions((data || []) as VolunteerRecognition[]);
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('campaigns').insert([
      {
        ...campaignForm,
        image_url: campaignForm.image_url?.trim() || null,
        goal_amount: parseFloat(campaignForm.goal_amount),
        raised_amount: 0,
        status: 'active',
        created_by: user?.id
      }
    ]);

    if (!error) {
      setShowCampaignModal(false);
      setCampaignForm({ title: '', description: '', goal_amount: '', image_url: '' });
      fetchCampaigns();
      fetchStats();
      const { data: volunteerUsers } = await supabase.from('users').select('id').eq('role', 'volunteer');
      const volunteerIds = (volunteerUsers || []).map((u: any) => u.id);
      await createNotifications(volunteerIds, {
        icon: '📣',
        message: `New campaign needs volunteers: ${campaignForm.title}`
      });
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      await supabase.from('campaigns').delete().eq('id', id);
      fetchCampaigns();
      fetchStats();
    }
  };

  const handleVolunteerStatus = async (id: string, status: string) => {
    await supabase.from('volunteers').update({ status }).eq('id', id);
    fetchVolunteers();
    fetchStats();
    const volunteer = volunteers.find((v) => v.id === id);
    if (volunteer?.user_id) {
      await createNotifications([volunteer.user_id], {
        icon: status === 'approved' ? '✅' : '❌',
        message:
          status === 'approved'
            ? 'Your volunteer application has been approved.'
            : 'Your volunteer application has been rejected.'
      });
    }
  };

  const handleBeneficiaryStatus = async (id: string, status: string) => {
    await supabase.from('beneficiaries').update({ status }).eq('id', id);
    fetchBeneficiaries();
    fetchStats();
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('messages').insert([
      {
        ...messageForm,
        sender_id: user?.id
      }
    ]);

    if (!error) {
      setShowMessageModal(false);
      setMessageForm({ recipient_type: 'donors', subject: '', content: '' });
      alert('Message sent successfully!');
      const targetRole = messageForm.recipient_type === 'donors' ? 'donor' : 'volunteer';
      const { data: recipients } = await supabase.from('users').select('id').eq('role', targetRole);
      const recipientIds = (recipients || []).map((u: any) => u.id);
      await createNotifications(recipientIds, {
        icon: '📢',
        message: `Admin message: ${messageForm.subject}`
      });
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostError('');
    setPostSubmitting(true);

    const eventDateValue = postForm.event_date ? new Date(postForm.event_date).toISOString() : null;

    const { error } = await supabase.from('posts').insert([
      {
        title: postForm.title,
        description: postForm.description,
        image_url: postForm.image_url || null,
        event_date: eventDateValue,
        location: postForm.location || null,
        created_by: user?.id
      }
    ]);

    if (error) {
      setPostError(error.message || 'Failed to publish post.');
      setPostSubmitting(false);
      return;
    }

    setShowPostModal(false);
    setPostForm({ title: '', description: '', image_url: '', event_date: '', location: '' });
    setPostSubmitting(false);
    fetchPosts();
    const { data: donorsData } = await supabase.from('users').select('id').eq('role', 'donor');
    const donorIds = (donorsData || []).map((u: any) => u.id);
    await createNotifications(donorIds, {
      icon: '📰',
      message: `Campaign update: ${postForm.title}`
    });
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    const eventDateValue = eventForm.event_date ? new Date(eventForm.event_date).toISOString() : null;

    const { error } = await supabase.from('events').insert([
      {
        title: eventForm.title,
        description: eventForm.description || null,
        event_date: eventDateValue,
        location: eventForm.location,
        created_by: user?.id
      }
    ]);

    if (error) {
      alert(error.message || 'Failed to create event.');
      return;
    }

    setShowEventModal(false);
    setEventForm({ title: '', description: '', event_date: '', location: '' });
    fetchEvents();
  };

  const handleDeletePost = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await supabase.from('posts').delete().eq('id', id);
      fetchPosts();
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await supabase.from('events').delete().eq('id', id);
      fetchEvents();
    }
  };

  const formatPrintDate = (value?: string | null) => {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
  };

  const getUserName = (users?: UserRef | UserRef[] | null) => {
    if (!users) return undefined;
    return Array.isArray(users) ? users[0]?.full_name : users.full_name;
  };

  const getUserEmail = (users?: UserRef | UserRef[] | null) => {
    if (!users) return undefined;
    return Array.isArray(users) ? users[0]?.email : users.email;
  };

  const getCampaignTitle = (campaignsValue?: CampaignRef | CampaignRef[] | null) => {
    if (!campaignsValue) return undefined;
    return Array.isArray(campaignsValue) ? campaignsValue[0]?.title : campaignsValue.title;
  };

  const createNotifications = async (userIds: string[], payload: { icon: string; message: string }) => {
    if (userIds.length === 0) return;
    await supabase.from('notifications').insert(
      userIds.map((id) => ({
        recipient_id: id,
        icon: payload.icon,
        message: payload.message,
        is_read: false
      }))
    );
  };

  const calculateProgress = (raised: number, goal: number) => {
    if (!goal) return 0;
    return Math.min((raised / goal) * 100, 100);
  };

  const getMonthKey = (dateValue: string) => {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return 'Unknown';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  const formatMonthLabel = (key: string) => {
    if (key === 'Unknown') return 'Unknown';
    const [year, month] = key.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    return date.toLocaleString('en-IN', { month: 'short', year: 'numeric' });
  };

  const monthlyDonationData = (() => {
    const totals: Record<string, number> = {};
    donations.forEach((donation) => {
      const key = getMonthKey(donation.created_at);
      totals[key] = (totals[key] || 0) + (donation.amount || 0);
    });
    return Object.keys(totals)
      .sort()
      .map((key) => ({ key, label: formatMonthLabel(key), total: totals[key] }));
  })();

  const topDonorsData = (() => {
    const totals: Record<string, { name: string; total: number }> = {};
    donations.forEach((donation) => {
      const name = getUserName(donation.users) || 'Anonymous';
      totals[name] = totals[name] || { name, total: 0 };
      totals[name].total += donation.amount || 0;
    });
    return Object.values(totals)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  })();

  const mostSuccessfulCampaign = (() => {
    if (campaigns.length === 0) return null;
    return campaigns.reduce((best, current) => {
      if (!best) return current;
      return current.raised_amount > best.raised_amount ? current : best;
    }, campaigns[0] as Campaign);
  })();

  const handleDownloadDonationReceipt = async (donation: Donation) => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const logoDataUrl = await loadImageDataUrl('/images/sahayak-logo.png.webp');
    if (logoDataUrl) {
      doc.addImage(logoDataUrl, 'PNG', 24, 24, 48, 48);
    }
    doc.setFontSize(16);
    doc.text('Sahayak NGO - Donation Receipt', 88, 48);
    doc.setFontSize(11);

    const left = 24;
    const labelWidth = 140;
    const valueWidth = 400;
    let cursorY = 100;

    const addRow = (label: string, value: string) => {
      const safeValue = value || '—';
      const wrapped = doc.splitTextToSize(safeValue, valueWidth);
      doc.setFont('helvetica', 'bold');
      doc.text(label, left, cursorY);
      doc.setFont('helvetica', 'normal');
      doc.text(wrapped, left + labelWidth, cursorY);
      cursorY += wrapped.length * 14 + 6;
    };

    addRow('Receipt ID:', donation.transaction_id || donation.id);
    addRow('Donor Name:', getUserName(donation.users) || 'Anonymous');
    addRow('Donor Email:', getUserEmail(donation.users) || '—');
    addRow('Campaign:', getCampaignTitle(donation.campaigns) || 'General');
    addRow('Amount:', `INR ${donation.amount}`);
    addRow('Payment Method:', donation.payment_method?.toUpperCase() || '—');
    addRow('Date:', formatPrintDate(donation.created_at));
    addRow('Status:', 'SUCCESSFUL');

    if (logoDataUrl) {
      doc.addImage(logoDataUrl, 'PNG', 24, 720, 36, 36);
    }
    doc.setFontSize(10);
    doc.text('Sahayak NGO', 70, 742);
    doc.setFontSize(9);
    doc.text('Authorized by Sahayak NGO', 24, 765);

    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(1.2);
    doc.rect(16, 16, 563, 810);

    doc.save(`receipt_${donation.transaction_id || donation.id}.pdf`);
  };

  const handleReplyDonorMessage = async (id: string, donorId: string, reply: string) => {
    if (!reply || !reply.trim()) {
      alert('Please enter a reply before sending.');
      return;
    }
    const { error } = await supabase
      .from('donor_messages')
      .update({ admin_reply: reply.trim(), replied_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      alert(error.message || 'Failed to send reply.');
      return;
    }
    await createNotifications([donorId], { icon: '💬', message: 'Admin replied to your message.' });
    setDonorReplyDrafts((prev) => ({ ...prev, [id]: '' }));
    fetchDonorMessages();
  };

  const handleReplySupport = async (id: string, donorId: string, reply: string) => {
    if (!reply || !reply.trim()) {
      alert('Please enter a reply before sending.');
      return;
    }
    const { error } = await supabase
      .from('donor_support')
      .update({ admin_reply: reply.trim(), replied_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      alert(error.message || 'Failed to send reply.');
      return;
    }
    await createNotifications([donorId], { icon: '🆘', message: 'Admin replied to your support request.' });
    setSupportReplyDrafts((prev) => ({ ...prev, [id]: '' }));
    fetchSupportTickets();
  };

  const handleReplyVolunteerMessage = async (id: string, volunteerId: string, reply: string) => {
    if (!reply || !reply.trim()) {
      alert('Please enter a reply before sending.');
      return;
    }
    const { error } = await supabase
      .from('volunteer_messages')
      .update({ admin_reply: reply.trim(), replied_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      alert(error.message || 'Failed to send reply.');
      return;
    }
    await createNotifications([volunteerId], { icon: '💬', message: 'Admin replied to your message.' });
    setVolunteerReplyDrafts((prev) => ({ ...prev, [id]: '' }));
    fetchVolunteerMessages();
  };

  const handleAwardRecognition = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('volunteer_recognitions').insert([
      {
        volunteer_id: recognitionForm.volunteer_id,
        award_type: recognitionForm.award_type,
        note: recognitionForm.note
      }
    ]);
    if (error) {
      alert(error.message || 'Failed to award recognition.');
      return;
    }
    setRecognitionForm({ volunteer_id: '', award_type: 'Star Volunteer Badge', note: '' });
    fetchVolunteerRecognitions();
    if (recognitionForm.volunteer_id) {
      await createNotifications([recognitionForm.volunteer_id], {
        icon: '🏅',
        message: `Congratulations! You received: ${recognitionForm.award_type}`
      });
    }
  };


  const loadImageDataUrl = async (src: string) => {
    try {
      const response = await fetch(src);
      if (!response.ok) return null;
      const blob = await response.blob();
      return await new Promise<string | null>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  const getImageFormat = (dataUrl: string) => {
    if (dataUrl.includes('image/png')) return 'PNG';
    return 'JPEG';
  };

  const buildVolunteerPdf = async (volunteer: Volunteer) => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const logoDataUrl = await loadImageDataUrl('/images/sahayak-logo.png.webp');
    if (logoDataUrl) {
      doc.addImage(logoDataUrl, 'PNG', 24, 24, 48, 48);
    }
    doc.setFontSize(16);
    doc.text('Sahayak NGO - Volunteer Profile', 88, 48);
    doc.setFontSize(11);

    const left = 24;
    const labelWidth = 160;
    const valueWidth = 340;
    let cursorY = 110;

    const addRow = (label: string, value: string) => {
      const safeValue = value || '???';
      const wrapped = doc.splitTextToSize(safeValue, valueWidth);
      doc.setFont('helvetica', 'bold');
      doc.text(label, left, cursorY);
      doc.setFont('helvetica', 'normal');
      doc.text(wrapped, left + labelWidth, cursorY);
      cursorY += wrapped.length * 14 + 6;
    };

    const passport = volunteer.id_image_url ? await loadImageDataUrl(volunteer.id_image_url) : null;
    if (passport) {
      const pageWidth = doc.internal.pageSize.getWidth();
      const photoSize = 90;
      const photoX = pageWidth - photoSize - 28;
      const photoY = 90;
      doc.addImage(passport, getImageFormat(passport), photoX, photoY, photoSize, photoSize);
      doc.setDrawColor(15, 23, 42);
      doc.rect(photoX - 2, photoY - 2, photoSize + 4, photoSize + 4);
    }

    addRow('Volunteer ID:', volunteer.volunteer_code || volunteer.id);
    addRow('Name:', getUserName(volunteer.users) || '???');
    addRow('Email:', getUserEmail(volunteer.users) || '???');
    addRow('Phone:', volunteer.phone || '???');
    addRow('Address:', volunteer.address || '???');
    addRow('Gender:', volunteer.gender || '???');
    addRow('Date of Birth:', formatPrintDate(volunteer.date_of_birth));
    addRow('Skills:', volunteer.skills || '???');
    addRow('Availability:', volunteer.availability || '???');
    addRow('Experience:', volunteer.experience || '???');
    addRow('Government ID Type:', volunteer.id_type || '???');
    addRow('Government ID Number:', volunteer.id_number || '???');
    addRow('Status:', volunteer.status || '???');

    if (logoDataUrl) {
      doc.addImage(logoDataUrl, 'PNG', 24, 720, 36, 36);
    }
    doc.setFontSize(10);
    doc.text('Sahayak NGO', 70, 742);
    doc.setFontSize(9);
    doc.text('Authorized by Sahayak NGO', 24, 765);

    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(1.2);
    doc.rect(16, 16, 563, 810);

    return doc;
  };

  const buildBeneficiaryPdf = async (beneficiary: Beneficiary) => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const logoDataUrl = await loadImageDataUrl('/images/sahayak-logo.png.webp');
    if (logoDataUrl) {
      doc.addImage(logoDataUrl, 'PNG', 24, 24, 48, 48);
    }
    doc.setFontSize(16);
    doc.text('Sahayak NGO - Beneficiary Profile', 88, 48);
    doc.setFontSize(11);

    const left = 24;
    const labelWidth = 170;
    const valueWidth = 330;
    let cursorY = 110;

    const addRow = (label: string, value: string) => {
      const safeValue = value || '???';
      const wrapped = doc.splitTextToSize(safeValue, valueWidth);
      doc.setFont('helvetica', 'bold');
      doc.text(label, left, cursorY);
      doc.setFont('helvetica', 'normal');
      doc.text(wrapped, left + labelWidth, cursorY);
      cursorY += wrapped.length * 14 + 6;
    };

    const passport = beneficiary.id_image_url ? await loadImageDataUrl(beneficiary.id_image_url) : null;
    if (passport) {
      const pageWidth = doc.internal.pageSize.getWidth();
      const photoSize = 90;
      const photoX = pageWidth - photoSize - 28;
      const photoY = 90;
      doc.addImage(passport, getImageFormat(passport), photoX, photoY, photoSize, photoSize);
      doc.setDrawColor(15, 23, 42);
      doc.rect(photoX - 2, photoY - 2, photoSize + 4, photoSize + 4);
    }

    addRow('Beneficiary ID:', beneficiary.beneficiary_code || beneficiary.id);
    addRow('Name:', beneficiary.name || '???');
    addRow('Age:', String(beneficiary.age ?? '???'));
    addRow('Phone:', beneficiary.phone || '???');
    addRow('Email:', beneficiary.email || '???');
    addRow('Address:', beneficiary.address || '???');
    addRow('Gender:', beneficiary.gender || '???');
    addRow('Date of Birth:', formatPrintDate(beneficiary.date_of_birth));
    addRow('Need Description:', beneficiary.need_description || '???');
    addRow('Government ID Type:', beneficiary.id_type || '???');
    addRow('Government ID Number:', beneficiary.id_number || '???');
    addRow('Status:', beneficiary.status || '???');

    if (logoDataUrl) {
      doc.addImage(logoDataUrl, 'PNG', 24, 720, 36, 36);
    }
    doc.setFontSize(10);
    doc.text('Sahayak NGO', 70, 742);
    doc.setFontSize(9);
    doc.text('Authorized by Sahayak NGO', 24, 765);

    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(1.2);
    doc.rect(16, 16, 563, 810);

    return doc;
  };

  const handleDownloadVolunteerPdf = async (volunteer: Volunteer) => {
    const doc = await buildVolunteerPdf(volunteer);
    doc.save(`volunteer_${volunteer.volunteer_code || volunteer.id}.pdf`);
  };

  const handleDownloadBeneficiaryPdf = async (beneficiary: Beneficiary) => {
    const doc = await buildBeneficiaryPdf(beneficiary);
    doc.save(`beneficiary_${beneficiary.beneficiary_code || beneficiary.id}.pdf`);
  };

  const handlePrintVolunteerPdf = async (volunteer: Volunteer) => {
    const doc = await buildVolunteerPdf(volunteer);
    const blobUrl = doc.output('bloburl');
    const printWindow = window.open(blobUrl);
    if (!printWindow) return;
    printWindow.onload = () => printWindow.print();
  };

  const handlePrintBeneficiaryPdf = async (beneficiary: Beneficiary) => {
    const doc = await buildBeneficiaryPdf(beneficiary);
    const blobUrl = doc.output('bloburl');
    const printWindow = window.open(blobUrl);
    if (!printWindow) return;
    printWindow.onload = () => printWindow.print();
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="mb-0">Admin Dashboard</h2>
        {user?.id && <NotificationBell recipientId={user.id} />}
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
            className={`nav-link ${activeTab === 'campaigns' ? 'active' : ''}`}
            onClick={() => setActiveTab('campaigns')}
          >
            Campaigns
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'volunteers' ? 'active' : ''}`}
            onClick={() => setActiveTab('volunteers')}
          >
            Volunteers
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'donors' ? 'active' : ''}`}
            onClick={() => setActiveTab('donors')}
          >
            Donors
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'donations' ? 'active' : ''}`}
            onClick={() => setActiveTab('donations')}
          >
            Donations
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'donor-messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('donor-messages')}
          >
            Donor Messages
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'support-tickets' ? 'active' : ''}`}
            onClick={() => setActiveTab('support-tickets')}
          >
            Support Tickets
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'volunteer-messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('volunteer-messages')}
          >
            Volunteer Messages
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'volunteer-uploads' ? 'active' : ''}`}
            onClick={() => setActiveTab('volunteer-uploads')}
          >
            Volunteer Proofs
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'volunteer-recognition' ? 'active' : ''}`}
            onClick={() => setActiveTab('volunteer-recognition')}
          >
            Volunteer Recognition
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports & Analytics
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
            className={`nav-link ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Events
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
        </li>
      </ul>

      {activeTab === 'overview' && (
        <div className="row">
          <div className="col-md-3 mb-3">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h5>Total Donations</h5>
                <h3>₹{stats.totalDonations.toFixed(2)}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5>Total Donors</h5>
                <h3>{stats.totalDonors}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-info text-white">
              <div className="card-body">
                <h5>Total Volunteers</h5>
                <h3>{stats.totalVolunteers}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <h5>Total Campaigns</h5>
                <h3>{stats.totalCampaigns}</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div>
          <button className="btn btn-primary mb-3" onClick={() => setShowCampaignModal(true)}>
            Add New Campaign
          </button>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Goal Amount</th>
                  <th>Raised Amount</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td>
                      {campaign.image_url ? (
                        <img
                          src={campaign.image_url}
                          alt={campaign.title}
                          style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 4 }}
                        />
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>{campaign.title}</td>
                    <td>₹{campaign.goal_amount}</td>
                    <td>₹{campaign.raised_amount}</td>
                    <td style={{ minWidth: 180 }}>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: `${calculateProgress(campaign.raised_amount, campaign.goal_amount)}%` }}
                        ></div>
                      </div>
                      <small className="text-muted">
                        {calculateProgress(campaign.raised_amount, campaign.goal_amount).toFixed(1)}%
                      </small>
                    </td>
                    <td><span className={`badge bg-${campaign.status === 'active' ? 'success' : 'secondary'}`}>{campaign.status}</span></td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteCampaign(campaign.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'volunteers' && (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Skills</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((volunteer) => (
                <tr key={volunteer.id}>
                  <td>{getUserName(volunteer.users)}</td>
                  <td>{getUserEmail(volunteer.users)}</td>
                  <td>{volunteer.skills}</td>
                  <td><span className={`badge bg-${volunteer.status === 'approved' ? 'success' : volunteer.status === 'pending' ? 'warning' : 'danger'}`}>{volunteer.status}</span></td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => {
                        setSelectedVolunteer(volunteer);
                        setShowVolunteerView(true);
                      }}
                    >
                      View
                    </button>
                    {volunteer.status === 'pending' && (
                      <>
                        <button className="btn btn-sm btn-success me-2" onClick={() => handleVolunteerStatus(volunteer.id, 'approved')}>
                          Approve
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleVolunteerStatus(volunteer.id, 'rejected')}>
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'donors' && (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {donors.map((donor) => (
                <tr key={donor.id}>
                  <td>{donor.full_name}</td>
                  <td>{donor.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'donations' && (
        <div>
          <div className="d-flex flex-wrap gap-3 mb-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted mb-1">Total Donations</h6>
                <h4 className="mb-0">₹{stats.totalDonations.toFixed(2)}</h4>
              </div>
            </div>
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted mb-1">Donation Count</h6>
                <h4 className="mb-0">{donations.length}</h4>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Campaign</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Transaction</th>
                  <th>Date</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id}>
                    <td>{getUserName(donation.users) || 'Anonymous'}</td>
                    <td>{getCampaignTitle(donation.campaigns) || 'General'}</td>
                    <td>₹{donation.amount}</td>
                    <td>{donation.payment_method?.toUpperCase()}</td>
                    <td>{donation.transaction_id}</td>
                    <td>{formatPrintDate(donation.created_at)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleDownloadDonationReceipt(donation)}
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="admin-analytics-grid">
          <div className="card border-0 shadow-sm admin-analytics-card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h5 className="mb-1">Monthly Donations</h5>
                  <small className="text-muted">Last activity overview</small>
                </div>
                <span className="admin-analytics-chip">INR</span>
              </div>
              {monthlyDonationData.length === 0 ? (
                <div className="text-muted">No donation data yet.</div>
              ) : (
                <div className="admin-bar-chart">
                  {monthlyDonationData.map((item) => {
                    const max = Math.max(...monthlyDonationData.map((m) => m.total));
                    const height = max ? (item.total / max) * 100 : 0;
                    return (
                      <div key={item.key} className="admin-bar-item">
                        <div className="admin-bar" style={{ height: `${height}%` }}></div>
                        <span className="admin-bar-label">{item.label}</span>
                        <span className="admin-bar-value">₹{item.total.toFixed(0)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="card border-0 shadow-sm admin-analytics-card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h5 className="mb-1">Top Donors</h5>
                  <small className="text-muted">Highest contributions</small>
                </div>
                <span className="admin-analytics-chip admin-analytics-chip-gold">Leaders</span>
              </div>
              {topDonorsData.length === 0 ? (
                <div className="text-muted">No donor data yet.</div>
              ) : (
                <div className="admin-donor-list">
                  {topDonorsData.map((donor, index) => (
                    <div key={donor.name} className="admin-donor-item">
                      <div className="admin-donor-rank">{index + 1}</div>
                      <div className="admin-donor-avatar">
                        {donor.name ? donor.name[0] : 'A'}
                      </div>
                      <div className="admin-donor-info">
                        <div className="admin-donor-name">{donor.name}</div>
                        <div className="admin-donor-meta">Donated</div>
                      </div>
                      <div className="admin-donor-amount">₹{donor.total.toFixed(0)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="card border-0 shadow-sm admin-analytics-card admin-analytics-wide">
            <div className="card-body">
              <h5 className="mb-3">Most Successful Campaign</h5>
              {mostSuccessfulCampaign ? (
                <div>
                  <div className="d-flex justify-content-between flex-wrap gap-3 mb-2">
                    <div>
                      <strong>{mostSuccessfulCampaign.title}</strong>
                      <div className="text-muted">Goal: ₹{mostSuccessfulCampaign.goal_amount}</div>
                    </div>
                    <div className="text-end">
                      <div className="text-muted">Raised</div>
                      <strong>₹{mostSuccessfulCampaign.raised_amount}</strong>
                    </div>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: `${calculateProgress(mostSuccessfulCampaign.raised_amount, mostSuccessfulCampaign.goal_amount)}%` }}
                    ></div>
                  </div>
                  <small className="text-muted">
                    {calculateProgress(mostSuccessfulCampaign.raised_amount, mostSuccessfulCampaign.goal_amount).toFixed(1)}% funded
                  </small>
                </div>
              ) : (
                <div className="text-muted">No campaign data yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'donor-messages' && (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Donor</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Date</th>
                <th>Reply</th>
              </tr>
            </thead>
            <tbody>
              {donorMessages.map((item) => (
                <tr key={item.id}>
                  <td>{getUserName(item.users) || 'Anonymous'}</td>
                  <td>{item.subject}</td>
                  <td>{item.message}</td>
                  <td>{formatPrintDate(item.created_at)}</td>
                  <td style={{ minWidth: 220 }}>
                    <textarea
                      className="form-control mb-2"
                      rows={2}
                      value={donorReplyDrafts[item.id] ?? item.admin_reply ?? ''}
                      onChange={(e) =>
                        setDonorReplyDrafts((prev) => ({ ...prev, [item.id]: e.target.value }))
                      }
                      placeholder="Type reply"
                    ></textarea>
                    <button
                      className="btn btn-sm btn-primary"
                      type="button"
                      onClick={() =>
                        handleReplyDonorMessage(
                          item.id,
                          item.donor_id,
                          donorReplyDrafts[item.id] ?? item.admin_reply ?? ''
                        )
                      }
                    >
                      Send Reply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'support-tickets' && (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Donor</th>
                <th>Issue</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Date</th>
                <th>Reply</th>
              </tr>
            </thead>
            <tbody>
              {supportTickets.map((item) => (
                <tr key={item.id}>
                  <td>{getUserName(item.users) || 'Anonymous'}</td>
                  <td>{item.issue_type}</td>
                  <td>{item.subject}</td>
                  <td>{item.message}</td>
                  <td>{formatPrintDate(item.created_at)}</td>
                  <td style={{ minWidth: 220 }}>
                    <textarea
                      className="form-control mb-2"
                      rows={2}
                      value={supportReplyDrafts[item.id] ?? item.admin_reply ?? ''}
                      onChange={(e) =>
                        setSupportReplyDrafts((prev) => ({ ...prev, [item.id]: e.target.value }))
                      }
                      placeholder="Type reply"
                    ></textarea>
                    <button
                      className="btn btn-sm btn-primary"
                      type="button"
                      onClick={() =>
                        handleReplySupport(
                          item.id,
                          item.donor_id,
                          supportReplyDrafts[item.id] ?? item.admin_reply ?? ''
                        )
                      }
                    >
                      Send Reply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'volunteer-messages' && (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Volunteer</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Date</th>
                <th>Reply</th>
              </tr>
            </thead>
            <tbody>
              {volunteerMessages.map((item) => (
                <tr key={item.id}>
                  <td>{getUserName(item.users) || 'Volunteer'}</td>
                  <td>{item.subject}</td>
                  <td>{item.message}</td>
                  <td>{formatPrintDate(item.created_at)}</td>
                  <td style={{ minWidth: 220 }}>
                    <textarea
                      className="form-control mb-2"
                      rows={2}
                      value={volunteerReplyDrafts[item.id] ?? item.admin_reply ?? ''}
                      onChange={(e) =>
                        setVolunteerReplyDrafts((prev) => ({ ...prev, [item.id]: e.target.value }))
                      }
                      placeholder="Type reply"
                    ></textarea>
                    <button
                      className="btn btn-sm btn-primary"
                      type="button"
                      onClick={() =>
                        handleReplyVolunteerMessage(
                          item.id,
                          item.volunteer_id,
                          volunteerReplyDrafts[item.id] ?? item.admin_reply ?? ''
                        )
                      }
                    >
                      Send Reply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'volunteer-uploads' && (
        <div className="row g-4">
          {volunteerUploads.length === 0 ? (
            <div className="text-muted">No uploads yet.</div>
          ) : (
            volunteerUploads.map((upload) => (
              <div key={upload.id} className="col-md-6 col-lg-4">
                <div className="card shadow-sm h-100">
                  <img src={upload.file_url} alt="Volunteer proof" className="card-img-top" />
                  <div className="card-body">
                    <h6 className="card-title">{getUserName(upload.users) || 'Volunteer'}</h6>
                    <p className="card-text">{upload.description || 'Activity proof'}</p>
                    <small className="text-muted">{formatPrintDate(upload.created_at)}</small>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'volunteer-recognition' && (
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="mb-3">Award Recognition</h5>
                <form onSubmit={handleAwardRecognition}>
                  <div className="mb-3">
                    <label className="form-label">Volunteer</label>
                    <select
                      className="form-select"
                      value={recognitionForm.volunteer_id}
                      onChange={(e) => setRecognitionForm({ ...recognitionForm, volunteer_id: e.target.value })}
                      required
                    >
                      <option value="">Select volunteer</option>
                      {volunteers.map((vol) => (
                        <option key={vol.id} value={vol.user_id}>
                          {getUserName(vol.users)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Award Type</label>
                    <select
                      className="form-select"
                      value={recognitionForm.award_type}
                      onChange={(e) => setRecognitionForm({ ...recognitionForm, award_type: e.target.value })}
                    >
                      <option>Star Volunteer Badge</option>
                      <option>Volunteer Certificate</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Note</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={recognitionForm.note}
                      onChange={(e) => setRecognitionForm({ ...recognitionForm, note: e.target.value })}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">Award</button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="mb-3">Recent Recognitions</h5>
                {volunteerRecognitions.length === 0 ? (
                  <div className="text-muted">No recognitions yet.</div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {volunteerRecognitions.map((item) => (
                      <div key={item.id} className="border rounded p-3">
                        <strong>{getUserName(item.users) || 'Volunteer'}</strong>
                        <div>🏅 {item.award_type}</div>
                        {item.note && <div className="text-muted">{item.note}</div>}
                        <small className="text-muted">{formatPrintDate(item.created_at)}</small>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'beneficiaries' && (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Address</th>
                <th>Need</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.map((beneficiary) => (
                <tr key={beneficiary.id}>
                  <td>{beneficiary.name}</td>
                  <td>{beneficiary.age}</td>
                  <td>{beneficiary.address}</td>
                  <td>{beneficiary.need_description}</td>
                  <td><span className={`badge bg-${beneficiary.status === 'approved' ? 'success' : beneficiary.status === 'pending' ? 'warning' : 'danger'}`}>{beneficiary.status}</span></td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => {
                        setSelectedBeneficiary(beneficiary);
                        setShowBeneficiaryView(true);
                      }}
                    >
                      View
                    </button>
                    {beneficiary.status === 'pending' && (
                      <>
                        <button className="btn btn-sm btn-success me-2" onClick={() => handleBeneficiaryStatus(beneficiary.id, 'approved')}>
                          Approve
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleBeneficiaryStatus(beneficiary.id, 'rejected')}>
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'messages' && (
        <div>
          <button className="btn btn-primary mb-3" onClick={() => setShowMessageModal(true)}>
            Send New Message
          </button>
          <p>Send announcements and updates to donors and volunteers.</p>
        </div>
      )}

      {activeTab === 'events' && (
        <div>
          <button
            className="btn btn-primary mb-3 me-2"
            onClick={() => setShowEventModal(true)}
          >
            Add Upcoming Event
          </button>
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => fetchEvents()}
          >
            Refresh Events
          </button>

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>{event.event_date ? new Date(event.event_date).toLocaleString() : '—'}</td>
                    <td>{event.location || '—'}</td>
                    <td>{event.description || '—'}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteEvent(event.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'posts' && (
        <div>
          <button
            className="btn btn-primary mb-3"
            onClick={() => {
              setPostError('');
              setShowPostModal(true);
            }}
          >
            Add Event Post
          </button>
          {postError && (
            <div className="alert alert-danger" role="alert">
              {postError}
            </div>
          )}
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Event Date</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td>{post.title}</td>
                    <td>{post.event_date ? new Date(post.event_date).toLocaleDateString() : '—'}</td>
                    <td>{post.location || '—'}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeletePost(post.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showCampaignModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Campaign</h5>
                <button type="button" className="btn-close" onClick={() => setShowCampaignModal(false)}></button>
              </div>
              <form onSubmit={handleCreateCampaign}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={campaignForm.title}
                      onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={campaignForm.description}
                      onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      value={campaignForm.image_url}
                      onChange={(e) => setCampaignForm({ ...campaignForm, image_url: e.target.value })}
                      placeholder="https://..."
                    />
                    <small className="text-muted">
                      Use a direct image link (ending in .jpg, .jpeg, .png, or .webp).
                    </small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Goal Amount (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={campaignForm.goal_amount}
                      onChange={(e) => setCampaignForm({ ...campaignForm, goal_amount: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCampaignModal(false)}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Campaign
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showMessageModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Send Message</h5>
                <button type="button" className="btn-close" onClick={() => setShowMessageModal(false)}></button>
              </div>
              <form onSubmit={handleSendMessage}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Send To</label>
                    <select
                      className="form-select"
                      value={messageForm.recipient_type}
                      onChange={(e) => setMessageForm({ ...messageForm, recipient_type: e.target.value })}
                    >
                      <option value="donors">Donors</option>
                      <option value="volunteers">Volunteers</option>
                    </select>
                  </div>
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
                      value={messageForm.content}
                      onChange={(e) => setMessageForm({ ...messageForm, content: e.target.value })}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowMessageModal(false)}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showPostModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Event Post</h5>
                <button type="button" className="btn-close" onClick={() => setShowPostModal(false)}></button>
              </div>
              <form onSubmit={handleCreatePost}>
                <div className="modal-body">
                  {postError && (
                    <div className="alert alert-danger" role="alert">
                      {postError}
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={postForm.title}
                      onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={postForm.description}
                      onChange={(e) => setPostForm({ ...postForm, description: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={postForm.image_url}
                      onChange={(e) => setPostForm({ ...postForm, image_url: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Event Date</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={postForm.event_date}
                      onChange={(e) => setPostForm({ ...postForm, event_date: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={postForm.location}
                      onChange={(e) => setPostForm({ ...postForm, location: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowPostModal(false)}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={postSubmitting}>
                    {postSubmitting ? 'Publishing...' : 'Publish Post'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showEventModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Upcoming Event</h5>
                <button type="button" className="btn-close" onClick={() => setShowEventModal(false)}></button>
              </div>
              <form onSubmit={handleCreateEvent}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Event Date</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={eventForm.event_date}
                      onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <textarea
                      className="form-control"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      placeholder="Full address, e.g., 123 Main St, City, State"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEventModal(false)}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showVolunteerView && selectedVolunteer && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Volunteer Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowVolunteerView(false)}></button>
              </div>
              <div className="modal-body">
                <div className="admin-detail-grid">
                  <div className="admin-detail-card">
                    <div className="admin-detail-title">Identity</div>
                    <div className="admin-detail-row">
                      <span className="admin-detail-label">Name</span>
                      <span>{getUserName(selectedVolunteer.users) || '—'}</span>
                    </div>
                    <div className="admin-detail-row">
                      <span className="admin-detail-label">Volunteer ID</span>
                      <span>{selectedVolunteer.volunteer_code || '—'}</span>
                    </div>
                    <div className="admin-detail-row">
                      <span className="admin-detail-label">Status</span>
                      <span className={`badge bg-${selectedVolunteer.status === 'approved' ? 'success' : selectedVolunteer.status === 'pending' ? 'warning' : 'danger'}`}>
                        {selectedVolunteer.status || '—'}
                      </span>
                    </div>
                  </div>

                  <div className="admin-detail-card">
                    <div className="admin-detail-title">Contact</div>
                    <div className="admin-detail-row">
                      <span className="admin-detail-label">Email</span>
                      <span>{getUserEmail(selectedVolunteer.users) || '—'}</span>
                    </div>
                    <div className="admin-detail-row">
                      <span className="admin-detail-label">Phone</span>
                      <span>{selectedVolunteer.phone || '—'}</span>
                    </div>
                    <div className="admin-detail-row">
                      <span className="admin-detail-label">Address</span>
                      <span>{selectedVolunteer.address || '—'}</span>
                    </div>
                  </div>

                  <div className="admin-detail-card">
                    <div className="admin-detail-title">Personal</div>
                    <div className="admin-detail-row">
                      <span className="admin-detail-label">Gender</span>
                      <span>{selectedVolunteer.gender || '—'}</span>
                    </div>
                    <div className="admin-detail-row">
                      <span className="admin-detail-label">Date of Birth</span>
                      <span>{formatPrintDate(selectedVolunteer.date_of_birth)}</span>
                    </div>
                  </div>

                  <div className="admin-detail-card admin-detail-wide admin-detail-skill">
                    <div className="admin-detail-title">Skills & Availability</div>
                    <div className="admin-detail-row">
                      <span className="admin-detail-label">Skills</span>
                      <span className="admin-detail-pill">{selectedVolunteer.skills || '—'}</span>
                    </div>
                    <div className="admin-detail-row">
                      <span className="admin-detail-label">Availability</span>
                      <span className="admin-detail-pill">{selectedVolunteer.availability || '—'}</span>
                    </div>
                    <div className="admin-detail-row">
                      <span className="admin-detail-label">Experience</span>
                      <span className="admin-detail-pill admin-detail-pill-long">{selectedVolunteer.experience || '—'}</span>
                    </div>
                  </div>

                  <div className="admin-detail-card admin-detail-wide">
                    <div className="admin-detail-title">Government ID</div>
                    <div className="admin-detail-row">
                      <span className="admin-detail-label">Type</span>
                      <span>{selectedVolunteer.id_type || '—'}</span>
                    </div>
                    <div className="admin-detail-row">
                      <span className="admin-detail-label">Number</span>
                      <span>{selectedVolunteer.id_number || '—'}</span>
                    </div>
                    <div className="admin-detail-row">
                      <span className="admin-detail-label">ID Image</span>
                      {selectedVolunteer.id_image_url ? (
                        <div className="admin-detail-image">
                          <a href={selectedVolunteer.id_image_url} target="_blank" rel="noreferrer">Open full image</a>
                          <img
                            src={selectedVolunteer.id_image_url}
                            alt="Volunteer ID"
                          />
                        </div>
                      ) : (
                        <span>—</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={() => setShowVolunteerView(false)}>Close</button>
                <button className="btn btn-outline-primary" onClick={() => handlePrintVolunteerPdf(selectedVolunteer)}>Open PDF & Print</button>
                <button className="btn btn-primary" onClick={() => handleDownloadVolunteerPdf(selectedVolunteer)}>Download PDF</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBeneficiaryView && selectedBeneficiary && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Beneficiary Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowBeneficiaryView(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6"><strong>Name:</strong> {selectedBeneficiary.name || '—'}</div>
                  <div className="col-md-6"><strong>Beneficiary ID:</strong> {selectedBeneficiary.beneficiary_code || '—'}</div>
                  <div className="col-md-6"><strong>Age:</strong> {selectedBeneficiary.age ?? '—'}</div>
                  <div className="col-md-6"><strong>Phone:</strong> {selectedBeneficiary.phone || '—'}</div>
                  <div className="col-md-6"><strong>Email:</strong> {selectedBeneficiary.email || '—'}</div>
                  <div className="col-md-6"><strong>Gender:</strong> {selectedBeneficiary.gender || '—'}</div>
                  <div className="col-md-6"><strong>Date of Birth:</strong> {formatPrintDate(selectedBeneficiary.date_of_birth)}</div>
                  <div className="col-md-12"><strong>Address:</strong> {selectedBeneficiary.address || '—'}</div>
                  <div className="col-md-12"><strong>Need Description:</strong> {selectedBeneficiary.need_description || '—'}</div>
                  <div className="col-md-6"><strong>ID Type:</strong> {selectedBeneficiary.id_type || '—'}</div>
                  <div className="col-md-6"><strong>ID Number:</strong> {selectedBeneficiary.id_number || '—'}</div>
                  <div className="col-md-12">
                    <strong>ID Image:</strong>{' '}
                    {selectedBeneficiary.id_image_url ? (
                      <div className="d-flex flex-column gap-2">
                        <a href={selectedBeneficiary.id_image_url} target="_blank" rel="noreferrer">Open full image</a>
                        <img
                          src={selectedBeneficiary.id_image_url}
                          alt="Beneficiary ID"
                          style={{ width: 220, height: 'auto', borderRadius: 8, border: '1px solid #e2e8f0' }}
                        />
                      </div>
                    ) : (
                      '—'
                    )}
                  </div>
                  <div className="col-md-6"><strong>Status:</strong> {selectedBeneficiary.status || '—'}</div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={() => setShowBeneficiaryView(false)}>Close</button>
                <button className="btn btn-outline-primary" onClick={() => handlePrintBeneficiaryPdf(selectedBeneficiary)}>Open PDF & Print</button>
                <button className="btn btn-primary" onClick={() => handleDownloadBeneficiaryPdf(selectedBeneficiary)}>Download PDF</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
