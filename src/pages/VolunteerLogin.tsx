import React from 'react';
import RoleLoginForm from '../components/RoleLoginForm';

interface VolunteerLoginProps {
  onNavigate: (page: string) => void;
}

const VolunteerLogin: React.FC<VolunteerLoginProps> = ({ onNavigate }) => {
  return (
    <RoleLoginForm
      role="volunteer"
      title="Volunteer Login"
      onNavigate={onNavigate}
      allowRegister
    />
  );
};

export default VolunteerLogin;
