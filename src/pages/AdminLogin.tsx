import React from 'react';
import RoleLoginForm from '../components/RoleLoginForm';

interface AdminLoginProps {
  onNavigate: (page: string) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onNavigate }) => {
  return <RoleLoginForm role="admin" title="Admin Login" onNavigate={onNavigate} />;
};

export default AdminLogin;
