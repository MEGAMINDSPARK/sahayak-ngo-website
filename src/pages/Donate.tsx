import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/useAuth';

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  raised_amount: number;
  status?: string;
}

interface DonateProps {
  onNavigate: (page: string) => void;
  selectedCampaignId?: string;
}

const Donate: React.FC<DonateProps> = ({ onNavigate, selectedCampaignId }) => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const paypalDonateUrl = 'https://www.paypal.com/donate?business=YOUR_PAYPAL_EMAIL_OR_ID&currency_code=INR';
  const stripePaymentLink = 'https://buy.stripe.com/YOUR_PAYMENT_LINK';
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (selectedCampaignId) {
      setSelectedCampaign(selectedCampaignId);
    }
  }, [selectedCampaignId]);

  useEffect(() => {
    if (user && user.role?.toLowerCase() !== 'donor') {
      alert('Only donors are allowed to make donations.');
      onNavigate('home');
    }
  }, [user, onNavigate]);

  useEffect(() => {
    if (!success) return;
    setShowCelebration(true);
    const playCelebrationSound = async () => {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        const makeTone = (freq: number, start: number, duration: number, gainValue: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          gain.gain.value = gainValue;
          osc.connect(gain).connect(ctx.destination);
          osc.start(start);
          osc.stop(start + duration);
        };

        makeTone(523.25, now, 0.18, 0.06); // C5
        makeTone(659.25, now + 0.18, 0.18, 0.06); // E5
        makeTone(783.99, now + 0.36, 0.22, 0.06); // G5
        window.setTimeout(() => ctx.close(), 1200);
      } catch {
        // ignore autoplay restrictions
      }
    };
    playCelebrationSound();
    const timer = window.setTimeout(() => setShowCelebration(false), 3000);
    return () => window.clearTimeout(timer);
  }, [success]);

  const fetchCampaigns = async () => {
    const { data } = await supabase
      .from('campaigns')
      .select('*')
      .eq('status', 'active');
    setCampaigns(data || []);
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Please login to donate');
      onNavigate('donor-login');
      return;
    }
    if (user.role?.toLowerCase() !== 'donor') {
      alert('Only donors are allowed to make donations.');
      return;
    }

    if (!selectedCampaign || !amount) {
      alert('Please select a campaign and enter an amount');
      return;
    }

    setLoading(true);

    try {
      const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9);

      const { error } = await supabase.from('donations').insert([
        {
          donor_id: user.id,
          campaign_id: selectedCampaign,
          amount: parseFloat(amount),
          payment_method: paymentMethod,
          transaction_id: transactionId
        }
      ]);

      if (error) throw error;

      const campaign = campaigns.find((c) => c.id === selectedCampaign);
      const campaignTitle = campaign?.title || 'a campaign';

      const { data: admins } = await supabase.from('users').select('id, full_name').eq('role', 'admin');
      const adminIds = (admins || []).map((a: any) => a.id);
      if (adminIds.length > 0) {
        await supabase.from('notifications').insert(
          adminIds.map((id: string) => ({
            recipient_id: id,
            icon: '💰',
            message: `💰 ${user.full_name} donated ₹${amount} to ${campaignTitle}.`,
            is_read: false
          }))
        );
      }

      await supabase.from('notifications').insert([
        {
          recipient_id: user.id,
          icon: '🎉',
          message: `🎉 Thank you for your donation of ₹${amount}. Your support is making a difference.`,
          is_read: false
        }
      ]);

      let campaignReachedGoal = false;
      if (campaign) {
        const newRaised = campaign.raised_amount + parseFloat(amount);
        campaignReachedGoal = newRaised >= campaign.goal_amount;

        await supabase
          .from('campaigns')
          .update({
            raised_amount: newRaised,
            status: campaignReachedGoal ? 'completed' : campaign.status
          })
          .eq('id', selectedCampaign);
      }

      if (campaignReachedGoal) {
        // Send broadcast messages when campaign completes
        await supabase.from('messages').insert([
          {
            sender_id: user.id,
            recipient_type: 'donors',
            subject: 'A Heartfelt Thank You!',
            content: 'Your contribution is more than a donation—it is a gift of hope, care, and a brighter future for those in need.'
          },
          {
            sender_id: user.id,
            recipient_type: 'volunteers',
            subject: 'A Heartfelt Thank You!',
            content: 'Your contribution is more than a donation—it is a gift of hope, care, and a brighter future for those in need.'
          }
        ]);
      }

      setSuccess(true);
      setAmount('');
      setSelectedCampaign('');
      setTimeout(() => {
        onNavigate('donor-dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error processing donation:', error);
      alert('Failed to process donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donate-page">
      {showCelebration && (
        <div className="celebration-overlay" role="status" aria-live="polite">
          <div className="celebration-balloons">
            {Array.from({ length: 18 }).map((_, index) => (
              <span key={index} className={`balloon balloon-${index % 5}`} />
            ))}
          </div>
          <div className="celebration-confetti">
            {Array.from({ length: 30 }).map((_, index) => (
              <span key={index} className={`confetti confetti-${index % 6}`} />
            ))}
          </div>
          <div className="celebration-message">
            <h3>🎉 Thank You for Your Generous Donation!</h3>
            <p>
              Your kindness and support help us bring hope and positive change to people in need. Because of you, we
              can continue our mission and make a real difference in our community. Together, we are building a better
              tomorrow. ❤️
            </p>
          </div>
        </div>
      )}
      <div className="container py-5 position-relative">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h1 className="text-center mb-4">Make a Donation</h1>

          {success && (
            <div className="alert alert-success text-center" role="alert">
              Thank you for your donation! Redirecting to dashboard...
            </div>
          )}

            <div className="card shadow-sm donate-card">
              <div className="card-body p-4">
                <form onSubmit={handleDonate} className="donate-form-compact">
                <div className="mb-3">
                  <label htmlFor="campaign" className="form-label">
                    Select Campaign
                  </label>
                  <select
                    className="form-select"
                    id="campaign"
                    value={selectedCampaign}
                    onChange={(e) => setSelectedCampaign(e.target.value)}
                    required
                  >
                    <option value="">Choose a campaign...</option>
                    {campaigns.map((campaign) => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">
                    Donation Amount (₹)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Payment Method</label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="upi"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="upi">
                      UPI Payment
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="paypal"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="paypal">
                      PayPal Donation
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="stripe"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="stripe">
                      Card (Stripe)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="card"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="card">
                      Credit/Debit Card (manual)
                    </label>
                  </div>
                </div>

                {paymentMethod === 'upi' && (
                  <div className="mb-3 text-center">
                    <p className="mb-2">Scan QR Code to Pay</p>
                    <div className="bg-light p-3 d-inline-block rounded">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=8229873615@kotak811&pn=RAHUL+KUMAR&cu=INR"
                        alt="UPI QR Code"
                        style={{ width: 200, height: 200 }}
                      />
                    </div>
                    <p className="mt-2 mb-1 text-muted">UPI ID: 8229873615@kotak811</p>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                      Scan with any UPI app (Google Pay, PhonePe, Paytm, BHIM, etc.)
                    </p>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="text-center">
                    <p className="mb-2">Donate via PayPal</p>
                    <a
                      className="btn btn-primary btn-lg"
                      href={paypalDonateUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Donate with PayPal
                    </a>
                    <p className="mt-2 text-muted" style={{ fontSize: '0.9rem' }}>
                      Replace <code>YOUR_PAYPAL_EMAIL_OR_ID</code> in the code with your PayPal business email or hosted button ID.
                    </p>
                  </div>
                )}

                {paymentMethod === 'stripe' && (
                  <div className="text-center">
                    <p className="mb-2">Donate via Stripe (Card)</p>
                    <a
                      className="btn btn-primary btn-lg"
                      href={stripePaymentLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Donate with Stripe
                    </a>
                    <p className="mt-2 text-muted" style={{ fontSize: '0.9rem' }}>
                      Replace <code>YOUR_PAYMENT_LINK</code> in the code with a Stripe Checkout payment link URL.
                    </p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="alert alert-info">
                    Card payment integration would be implemented here using a payment gateway like Razorpay or Stripe.
                  </div>
                )}

                <button type="submit" className="btn btn-primary w-100 mt-3" disabled={loading}>
                  {loading ? 'Processing...' : 'Donate Now'}
                </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
