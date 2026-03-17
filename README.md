# Combined README
# ?? Sahayak NGO Platform
### ?? *Helping Hands for a Better Tomorrow*

---

## ? Overview
**Sahayak NGO** is a modern, full-stack web application designed to support social causes like child education, women empowerment, healthcare, and helping needy people.

It provides a complete system for **donations, volunteer management, campaigns, and real-time communication**.

---

## ?? Live Features

### ????? Admin Dashboard
- ?? View total donations, donors, and volunteers
- ?? Create & manage campaigns
- ? Approve/reject volunteers
- ?? Reports & analytics (monthly donations, top donors)
- ?? Real-time notifications

### ?? Donor Dashboard
- ?? Donate to meaningful campaigns
- ?? View donation history
- ?? Download donation receipts
- ?? Message admin
- ?? Top Donor Badge system

### ?? Volunteer Dashboard
- ?? Apply for volunteering
- ?? View assigned tasks
- ?? Upload activity proof
- ???????? Add beneficiaries
- ? Earn certificates & badges

---

## ?? Special Highlights
- ?? Donation celebration (Balloons + Confetti)
- ?? Smart Notification System
- ?? Campaign Progress Bars
- ?? Real-time Messaging System
- ?? Role-Based Authentication (Admin / Donor / Volunteer)

---

## ??? Tech Stack

| Technology | Usage |
|-----------|------|
| ?? React.js | Frontend |
| ? Vite | Fast Build Tool |
| ?? Supabase | Backend & Auth |
| ?? PostgreSQL | Database |
| ?? Netlify | Deployment |

---

# Sahayak NGO Management and Donation System

A complete web application for NGO management with separate dashboards for Admin, Donors, and Volunteers.

## Features

### Admin Dashboard
- View statistics (Total Donations, Donors, Volunteers, Campaigns, Beneficiaries)
- Campaign Management (Create, Edit, Delete campaigns)
- Volunteer Management (Approve/Reject volunteer applications)
- Donor Management (View all donors)
- Beneficiary Management (Approve/Reject beneficiaries)
- Messaging System (Send messages to Donors and Volunteers)
- Event Management

### Donor Dashboard
- View donation history
- Download donation receipts
- View and donate to active campaigns
- Receive messages from admin
- Update profile

### Volunteer Dashboard
- Apply as volunteer
- View campaign information
- View upcoming events
- Add beneficiaries (only approved volunteers)
- Receive messages from admin
- Update profile

## Technology Stack

### Frontend
- React.js
- Bootstrap 5
- TypeScript
- bcryptjs for password hashing

### Backend
- Supabase (PostgreSQL Database)
- Supabase Authentication

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd sahayak-ngo-system
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Once the project is created, go to Project Settings > API
3. Copy your project URL and anon key
4. Update the `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Step 4: Database Setup

The database schema has already been created automatically. The following tables are available:
- users
- campaigns
- donations
- volunteers
- beneficiaries
- messages
- events
- contact_messages

### Step 5: Admin Account

An admin account is pre-configured with the following credentials:

**Email:** rahulkumarroy399@gmail.com
**Password:** Rahul@399

**Note:** You'll need to hash the password in the database. The system uses bcrypt for password hashing.

To set up the admin password:
1. Go to your Supabase project
2. Open the SQL Editor
3. Run the following query:

```sql
-- Update admin password (pre-hashed for 'Rahul@399')
UPDATE users
SET password = '$2a$10$YourHashedPasswordHere'
WHERE email = 'rahulkumarroy399@gmail.com';
```

Or you can use the registration page to create the admin account first, then manually update the role to 'admin' in the database.

### Step 6: Run the Application

Development mode:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

Production build:
```bash
npm run build
npm run preview
```

## Usage Guide

### For Admin
1. Login with admin credentials
2. Access the Admin Dashboard
3. Manage campaigns, volunteers, donors, and beneficiaries
4. Send messages to users
5. View statistics and reports

### For Donors
1. Register as a Donor
2. Login with credentials
3. Browse active campaigns
4. Make donations using UPI or Card
5. Download donation receipts
6. View messages from admin

### For Volunteers
1. Register as a Volunteer
2. Login with credentials
3. Apply for volunteer status
4. Wait for admin approval
5. Once approved, add beneficiaries
6. View campaigns and events
7. View messages from admin

## Project Structure

```
sahayak-ngo-system/
+-- src/
¦   +-- components/
¦   ¦   +-- Navbar.tsx
¦   ¦   +-- Footer.tsx
¦   +-- context/
¦   ¦   +-- AuthContext.tsx
¦   ¦   +-- useAuth.tsx
¦   +-- lib/
¦   ¦   +-- supabase.ts
¦   +-- pages/
¦   ¦   +-- Home.tsx
¦   ¦   +-- About.tsx
¦   ¦   +-- Campaigns.tsx
¦   ¦   +-- Donate.tsx
¦   ¦   +-- Events.tsx
¦   ¦   +-- Contact.tsx
¦   ¦   +-- Login.tsx
¦   ¦   +-- Register.tsx
¦   ¦   +-- AdminDashboard.tsx
¦   ¦   +-- DonorDashboard.tsx
¦   ¦   +-- VolunteerDashboard.tsx
¦   +-- App.tsx
¦   +-- main.tsx
¦   +-- index.css
+-- .env
+-- package.json
+-- README.md
```

## Security Features

- JWT Authentication
- Password hashing using bcrypt
- Row Level Security (RLS) on database
- Role-based access control
- Protected routes for dashboards
- Input validation

## Color Scheme

The application uses Bootstrap's default color scheme with emphasis on:
- Primary: Blue
- Success: Green
- Light backgrounds: White

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Database Connection Issues
- Verify your Supabase URL and anon key in `.env`
- Check if your Supabase project is active
- Ensure RLS policies are properly configured

### Build Errors
- Delete `node_modules` and run `npm install` again
- Clear the build cache: `rm -rf dist`
- Check Node.js version compatibility

### Login Issues
- Verify the admin credentials in the database
- Check if the password is properly hashed
- Ensure the user role is set to 'admin'

## Support

For issues and questions, please contact: rahulkumarroy399@gmail.com

## License

This project is developed for educational purposes.
