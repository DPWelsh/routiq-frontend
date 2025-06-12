# 🚀 Routiq Frontend - Smart Patient Management SaaS

Modern SaaS application for healthcare providers focused on active patient management, churn analysis, and rebooking automation.

## 📋 Overview

Routiq Frontend is a smart patient management SaaS that helps healthcare practices:
- **Active Patient Management:** Monitor and prioritize patient engagement
- **Churn Analysis:** Identify patients at risk of leaving your practice
- **Rebooking Automation:** Smart prioritization for follow-up appointments
- **Patient Communications:** Direct calling and emailing from the platform
- **Real-time Analytics:** Track patient engagement and appointment patterns

## 🎯 Current Features

### ✅ Core SaaS Features
- **Active Patient Dashboard:** Smart overview with priority-based filtering
- **Priority Management:** High, medium, low priority patient classification
- **Patient Search & Filter:** Real-time search across name, phone, and email
- **Direct Communications:** One-click calling and emailing
- **Churn Risk Analysis:** Identify patients based on last visit timing
- **Appointment Tracking:** Monitor upcoming and past appointments
- **Responsive Design:** Mobile-first SaaS interface with modern UI

### 🎯 Smart Prioritization
- **High Priority:** Patients 30+ days since last visit
- **Medium Priority:** Patients with no upcoming appointments
- **Low Priority:** Patients already scheduled
- **Active Patients:** Recently engaged patients
- **Upcoming Appointments:** Patients with future bookings

## 🛠 Tech Stack

- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript for type safety
- **Authentication:** Clerk for user management
- **State Management:** TanStack Query + Zustand
- **UI Framework:** Tailwind CSS + shadcn/ui components
- **HTTP Client:** Built-in fetch with custom API wrapper

## 🔗 Backend Integration

**Production API:** `https://routiq-backend-v10-production.up.railway.app`

### Current Working Endpoints:
```typescript
// Sync operations (working now)
POST /api/v1/admin/clerk/sync
GET  /api/v1/admin/clerk/status
GET  /api/v1/admin/clerk/database-summary

// Active patients endpoints (ready when environment configured)
GET  /api/v1/admin/active-patients/{org_id}
GET  /api/v1/admin/active-patients/{org_id}/summary
GET  /api/v1/admin/sync/dashboard/{org_id}
```

### Test Data Available:
- **Organization ID:** `org_2xwHiNrj68eaRUlX10anlXGvzX7` (Surf Rehab)
- **632 total contacts** imported from Cliniko
- **47 active patients** with recent appointments
- **99.1% phone number extraction** success rate

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd routiq-frontend
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Add required variables:
NEXT_PUBLIC_API_URL=https://routiq-backend-v10-production.up.railway.app
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
```

### 3. Development Server
```bash
npm run dev
# Open http://localhost:3000
```

### 4. Test Integration
```bash
# Test backend connection
curl https://routiq-backend-v10-production.up.railway.app/health

# Trigger sync (should work immediately)
curl -X POST https://routiq-backend-v10-production.up.railway.app/api/v1/admin/clerk/sync \
  -H "Content-Type: application/json" \
  -d '{"organization_id": "org_2xwHiNrj68eaRUlX10anlXGvzX7"}'
```

## 📁 Project Structure

```
routiq-frontend/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   └── page.tsx        # Main active patients SaaS interface
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui base components
│   │   ├── magicui/        # Enhanced UI components (BlurFade, NumberTicker)
│   │   └── features/       # Patient management components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and configurations
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
└── docs/                   # Documentation
```

## 🎨 Design System

Based on `frontend-v0` prototype with:
- **shadcn/ui components** for consistent design
- **Tailwind CSS** for styling
- **Responsive layouts** for mobile/desktop
- **Dark/light mode** support
- **Healthcare-focused UX** patterns

## 🔌 API Integration

### API Client Setup
```typescript
// lib/api.ts
import { RoutiqAPI } from './routiq-api';

const api = new RoutiqAPI('org_2xwHiNrj68eaRUlX10anlXGvzX7');

// Sync operations
await api.triggerSync();
const status = await api.getSyncStatus();
const summary = await api.getDatabaseSummary();

// Future: Active patients
const patients = await api.getActivePatients();
const dashboard = await api.getSyncDashboard();
```

### React Hooks
```typescript
// hooks/useActivePatientsSync.ts
const { syncStatus, triggerSync, isSyncing } = useActivePatientsSync(orgId);

// hooks/useDatabaseSummary.ts  
const { data: summary, isLoading } = useDatabaseSummary();
```

## 📊 Current Implementation Status

### ✅ Phase 1 (Immediate)
- [x] Project setup from frontend-v0 base
- [x] API client for working endpoints
- [x] Sync trigger and status monitoring
- [x] Database summary dashboard
- [x] Real-time sync progress

### 🔄 Phase 2 (Next - When Backend Environment Fixed)
- [ ] Active patients list component
- [ ] Patient search and filtering
- [ ] Detailed sync dashboard
- [ ] Appointment history display
- [ ] Contact management interface

### 🚀 Phase 3 (Future)
- [ ] Clerk authentication integration
- [ ] Multi-organization switching
- [ ] Chatwoot messaging integration
- [ ] WhatsApp/Instagram channels
- [ ] Advanced analytics and reporting

## 🎯 Development Priorities

1. **Get sync working in UI** (use existing working endpoints)
2. **Build dashboard with real data** (database summary)
3. **Add real-time status monitoring** (sync progress)
4. **Prepare for active patients integration** (when backend environment ready)

## 📚 Documentation

- **Backend API Guide:** `../docs/FRONTEND_DEVELOPER_GUIDE.md`
- **API Endpoints Reference:** `../CLINIKO_API_ENDPOINTS.md`
- **Backend Implementation:** `../CLINIKO_ACTIVE_PATIENTS_TASKS.md`

## 🎉 SaaS Key Features

**Smart Patient Management SaaS with:**
- ✅ Priority-based patient classification
- ✅ Real-time search and filtering
- ✅ Direct patient communications
- ✅ Churn risk identification
- ✅ Modern, responsive interface
- ✅ Appointment tracking and analytics

**Transform your practice with intelligent patient management!** 🚀

---

Routiq Frontend - Your smart patient management SaaS solution. 