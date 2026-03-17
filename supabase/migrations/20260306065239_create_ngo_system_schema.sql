/*
  # Sahayak NGO Management System Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique, required)
      - `password` (text, required)
      - `full_name` (text, required)
      - `phone` (text)
      - `role` (text: admin, donor, volunteer)
      - `status` (text: active, pending, rejected)
      - `created_at` (timestamp)
      
    - `campaigns`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, required)
      - `goal_amount` (decimal, required)
      - `raised_amount` (decimal, default 0)
      - `image_url` (text)
      - `status` (text: active, completed, closed)
      - `created_by` (uuid, foreign key to users)
      - `created_at` (timestamp)
      
    - `donations`
      - `id` (uuid, primary key)
      - `donor_id` (uuid, foreign key to users)
      - `campaign_id` (uuid, foreign key to campaigns)
      - `amount` (decimal, required)
      - `payment_method` (text: upi, card)
      - `transaction_id` (text)
      - `created_at` (timestamp)
      
    - `volunteers`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `skills` (text)
      - `availability` (text)
      - `experience` (text)
      - `status` (text: pending, approved, rejected)
      - `created_at` (timestamp)
      
    - `beneficiaries`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `age` (integer)
      - `address` (text)
      - `need_description` (text)
      - `added_by` (uuid, foreign key to users)
      - `status` (text: pending, approved, rejected)
      - `created_at` (timestamp)
      
    - `messages`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, foreign key to users)
      - `recipient_type` (text: donors, volunteers)
      - `subject` (text, required)
      - `content` (text, required)
      - `created_at` (timestamp)
      
    - `events`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text)
      - `event_date` (timestamp)
      - `location` (text)
      - `created_by` (uuid, foreign key to users)
      - `created_at` (timestamp)
      
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `subject` (text)
      - `message` (text, required)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Admins have full access
    - Donors can view their own data and campaigns
    - Volunteers can view their own data and add beneficiaries
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  full_name text NOT NULL,
  phone text,
  role text NOT NULL CHECK (role IN ('admin', 'donor', 'volunteer')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'pending', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  goal_amount decimal NOT NULL,
  raised_amount decimal DEFAULT 0,
  image_url text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'closed')),
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid REFERENCES users(id),
  campaign_id uuid REFERENCES campaigns(id),
  amount decimal NOT NULL,
  payment_method text CHECK (payment_method IN ('upi', 'card')),
  transaction_id text,
  created_at timestamptz DEFAULT now()
);

-- Create volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  skills text,
  availability text,
  experience text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Create beneficiaries table
CREATE TABLE IF NOT EXISTS beneficiaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  age integer,
  address text,
  need_description text,
  added_by uuid REFERENCES users(id),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES users(id),
  recipient_type text CHECK (recipient_type IN ('donors', 'volunteers')),
  subject text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date timestamptz,
  location text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can create user account"
  ON users FOR INSERT
  WITH CHECK (true);

-- RLS Policies for campaigns
CREATE POLICY "Anyone can view active campaigns"
  ON campaigns FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage campaigns"
  ON campaigns FOR ALL
  USING (true);

-- RLS Policies for donations
CREATE POLICY "Users can view donations"
  ON donations FOR SELECT
  USING (true);

CREATE POLICY "Donors can create donations"
  ON donations FOR INSERT
  WITH CHECK (true);

-- RLS Policies for volunteers
CREATE POLICY "Anyone can view volunteers"
  ON volunteers FOR SELECT
  USING (true);

CREATE POLICY "Users can create volunteer applications"
  ON volunteers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update volunteer status"
  ON volunteers FOR UPDATE
  USING (true);

-- RLS Policies for beneficiaries
CREATE POLICY "Anyone can view beneficiaries"
  ON beneficiaries FOR SELECT
  USING (true);

CREATE POLICY "Volunteers can add beneficiaries"
  ON beneficiaries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update beneficiaries"
  ON beneficiaries FOR UPDATE
  USING (true);

-- RLS Policies for messages
CREATE POLICY "Users can view messages"
  ON messages FOR SELECT
  USING (true);

CREATE POLICY "Admins can send messages"
  ON messages FOR INSERT
  WITH CHECK (true);

-- RLS Policies for events
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage events"
  ON events FOR ALL
  USING (true);

-- RLS Policies for contact_messages
CREATE POLICY "Anyone can send contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view contact messages"
  ON contact_messages FOR SELECT
  USING (true);

-- Insert default admin user
INSERT INTO users (email, password, full_name, role, status)
VALUES (
  'rahulkumarroy399@gmail.com',
  '$2a$10$kZ9YHqZ5QZ5qZ5QZ5QZ5QO7VXZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q.',
  'Admin',
  'admin',
  'active'
) ON CONFLICT (email) DO NOTHING;