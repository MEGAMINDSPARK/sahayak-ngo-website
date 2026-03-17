import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';

interface RoleLoginFormProps {
  role: 'admin' | 'donor' | 'volunteer';
  title: string;
  onNavigate: (page: string) => void;
  allowRegister?: boolean;
}

const RoleLoginForm: React.FC<RoleLoginFormProps> = ({
  role,
  title,
  onNavigate,
  allowRegister = false
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, logout } = useAuth();

  useEffect(() => {
    if (!user) return;

    if (user.role?.toLowerCase() !== role) {
      setError(`This account is not registered as ${role}.`);
      logout();
      return;
    }

    if (role === 'admin') onNavigate('admin-dashboard');
    if (role === 'donor') onNavigate('donor-dashboard');
    if (role === 'volunteer') onNavigate('volunteer-dashboard');
  }, [user, role, onNavigate, logout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">{title}</h2>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
              {allowRegister && (
                <div className="text-center mt-3">
                  <p>
                    Don't have an account?{' '}
                    <a href="#" onClick={() => onNavigate('register')}>
                      Register here
                    </a>
                  </p>
                </div>
              )}
              <div className="text-center mt-2">
                <a href="#" onClick={() => onNavigate('home')}>
                  Back to home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleLoginForm;
