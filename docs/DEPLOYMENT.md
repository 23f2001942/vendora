# Deployment Guide

## Overview

This guide covers the complete setup and deployment process for Live MART, from local development to production deployment.

## Prerequisites

### Required Software
- **Node.js**: v18+ or v20+ ([Download](https://nodejs.org/))
- **npm**: v9+ (comes with Node.js) or **bun** for faster installs
- **Git**: For version control
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

### Required Accounts
1. **Supabase Account**: For database and backend ([Sign up](https://supabase.com))
2. **Google Cloud Platform**: For Maps API ([Sign up](https://console.cloud.google.com))
3. **Vercel/Lovable Account**: For frontend hosting (optional)

---

## Local Development Setup

### 1. Clone Repository

```bash
# Clone the repository
git clone <repository-url>
cd live-mart

# Or download and extract ZIP
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using bun (faster)
bun install
```

### 3. Environment Configuration

Create a `.env` file in the project root:

```bash
# .env
VITE_SUPABASE_URL=https://dvfknfniksvgmwmtrecv.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
```

**Getting Supabase Credentials:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy Project URL and anon public key

**Getting Google Maps API Key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Go to Credentials → Create Credentials → API Key
5. Restrict the key to your domain(s)

### 4. Start Development Server

```bash
npm run dev
# Or
bun dev

# Server starts at http://localhost:8080
```

### 5. Verify Setup

Visit `http://localhost:8080` and check:
- ✅ Homepage loads
- ✅ No console errors
- ✅ Can register/login
- ✅ Products display
- ✅ Maps work (if on order tracking)

---

## Database Setup

### 1. Connect to Existing Supabase Project

The project is already connected to:
- **Project ID**: `dvfknfniksvgmwmtrecv`
- **Database**: PostgreSQL with full schema
- **Edge Functions**: Deployed and configured

### 2. Database Schema

The database schema is fully configured with:
- ✅ All tables created
- ✅ RLS policies enabled
- ✅ Database functions
- ✅ Triggers
- ✅ Enums

**Verify Schema:**
```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Should return: profiles, user_roles, retailers, wholesalers, 
-- products, retailer_products, wholesaler_products, orders, 
-- order_items, delivery_tracking, cart_items, etc.
```

### 3. Authentication Setup

**Enable Auth Providers:**
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Email provider
3. Enable Google OAuth:
   - Add Google OAuth credentials
   - Set redirect URL: `https://your-domain.com/onboarding`
4. Enable Facebook OAuth (optional)

**Configure Email Templates:**
1. Go to Authentication → Email Templates
2. Customize confirmation and password reset emails

### 4. Edge Functions

**Deploy Edge Functions:**
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to project
supabase link --project-ref dvfknfniksvgmwmtrecv

# Deploy functions
supabase functions deploy check-auth-provider
supabase functions deploy simulate-delivery-progress
```

**Set Function Secrets:**
```bash
supabase secrets set GOOGLE_MAPS_API_KEY=your_key
```

**Verify Deployment:**
```bash
# Test check-auth-provider
curl -X POST \
  https://dvfknfniksvgmwmtrecv.supabase.co/functions/v1/check-auth-provider \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### 5. Cron Job Configuration

The delivery simulation runs every 1 minute:

```sql
-- Check cron job status
SELECT * FROM cron.job WHERE jobname = 'simulate-delivery-every-minute';

-- Manual trigger for testing
SELECT net.http_post(
  url:='https://dvfknfniksvgmwmtrecv.supabase.co/functions/v1/simulate-delivery-progress',
  headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
  body:='{}'::jsonb
) as request_id;
```

---

## Production Deployment

### Option 1: Deploy on Vercel

**1. Install Vercel CLI**
```bash
npm install -g vercel
```

**2. Deploy**
```bash
# Login
vercel login

# Deploy
vercel

# Follow prompts to link project
```

**3. Set Environment Variables**
In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GOOGLE_MAPS_API_KEY`

**4. Custom Domain**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Option 2: Deploy on Lovable

**1. Push to Lovable**
The project is already configured for Lovable deployment.

**2. Click "Publish"**
- Desktop: Top right button
- Mobile: Bottom right when in preview mode

**3. Update Changes**
Click "Update" in the publish dialog to deploy frontend changes.

**Note:** Backend changes (edge functions, database) deploy automatically.

### Option 3: Self-Hosting

**1. Build for Production**
```bash
npm run build
# Creates dist/ folder with optimized build
```

**2. Preview Build Locally**
```bash
npm run preview
# Test production build locally
```

**3. Deploy to Server**
```bash
# Upload dist/ folder to your server
# Configure web server (Nginx/Apache)

# Example Nginx configuration:
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Environment-Specific Configuration

### Development
```bash
# .env.development
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=local_key
VITE_GOOGLE_MAPS_API_KEY=dev_key
```

### Staging
```bash
# .env.staging
VITE_SUPABASE_URL=https://staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=staging_key
VITE_GOOGLE_MAPS_API_KEY=staging_key
```

### Production
```bash
# .env.production
VITE_SUPABASE_URL=https://dvfknfniksvgmwmtrecv.supabase.co
VITE_SUPABASE_ANON_KEY=prod_key
VITE_GOOGLE_MAPS_API_KEY=prod_key
```

---

## Post-Deployment Checklist

### ✅ Frontend
- [ ] Site loads correctly
- [ ] All routes accessible
- [ ] Images load properly
- [ ] Forms submit successfully
- [ ] No console errors

### ✅ Authentication
- [ ] Email signup works
- [ ] Email login works
- [ ] Google OAuth works
- [ ] Password reset works
- [ ] Session persists on refresh

### ✅ Database
- [ ] Users can register
- [ ] Data saves correctly
- [ ] RLS policies enforced
- [ ] Queries perform well
- [ ] No permission errors

### ✅ Features
- [ ] Product browsing works
- [ ] Cart functionality works
- [ ] Checkout process completes
- [ ] Orders created successfully
- [ ] Delivery tracking updates
- [ ] Notifications received
- [ ] Analytics display correctly

### ✅ Performance
- [ ] Page load < 3 seconds
- [ ] Images optimized
- [ ] No memory leaks
- [ ] Mobile responsive

### ✅ Security
- [ ] HTTPS enabled
- [ ] API keys secured
- [ ] RLS policies active
- [ ] No sensitive data exposed
- [ ] CORS configured correctly

---

## Monitoring & Maintenance

### Application Monitoring

**Supabase Dashboard:**
1. Database → Logs: Monitor query performance
2. Edge Functions → Logs: Check function execution
3. Authentication → Users: Track user growth
4. Database → Table Editor: View/edit data

**Error Tracking:**
```typescript
// Add Sentry (optional)
npm install @sentry/react

// Configure in main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE,
});
```

### Performance Monitoring

**Check Edge Function Logs:**
```bash
supabase functions logs simulate-delivery-progress --limit 50
```

**Database Performance:**
```sql
-- Slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Backup Strategy

**Automated Backups:**
- Supabase automatically backs up database daily
- Point-in-time recovery available

**Manual Backup:**
```bash
# Export database
supabase db dump -f backup.sql

# Import database
supabase db push backup.sql
```

**Code Backups:**
```bash
# Push to Git regularly
git add .
git commit -m "Update: feature description"
git push origin main
```

---

## Troubleshooting

### Common Issues

**Issue: "Failed to load products"**
- Check Supabase connection
- Verify RLS policies
- Check authentication status
- Review console errors

**Issue: "Google Maps not loading"**
- Verify API key is correct
- Check API key restrictions
- Ensure billing enabled on GCP
- Check browser console for errors

**Issue: "Delivery not progressing"**
- Check cron job status: `SELECT * FROM cron.job`
- Verify edge function logs
- Manually trigger function for testing
- Check order status is 'confirmed'

**Issue: "Authentication not working"**
- Check environment variables
- Verify Supabase auth settings
- Clear browser cache/cookies
- Check redirect URLs match

**Issue: "Build fails"**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run build`
- Verify all dependencies installed
- Check for syntax errors

### Debug Mode

**Enable Detailed Logging:**
```typescript
// In supabase/client.ts
export const supabase = createClient(URL, KEY, {
  auth: {
    debug: true // Enable auth logs
  }
});
```

**Check Network Requests:**
1. Open Browser DevTools
2. Go to Network tab
3. Filter by XHR/Fetch
4. Check request/response

---

## Scaling Considerations

### Database Optimization
- Add indexes for frequently queried columns
- Use materialized views for analytics
- Implement connection pooling
- Archive old data periodically

### Frontend Optimization
- Implement code splitting
- Add service worker for caching
- Use CDN for static assets
- Optimize images (WebP, lazy loading)

### Backend Scaling
- Monitor edge function execution time
- Optimize database queries
- Consider caching layer (Redis)
- Use queue for background jobs

---

## Security Best Practices

### API Keys
- ✅ Never commit `.env` to Git
- ✅ Use different keys for dev/prod
- ✅ Rotate keys periodically
- ✅ Restrict API key domains

### Database Security
- ✅ RLS enabled on all tables
- ✅ Validate input in edge functions
- ✅ Use prepared statements
- ✅ Regular security audits

### Authentication
- ✅ Enforce strong passwords
- ✅ Enable email verification
- ✅ Implement rate limiting
- ✅ Monitor suspicious activity

---

## Support & Resources

### Documentation
- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Google Maps API](https://developers.google.com/maps/documentation)

### Community
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](your-repo/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/supabase)

### Contact
For project-specific questions, contact the team:
- Srirangam Pranav (Customer End)
- Mohammed Faiz (Retailer End)
- Kasaraneni Ishan (Wholesaler End)
- Sana Nitchel Kumar (Testing & QA)

---

## Next Steps

After successful deployment:
1. ✅ Test all user flows end-to-end
2. ✅ Set up monitoring and alerts
3. ✅ Create user documentation
4. ✅ Plan feature roadmap
5. ✅ Gather user feedback
6. ✅ Iterate and improve

---

## License

This project is developed for academic purposes as part of BITS Pilani coursework.
