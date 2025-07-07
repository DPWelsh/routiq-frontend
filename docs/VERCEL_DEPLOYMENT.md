# 🚀 Vercel Deployment Guide - Routiq Frontend SaaS

This guide will help you deploy your Routiq Frontend SaaS to Vercel for production use.

## 📋 Prerequisites

- [Vercel Account](https://vercel.com) (free tier works)
- GitHub repository with your code
- Clerk account for authentication (optional for SaaS)
- Access to Routiq Backend API

## 🔧 Step 1: Prepare Your Repository

### 1.1 Ensure all files are committed
```bash
git add .
git commit -m "feat: prepare for Vercel deployment"
git push origin main
```

### 1.2 Verify build works locally
```bash
npm run build
npm start
```

## 🌐 Step 2: Deploy to Vercel

### 2.1 Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select "routiq-frontend"

### 2.2 Configure Build Settings
Vercel should auto-detect Next.js, but verify:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm ci`

## 🔐 Step 3: Environment Variables

Add these environment variables in Vercel Project Settings → Environment Variables:

### Required Variables
```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://routiq-backend-prod.up.railway.app

# Organization Configuration  
NEXT_PUBLIC_DEFAULT_ORG_ID=org_2xwHiNrj68eaRUlX10anlXGvzX7

# App Configuration
NEXT_PUBLIC_APP_NAME=Routiq Frontend
NEXT_PUBLIC_APP_DESCRIPTION=Smart Patient Management SaaS
NODE_ENV=production
```

### Optional: Clerk Authentication (if using auth)
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Optional: Analytics & Monitoring
```bash
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
SENTRY_DSN=your_sentry_dsn
```

## 🎯 Step 4: Domain Configuration

### 4.1 Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `app.routiq.com`)
3. Configure DNS records as instructed

### 4.2 Default Vercel Domain
Your app will be available at: `https://routiq-frontend-[hash].vercel.app`

## ✅ Step 5: Verify Deployment

### 5.1 Check Build Logs
- Monitor the deployment in Vercel dashboard
- Ensure no build errors
- Verify all environment variables are set

### 5.2 Test Functionality
Visit your deployed app and verify:
- ✅ Homepage loads correctly
- ✅ Patient data displays (53 patients)
- ✅ API endpoints work (`/api/active-patients`)
- ✅ Statistics load (`/api/active-patients/stats`)
- ✅ Search and filtering work
- ✅ Mobile responsiveness

## 🔧 Step 6: Production Optimizations

### 6.1 Performance Monitoring
- Enable Vercel Analytics in project settings
- Monitor Core Web Vitals
- Set up error tracking with Sentry (optional)

### 6.2 Security Headers
The `vercel.json` file includes security headers:
- Content Security Policy
- CORS headers for API routes
- XSS protection
- HSTS headers

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check for TypeScript errors
npm run type-check

# Check for linting errors  
npm run lint

# Test build locally
npm run build
```

#### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS headers in `vercel.json`
- Ensure backend API is accessible from Vercel

#### Environment Variables Not Working
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding new environment variables
- Check variable names match exactly (case-sensitive)

### Debug Commands
```bash
# Check environment in production
curl https://your-app.vercel.app/api/health

# Test API endpoints
curl https://your-app.vercel.app/api/active-patients
curl https://your-app.vercel.app/api/active-patients/stats
```

## 📊 Step 7: Monitoring & Maintenance

### 7.1 Set Up Monitoring
- Enable Vercel Analytics
- Configure uptime monitoring
- Set up error alerts

### 7.2 Regular Updates
```bash
# Update dependencies
npm update

# Deploy updates
git push origin main  # Auto-deploys to Vercel
```

## 🎉 Success!

Your Routiq Frontend SaaS is now live! 

### Key URLs:
- **Production App**: `https://your-app.vercel.app`
- **API Health**: `https://your-app.vercel.app/api/health`
- **Patient Data**: `https://your-app.vercel.app/api/active-patients`

### Features Available:
- ✅ 53 Real Active Patients
- ✅ Smart Priority Classification
- ✅ Real-time Statistics
- ✅ Mobile-responsive Interface
- ✅ Direct Patient Contact Actions
- ✅ Search & Filtering
- ✅ Production-ready Performance

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints directly
4. Check browser console for errors

Your SaaS is ready for production use! 🚀 