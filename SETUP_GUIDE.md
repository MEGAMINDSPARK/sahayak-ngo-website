# Sahayak NGO System - Complete Setup Guide

## Quick Start Guide

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. **Create a Supabase Account**
   - Go to https://supabase.com
   - Sign up for a free account
   - Create a new project

2. **Get Your Credentials**
   - Once your project is created, go to Project Settings > API
   - Copy your Project URL
   - Copy your anon/public key

3. **Update Environment Variables**
   - Open the `.env` file in the root directory
   - Replace the placeholder values:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Database Setup

The database schema is already created automatically when you first run migrations. You don't need to manually create tables.

### 4. Set Up Admin Account

**Important:** The admin credentials are:
- Email: rahulkumarroy399@gmail.com
- Password: Rahul@399

To create the admin account:

**Option 1: Using the Registration Page (Recommended)**
1. Start the application: `npm run dev`
2. Go to the Register page
3. Register with the admin email and password
4. After registration, go to your Supabase dashboard
5. Open the SQL Editor
6. Run this query to change the user role to admin:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'rahulkumarroy399@gmail.com';
```

**Option 2: Direct Database Insert**
1. Go to Supabase SQL Editor
2. The migration already created an admin user entry
3. You may need to update the password hash if needed

### 5. Add Sample Data (Optional)

To populate your database with test data:

1. Open Supabase SQL Editor
2. Copy and paste the content from `sample_data.sql`
3. Execute the query

This will add:
- 3 sample donors
- 3 sample volunteers
- 5 sample campaigns
- 3 sample events
- Sample donations
- Sample beneficiaries
- Sample messages

### 6. Run the Application

```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Testing the Application

### Test Admin Features

1. **Login as Admin**
   - Email: rahulkumarroy399@gmail.com
   - Password: Rahul@399

2. **Test These Features:**
   - View dashboard statistics
   - Create a new campaign
   - Approve/reject volunteer applications
   - Approve/reject beneficiaries
   - Send messages to donors and volunteers
   - View all donors and their donation history

### Test Donor Features

1. **Register as a New Donor**
   - Click "Register"
   - Choose "Donor" as role
   - Fill in your details

2. **Test These Features:**
   - View active campaigns
   - Make a donation
   - Download donation receipt
   - View donation history
   - View messages from admin

### Test Volunteer Features

1. **Register as a New Volunteer**
   - Click "Register"
   - Choose "Volunteer" as role
   - Fill in your details

2. **Test These Features:**
   - Apply as volunteer (fill skills, availability, experience)
   - Wait for admin approval (login as admin to approve)
   - Once approved, add beneficiaries
   - View campaigns and events
   - View messages from admin

## Common Issues and Solutions

### Issue: "Invalid Supabase credentials"
**Solution:**
- Double-check your `.env` file
- Ensure you copied the correct URL and anon key from Supabase
- Restart the dev server after updating `.env`

### Issue: "Login not working"
**Solution:**
- Make sure the admin account exists in the database
- Verify the password is correctly hashed
- Check browser console for error messages

### Issue: "Cannot create campaigns/donations"
**Solution:**
- Ensure you're logged in with the correct role
- Check that RLS policies are enabled in Supabase
- Verify the user ID matches in the database

### Issue: "Sample data not loading"
**Solution:**
- Run the `sample_data.sql` script again
- Check for any SQL errors in Supabase
- Ensure all tables exist before running sample data

## Database Schema Overview

### Tables Created:
1. **users** - All user accounts (admin, donor, volunteer)
2. **campaigns** - NGO campaigns for donations
3. **donations** - Records of all donations made
4. **volunteers** - Volunteer applications and profiles
5. **beneficiaries** - People who need help
6. **messages** - Messages from admin to users
7. **events** - Upcoming NGO events
8. **contact_messages** - Contact form submissions

### User Roles:
- **admin** - Full system access
- **donor** - Can donate and view donation history
- **volunteer** - Can apply as volunteer and add beneficiaries

## Security Notes

1. **Password Security**
   - All passwords are hashed using bcrypt
   - Never store plain text passwords

2. **Row Level Security (RLS)**
   - All tables have RLS enabled
   - Users can only access their own data
   - Admin has full access

3. **Authentication**
   - Session-based authentication using localStorage
   - Automatic logout on session expiry

## Features Checklist

### Admin Dashboard ✓
- [x] View statistics
- [x] Campaign management
- [x] Volunteer management
- [x] Donor management
- [x] Beneficiary management
- [x] Messaging system
- [x] Event management

### Donor Dashboard ✓
- [x] View campaigns
- [x] Make donations
- [x] Download receipts
- [x] View donation history
- [x] View messages

### Volunteer Dashboard ✓
- [x] Apply as volunteer
- [x] View campaigns
- [x] View events
- [x] Add beneficiaries
- [x] View messages

## Next Steps

1. Customize the design and branding
2. Add real payment gateway integration (Razorpay/Stripe)
3. Implement email notifications
4. Add advanced analytics
5. Create mobile app version

## Support

For any issues or questions:
- Email: rahulkumarroy399@gmail.com
- Check the README.md for detailed documentation

## Production Deployment

When deploying to production:

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder to:**
   - Vercel
   - Netlify
   - AWS S3
   - Any static hosting service

3. **Update environment variables:**
   - Set production Supabase credentials
   - Update CORS settings in Supabase

4. **Test thoroughly:**
   - Test all user roles
   - Test payment flows
   - Test on multiple devices
   - Check security settings

Good luck with your NGO management system!
