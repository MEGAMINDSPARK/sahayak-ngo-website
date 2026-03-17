-- Sample Data for Sahayak NGO Management System
-- Run this in Supabase SQL Editor after setting up the schema

-- Insert sample admin user (password: Rahul@399)
-- Note: You need to hash this password using bcrypt before inserting
INSERT INTO users (email, password, full_name, role, status, phone)
VALUES (
  'rahulkumarroy399@gmail.com',
  '$2a$10$kZ9YHqZ5QZ5qZ5QZ5QZ5QO7VXZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q.',
  'Admin',
  'admin',
  'active',
  '+91-9876543210'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample donor users
INSERT INTO users (email, password, full_name, role, status, phone)
VALUES
  ('donor1@example.com', '$2a$10$kZ9YHqZ5QZ5qZ5QZ5QZ5QO7VXZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q.', 'Rajesh Kumar', 'donor', 'active', '+91-9876543211'),
  ('donor2@example.com', '$2a$10$kZ9YHqZ5QZ5qZ5QZ5QZ5QO7VXZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q.', 'Priya Sharma', 'donor', 'active', '+91-9876543212'),
  ('donor3@example.com', '$2a$10$kZ9YHqZ5QZ5qZ5QZ5QZ5QO7VXZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q.', 'Amit Patel', 'donor', 'active', '+91-9876543213')
ON CONFLICT (email) DO NOTHING;

-- Insert sample volunteer users
INSERT INTO users (email, password, full_name, role, status, phone)
VALUES
  ('volunteer1@example.com', '$2a$10$kZ9YHqZ5QZ5qZ5QZ5QZ5QO7VXZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q.', 'Sneha Reddy', 'volunteer', 'active', '+91-9876543214'),
  ('volunteer2@example.com', '$2a$10$kZ9YHqZ5QZ5qZ5QZ5QZ5QO7VXZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q.', 'Vikram Singh', 'volunteer', 'active', '+91-9876543215'),
  ('volunteer3@example.com', '$2a$10$kZ9YHqZ5QZ5qZ5QZ5QZ5QO7VXZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q.', 'Ananya Gupta', 'volunteer', 'active', '+91-9876543216')
ON CONFLICT (email) DO NOTHING;

-- Insert sample campaigns
INSERT INTO campaigns (title, description, goal_amount, raised_amount, status, created_by)
SELECT
  'Education for Underprivileged Children',
  'Provide quality education and school supplies to children from low-income families. Your donation will help provide books, uniforms, and tuition fees for deserving students.',
  100000,
  45000,
  'active',
  id
FROM users WHERE email = 'rahulkumarroy399@gmail.com' LIMIT 1;

INSERT INTO campaigns (title, description, goal_amount, raised_amount, status, created_by)
SELECT
  'Healthcare Initiative for Rural Areas',
  'Organize free medical camps and provide essential healthcare services to rural communities. Your contribution will help us reach remote villages with medical aid.',
  150000,
  78000,
  'active',
  id
FROM users WHERE email = 'rahulkumarroy399@gmail.com' LIMIT 1;

INSERT INTO campaigns (title, description, goal_amount, raised_amount, status, created_by)
SELECT
  'Clean Water Project',
  'Install water purification systems in villages lacking access to clean drinking water. Help us provide safe water to communities in need.',
  200000,
  120000,
  'active',
  id
FROM users WHERE email = 'rahulkumarroy399@gmail.com' LIMIT 1;

INSERT INTO campaigns (title, description, goal_amount, raised_amount, status, created_by)
SELECT
  'Women Empowerment Program',
  'Provide skill development training and microfinance support to women entrepreneurs. Empower women to become financially independent.',
  80000,
  35000,
  'active',
  id
FROM users WHERE email = 'rahulkumarroy399@gmail.com' LIMIT 1;

INSERT INTO campaigns (title, description, goal_amount, raised_amount, status, created_by)
SELECT
  'Food Distribution Drive',
  'Distribute nutritious meals to homeless people and daily wage workers. Your donation will help feed hundreds of families.',
  50000,
  42000,
  'active',
  id
FROM users WHERE email = 'rahulkumarroy399@gmail.com' LIMIT 1;

-- Insert sample events
INSERT INTO events (title, description, event_date, location, created_by)
SELECT
  'Annual Charity Run 2024',
  'Join us for our annual charity run to raise funds for education. All ages welcome!',
  NOW() + INTERVAL '30 days',
  'Central Park, New Delhi',
  id
FROM users WHERE email = 'rahulkumarroy399@gmail.com' LIMIT 1;

INSERT INTO events (title, description, event_date, location, created_by)
SELECT
  'Health Awareness Camp',
  'Free health checkup and awareness session on preventive healthcare. Bring your family!',
  NOW() + INTERVAL '15 days',
  'Community Center, Sector 15',
  id
FROM users WHERE email = 'rahulkumarroy399@gmail.com' LIMIT 1;

INSERT INTO events (title, description, event_date, location, created_by)
SELECT
  'Volunteer Orientation Program',
  'Introduction session for new volunteers. Learn about our mission and how you can contribute.',
  NOW() + INTERVAL '7 days',
  'NGO Office, Main Building',
  id
FROM users WHERE email = 'rahulkumarroy399@gmail.com' LIMIT 1;

-- Insert sample volunteer applications
INSERT INTO volunteers (user_id, skills, availability, experience, status)
SELECT
  id,
  'Teaching, Community Outreach',
  'Weekends',
  '2 years of volunteer work with local NGOs',
  'approved'
FROM users WHERE email = 'volunteer1@example.com' LIMIT 1;

INSERT INTO volunteers (user_id, skills, availability, experience, status)
SELECT
  id,
  'Medical Support, First Aid',
  'Weekdays Evening',
  'Nursing background, 5 years experience',
  'approved'
FROM users WHERE email = 'volunteer2@example.com' LIMIT 1;

INSERT INTO volunteers (user_id, skills, availability, experience, status)
SELECT
  id,
  'Event Management, Fundraising',
  'Flexible',
  'Event coordinator for 3 years',
  'pending'
FROM users WHERE email = 'volunteer3@example.com' LIMIT 1;

-- Insert sample donations
INSERT INTO donations (donor_id, campaign_id, amount, payment_method, transaction_id)
SELECT
  u.id,
  c.id,
  5000,
  'upi',
  'TXN' || EXTRACT(EPOCH FROM NOW())::TEXT || '001'
FROM users u, campaigns c
WHERE u.email = 'donor1@example.com'
  AND c.title = 'Education for Underprivileged Children'
LIMIT 1;

INSERT INTO donations (donor_id, campaign_id, amount, payment_method, transaction_id)
SELECT
  u.id,
  c.id,
  10000,
  'card',
  'TXN' || EXTRACT(EPOCH FROM NOW())::TEXT || '002'
FROM users u, campaigns c
WHERE u.email = 'donor2@example.com'
  AND c.title = 'Healthcare Initiative for Rural Areas'
LIMIT 1;

INSERT INTO donations (donor_id, campaign_id, amount, payment_method, transaction_id)
SELECT
  u.id,
  c.id,
  7500,
  'upi',
  'TXN' || EXTRACT(EPOCH FROM NOW())::TEXT || '003'
FROM users u, campaigns c
WHERE u.email = 'donor3@example.com'
  AND c.title = 'Clean Water Project'
LIMIT 1;

-- Insert sample beneficiaries
INSERT INTO beneficiaries (name, age, address, need_description, added_by, status)
SELECT
  'Ramesh Kumar',
  45,
  'Village Rampur, District Meerut',
  'Requires financial support for daughter education and medical treatment',
  id,
  'approved'
FROM users WHERE email = 'volunteer1@example.com' LIMIT 1;

INSERT INTO beneficiaries (name, age, address, need_description, added_by, status)
SELECT
  'Lakshmi Devi',
  52,
  'Slum Area, Sector 22, Noida',
  'Needs assistance for cataract surgery and basic healthcare',
  id,
  'approved'
FROM users WHERE email = 'volunteer2@example.com' LIMIT 1;

INSERT INTO beneficiaries (name, age, address, need_description, added_by, status)
SELECT
  'Suresh Yadav',
  38,
  'Village Bhimpur, Ghaziabad',
  'Requires support for child education and vocational training',
  id,
  'pending'
FROM users WHERE email = 'volunteer1@example.com' LIMIT 1;

-- Insert sample messages from admin to donors
INSERT INTO messages (sender_id, recipient_type, subject, content)
SELECT
  id,
  'donors',
  'Thank You for Your Generous Support',
  'Dear Donors, We are grateful for your continued support. Your donations have helped us reach 500+ families this month. Together, we are making a real difference!'
FROM users WHERE email = 'rahulkumarroy399@gmail.com' LIMIT 1;

-- Insert sample messages from admin to volunteers
INSERT INTO messages (sender_id, recipient_type, subject, content)
SELECT
  id,
  'volunteers',
  'Upcoming Volunteer Training Session',
  'Dear Volunteers, We are organizing a training session on community outreach next Saturday. Please confirm your attendance. Your dedication inspires us!'
FROM users WHERE email = 'rahulkumarroy399@gmail.com' LIMIT 1;

-- Insert sample contact messages
INSERT INTO contact_messages (name, email, subject, message)
VALUES
  ('Rohit Sharma', 'rohit@example.com', 'Partnership Inquiry', 'I would like to discuss potential partnership opportunities with your NGO.'),
  ('Neha Kapoor', 'neha@example.com', 'Volunteer Inquiry', 'I am interested in volunteering with your organization. How can I get started?'),
  ('Arun Mehta', 'arun@example.com', 'Donation Receipt', 'I need a copy of my donation receipt from last month. Transaction ID: TXN123456');
