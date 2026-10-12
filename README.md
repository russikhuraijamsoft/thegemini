# TalkOS - Enterprise Restaurant Management Platform

TalkOS is a world-class, enterprise-grade restaurant management system. This repository contains the core Web POS and Back-Office ERP modules built with React, Vite, Tailwind CSS, and Zustand.

## Features

- **Point of Sale (POS):** Fast, reliable, and touch-friendly ordering system.
- **Kitchen Display System (KDS):** Real-time order routing and prep timers.
- **Inventory & Purchasing:** Real-time stock tracking, automated reordering, and recipe management.
- **CRM & Loyalty:** Customer segmentation, points tracking, and engagement metrics.
- **Finance & Accounting:** P&L, GST taxation, and operational expense tracking.
- **HR & Payroll:** Attendance tracking, wage calculations, and staff performance.
- **AI Business Intelligence:** Forecasting, smart alerts, and interactive AI ownership assistant.
- **Administration & Configuration:** Branch management, RBAC, and system-wide settings.

## Architecture

- **Frontend Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + Lucide Icons
- **State Management:** Zustand
- **Backend/Database:** Firebase (Auth, Firestore, Hosting) - *Production Configuration Ready*

## Local Development

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Run TypeScript Linter
npm run lint

# Build for Production
npm run build
```

## Production Readiness
This application has undergone a full code quality and architecture audit. It complies with clean architecture principles, avoids circular dependencies, and utilizes proper React functional programming paradigms.

- **Localization:** Configured for India (INR, GST, 24-Hour Time, DD/MM/YYYY).
- **Security:** Granular Firestore Rules and Firebase Auth integration setup.
- **Deployment:** CI/CD via GitHub Actions (`.github/workflows/production-release.yml`) and Firebase Hosting (`firebase.json`).

Please refer to `TALKOS_DEPLOYMENT_GUIDE.md` and `PRODUCTION_READINESS_REPORT.md` for full release notes and procedures.
