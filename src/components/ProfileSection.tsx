import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/useAuth';

const ProfileSection: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    state: ''
  });
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        country: user.country || '',
        state: user.state || ''
      });
      setPhotoUrl(user.profile_image || null);
    }
  }, [user]);

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSizeMb = 2;
    const maxSizeBytes = maxSizeMb * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a JPG, PNG, or WEBP image.');
      return;
    }

    if (file.size > maxSizeBytes) {
      setError(`Image size must be less than ${maxSizeMb}MB.`);
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filePath = `user-${user.id}/avatar-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      if (!data?.publicUrl) {
        throw new Error('Failed to get image URL.');
      }

      await updateProfile({ profile_image: data.publicUrl });
      setPhotoUrl(data.publicUrl);
      setSuccess('Profile photo updated.');
    } catch (err: any) {
      setError(err?.message || 'Failed to upload photo.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!user) return;
    setUploading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile({ profile_image: null });
      setPhotoUrl(null);
      setSuccess('Profile photo removed.');
    } catch (err: any) {
      setError(err?.message || 'Failed to remove photo.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile({
        full_name: form.full_name,
        phone: form.phone,
        address: form.address,
        country: form.country,
        state: form.state
      });

      setSuccess('Profile saved successfully.');
    } catch (err: any) {
      setError(err?.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="profile-avatar">
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" />
            ) : (
              <span>{form.full_name ? form.full_name[0] : 'U'}</span>
            )}
          </div>
          <div>
            <h4 className="card-title mb-1">Profile</h4>
            <label className="btn btn-outline-secondary btn-sm mb-0 me-2">
              {uploading ? 'Uploading...' : 'Upload Photo'}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                hidden
                disabled={uploading}
              />
            </label>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={handleRemovePhoto}
              disabled={uploading || !photoUrl}
            >
              Remove Photo
            </button>
            <div className="text-muted small mt-2">JPG/PNG/WEBP, max 2MB.</div>
          </div>
        </div>
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              className="form-control"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email (read-only)</label>
            <input className="form-control" value={form.email} readOnly />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              className="form-control"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Address</label>
            <textarea
              className="form-control"
              rows={2}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Country</label>
              <input
                className="form-control"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">State</label>
              <input
                className="form-control"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSection;
