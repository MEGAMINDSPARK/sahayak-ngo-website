🌟 Sahayak NGO Platform
🤝 Helping Hands for a Better Tomorrow
📌 Overview

Sahayak NGO is a modern full-stack web application built to support social causes like:

🎓 Child Education

👩‍🦱 Women Empowerment

🩺 Healthcare

🤝 Helping Needy People

It provides a complete system for donations, volunteer management, campaigns, and real-time communication.

🚀 Live Features
👨‍💼 Admin Dashboard

📊 View total donations, donors, and volunteers

📝 Create & manage campaigns

✅ Approve / ❌ Reject volunteers

📈 Reports & analytics (monthly donations, top donors)

🔔 Real-time notifications

💰 Donor Dashboard

❤️ Donate to meaningful campaigns

📜 View donation history

📥 Download donation receipts

💬 Message admin

🏆 Top Donor Badge system

🙋 Volunteer Dashboard

📝 Apply for volunteering

📋 View assigned tasks

📤 Upload activity proof

👨‍👩‍👧 Add beneficiaries

🎖️ Earn certificates & badges

✨ Special Highlights

🎉 Donation Celebration (Balloons 🎈 + Confetti 🎊)

🔔 Smart Notification System

📊 Campaign Progress Bars

💬 Real-time Messaging System

🔐 Role-Based Authentication (Admin / Donor / Volunteer)

🛠️ Tech Stack
💻 Technology	🚀 Usage
⚛️ React.js	Frontend
⚡ Vite	Fast Build Tool
🗄️ Supabase	Backend & Authentication
🐘 PostgreSQL	Database
🌐 Netlify	Deployment
📂 Sahayak NGO Management & Donation System

A complete web application with separate dashboards for:

👨‍💼 Admin

💰 Donors

🙋 Volunteers

🔥 Features
👨‍💼 Admin Dashboard

📊 View statistics (Donations, Donors, Volunteers, Campaigns, Beneficiaries)

📢 Campaign Management (Create, Edit, Delete)

🙋 Volunteer Management (Approve/Reject)

💰 Donor Management

👨‍👩‍👧 Beneficiary Management

💬 Messaging System

📅 Event Management

💰 Donor Dashboard

📜 View donation history

📥 Download receipts

❤️ Donate to campaigns

💬 Receive admin messages

👤 Update profile

🙋 Volunteer Dashboard

📝 Apply as volunteer

📢 View campaigns & events

👨‍👩‍👧 Add beneficiaries (after approval)

💬 Receive admin messages

👤 Update profile

⚙️ Setup Instructions
📌 Prerequisites

🟢 Node.js (v16 or higher)

📦 npm or yarn

🗄️ Supabase account

🔽 Step 1: Clone Repository
git clone <repository-url>
cd sahayak-ngo-system
📦 Step 2: Install Dependencies
npm install
🔗 Step 3: Setup Supabase

Go to 👉 https://supabase.com

Create a new project

Go to Project Settings → API

Copy:

Project URL

Anon Key

Update .env file:

VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
🗄️ Step 4: Database Setup

Tables included:

👤 users

📢 campaigns

💰 donations

🙋 volunteers

👨‍👩‍👧 beneficiaries

💬 messages

📅 events

📩 contact_messages

🔑 Step 5: Admin Account

Email: rahulkumarroy399@gmail.com

Password: Rahul@399

⚠️ Note: Password must be hashed using bcrypt

UPDATE users
SET password = '$2a$10$YourHashedPasswordHere'
WHERE email = 'rahulkumarroy399@gmail.com';
▶️ Step 6: Run Application
💻 Development Mode
npm run dev

➡️ Runs at: http://localhost:5173

🚀 Production Build
npm run build
npm run preview
📖 Usage Guide
👨‍💼 For Admin

🔐 Login → Dashboard

📢 Manage campaigns

🙋 Approve volunteers

📊 View reports

💬 Send messages

💰 For Donors

📝 Register & Login

❤️ Donate to campaigns

📥 Download receipts

💬 View admin messages

🙋 For Volunteers

📝 Register

⏳ Wait for approval

👨‍👩‍👧 Add beneficiaries

📢 View events & campaigns

📁 Project Structure
sahayak-ngo-system/
├── src/
│   ├── components/
│   ├── context/
│   ├── lib/
│   ├── pages/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env
├── package.json
└── README.md
🔐 Security Features

🔑 JWT Authentication

🔒 Password hashing (bcrypt)

🛡️ Row Level Security (RLS)

👥 Role-based access control

🚫 Protected routes

✔️ Input validation

🎨 Color Scheme

🔵 Primary: Blue

🟢 Success: Green

⚪ Light Background: White

🌍 Browser Support

🌐 Chrome

🦊 Firefox

🍎 Safari

🧭 Edge

🛠️ Troubleshooting
⚠️ Database Issues

✔️ Check Supabase URL & Key

✔️ Ensure project is active

✔️ Verify RLS policies

⚠️ Build Errors
rm -rf node_modules
npm install
⚠️ Login Issues

✔️ Verify credentials

✔️ Check hashed password

✔️ Ensure role = 'admin'

📞 Support

📧 Email: rahulkumarroy399@gmail.com

📄 License

🎓 This project is developed for educational purposes.
