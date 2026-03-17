import React from 'react';
import RoleLoginForm from '../components/RoleLoginForm';

interface DonorLoginProps {
  onNavigate: (page: string) => void;
}

const DonorLogin: React.FC<DonorLoginProps> = ({ onNavigate }) => {
  return (
    <RoleLoginForm
      role="donor"
      title="Donor Login"
      onNavigate={onNavigate}
      allowRegister
    />
  );
};

export default DonorLogin;
