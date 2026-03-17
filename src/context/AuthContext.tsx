
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  phone?: string;
  address?: string;
  country?: string;
  state?: string;
  profile_image?: string | null;
  status: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    role: string
  ) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const normalizeRole = (role?: string) => role?.toLowerCase();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const storedUser = sessionStorage.getItem('ngo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  };

  // LOGIN FUNCTION (NO HASH)
  const login = async (email: string, password: string) => {

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error || !data) {
      throw new Error('Invalid credentials');
    }

    // Plain password comparison
    if (password !== data.password) {
      throw new Error('Invalid credentials');
    }

    const userData: User = {
      id: data.id,
      email: data.email,
      full_name: data.full_name,
      role: normalizeRole(data.role) || data.role,
      phone: data.phone,
      address: data.address,
      country: data.country,
      state: data.state,
      profile_image: data.profile_image,
      status: data.status
    };

    sessionStorage.setItem('ngo_user', JSON.stringify(userData));
    setUser(userData);
  };

  // REGISTER FUNCTION (NO HASH)
  const register = async (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    role: string
  ) => {

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email: email,
          password: password,
          full_name: fullName,
          phone: phone,
          address: '',
          country: '',
          state: '',
          role: normalizeRole(role) || role,
          status: 'active'
        }
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const userData: User = {
      id: data.id,
      email: data.email,
      full_name: data.full_name,
      role: normalizeRole(data.role) || data.role,
      phone: data.phone,
      address: data.address,
      country: data.country,
      state: data.state,
      profile_image: data.profile_image,
      status: data.status
    };

    sessionStorage.setItem('ngo_user', JSON.stringify(userData));
    setUser(userData);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Failed to update profile');
    }

    const updatedUser: User = {
      ...user,
      ...updates,
      email: data.email,
      full_name: data.full_name,
      phone: data.phone,
      address: data.address,
      country: data.country,
      state: data.state,
      profile_image: data.profile_image
    };

    sessionStorage.setItem('ngo_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const logout = async () => {
    sessionStorage.removeItem('ngo_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
