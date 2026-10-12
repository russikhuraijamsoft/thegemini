# TalkOS Master Specification

## 1. Executive Summary
TalkOS is an enterprise-grade Restaurant Operating System designed to rival Oracle Simphony, Toast POS, and NCR Aloha. It provides a unified, highly scalable, and offline-resilient platform for managing end-to-end restaurant operations across single locations, multi-branch networks, and franchise models.

## 2. Product Vision
To be the definitive, single-source-of-truth operating system for the global restaurant industry, delivering uncompromised speed, absolute data integrity, and total operational control from the POS terminal to the corporate ledger.

## 3. Business Objectives
- Eliminate disparate legacy systems by unifying POS, KDS, Inventory, CRM, HR, and Finance.
- Ensure 100% operational uptime via robust offline-first architecture.
- Empower data-driven decision-making with real-time enterprise analytics.
- Provide a highly scalable, multi-tenant SaaS architecture for franchises.

## 4. Functional Scope
- **Point of Sale (POS):** Multi-channel order management, billing, and payments.
- **Kitchen Display System (KDS):** Advanced routing, queue management, and timing.
- **Inventory & Warehouse:** Perpetual inventory, recipe management, and stock control.
- **Purchasing:** Supplier management, POs, and 3-way matching.
- **CRM & Loyalty:** Omnichannel customer profiles, loyalty tiers, and targeted marketing.
- **Finance & Accounting:** Double-entry General Ledger, AP/AR, and budgeting.
- **HR & Payroll:** Attendance, leave management, performance, and automated payroll.

## 5. Non-Functional Requirements
- **Performance:** 1-second billing workflows; sub-50ms search.
- **Availability:** 99.99% uptime with seamless offline fallback.
- **Security:** Zero-trust RBAC, end-to-end encryption, and immutable audit logs.
- **Scalability:** Support for 100,000+ SKUs and thousands of daily transactions per branch.

## 6. Technology Stack
- **Frontend / Client:** Flutter (Stable) for Android, iOS, Windows, macOS, Linux, and Web.
- **Backend / BaaS:** Firebase (Cloud Firestore, Firebase Auth, Cloud Storage, Cloud Functions, Firebase Messaging).
- **Data Warehouse / Analytics:** Google BigQuery.

## 7. System Architecture
TalkOS utilizes a Clean Architecture approach on the client side, decoupled from the serverless backend. The system operates on an event-driven, append-only ledger model ensuring state consistency across distributed nodes.

## 8. Module Architecture
- **Core Engine:** Shared services (Network, Local DB, Authentication, RBAC).
- **Feature Modules:** Isolated domains (POS, KDS, Inventory, Finance, CRM, HR) communicating via strict interfaces and a central event bus.

## 9. Flutter Architecture
- **State Management:** Riverpod (with Riverpod Generator) for compile-time safety and seamless Dependency Injection.
- **Navigation:** GoRouter with declarative, role-based route guards and deep linking.
- **Architecture Pattern:** Clean Architecture (Presentation, Domain, Data layers).

## 10. Firebase Architecture
- **Authentication:** Firebase Auth (Email, Phone OTP, OAuth) integrated with Custom Claims for RBAC.
- **Database:** Cloud Firestore for real-time state sync and hierarchical document storage.
- **Serverless:** Cloud Functions for secure transaction processing (e.g., payment capture, payroll processing) and third-party integrations.

## 11. Firestore Data Architecture
- **Multi-Tenancy:** Logical isolation via `organizationId` and `branchId` embedded in all documents.
- **Data Modeling:** Denormalized read-optimized collections for POS; highly normalized transactional sub-collections for ledgers.
- **Immutability:** Financial and inventory transactions use an append-only event sourcing pattern.

## 12. Security Architecture
- **Firestore Rules:** Deny-by-default. Access granted strictly via JWT Custom Claims evaluating identity, context, and capability.
- **App Check:** Google Play Integrity & Apple DeviceCheck block unauthorized emulator or API access.
- **Data Protection:** AES-256 at rest; TLS 1.3 in transit.

## 13. Authentication
- **Methods:** Phone OTP (Primary for customers/staff), Email/Password (Corporate), Biometric/PIN (Manager overrides and fast-switch POS).
- **Session Management:** Short-lived JWTs (1 hr) with automated secure refresh. Idle timeouts lock POS screens after 60s.

## 14. RBAC & Permission Matrix
- **Roles:** Super Admin, Company Owner, General Manager, Branch Manager, Cashier, Chef, Inventory Manager, HR Manager, Accountant, Auditor.
- **Granular Control:** Atomic permission strings (e.g., `pos.order.void`, `inv.po.approve`).
- **Overrides:** Manager PIN/Biometric required for high-risk actions (Refunds, Discounts > 10%).

## 15. Workflow Engine
- **State Machines:** All business processes (Orders, POs, Leaves) are governed by strict state transitions.
- **Approvals:** Maker-checker enforcement. High-value transactions enter a `PENDING_APPROVAL` state routed to the appropriate authority.

## 16. POS Architecture
- **Omnichannel:** Dine-In, Takeaway, Delivery unified in one interface.
- **Table Management:** Visual floor plans, split/merge bills, and seat-wise billing.
- **Menu Engine:** Complex hierarchies, dynamic pricing, and infinite modifiers.
- **Payments:** Integrated payment gateways, mixed tender, and offline cash handling.

## 17. Kitchen Display System
- **Routing:** Rule-based routing to specific prep stations (Grill, Bar, Assembly).
- **Staggered Firing:** Course-based timers ensure synchronized plating.
- **Hardware:** Support for touch screens and physical bump bars.

## 18. Inventory
- **Perpetual Ledger:** Real-time tracking of raw materials, semi-finished goods, and assets.
- **Recipe Integration:** Sub-recipe explosion and yield management automatically deduct stock upon POS sale.
- **Warehousing:** Multi-echelon storage (Central Warehouse -> Branch -> Kitchen Line).

## 19. Purchasing
- **Procure-to-Pay (P2P):** PR -> PO -> GRN -> Invoice.
- **3-Way Matching:** Automated reconciliation of PO, GRN, and Supplier Invoice before AP authorization.
- **Supplier Master:** Contract pricing, compliance tracking, and vendor performance KPIs.

## 20. CRM & Loyalty
- **Customer 360:** Unified profile tracking preferences, allergies, and visit history.
- **Loyalty Engine:** Point accrual, tier management, and automated lifecycle rewards (Birthdays, Reactivations).
- **Marketing:** Segmented SMS/Email campaigns triggered by behavioral rules.

## 21. Finance
- **General Ledger:** Double-entry accounting automating POS and Inventory journals.
- **AR/AP:** House accounts, supplier payments, and aging analysis.
- **Taxation:** Granular tax mapping (GST/VAT) and automated compliance reporting.
- **Dashboard:** Real-time visibility into Prime Costs (Food Cost % + Labor Cost %), P&L, and Cash Flow.

## 22. HR & Payroll
- **Workforce Management:** Biometric/PIN attendance, shift rosters, and leave approvals.
- **Payroll Engine:** Automated calculation of basic, overtime, incentives, and statutory deductions.
- **ESS Portal:** Employee Self-Service app for payslips, leave requests, and schedule viewing.

## 23. Notification System
- **Omnichannel Routing:** Push (FCM), SMS (Twilio), Email (SendGrid), and In-App toasts.
- **Escalation Matrix:** Unacknowledged critical alerts (e.g., Freezer temp failure) automatically escalate up the management chain.

## 24. Reporting
- **Standardization:** Exportable to PDF/CSV/Excel. Enforced timezone anchoring to the branch's local time.
- **Key Reports:** Z-Reports, Stock Ledgers, Tax Returns, Campaign ROI, and Labor Cost Variance.

## 25. Analytics
- **Data Warehouse:** All operational data streams to BigQuery.
- **KPIs:** Revenue, Gross Margin, Table Turnover, Customer Lifetime Value (CLV), and Supplier OTD (On-Time Delivery).

## 26. Offline Strategy
- **Local Database:** Isar (or Drift) caches the master catalog, staff PINs, and recent customers.
- **Offline Operations:** POS billing, Cash payments, LAN-based KDS routing, and Warehouse counting function with zero internet.

## 27. Synchronization Strategy
- **Sync Queue:** Offline mutations are serialized to a local queue.
- **Background Isolate:** A Dart isolate continuously monitors connectivity, draining the queue sequentially upon restoration.
- **Conflict Resolution:** Append-only ledgers eliminate conflicts; master data uses Last-Write-Wins based on Firestore timestamps.

## 28. Performance Standards
- **UI:** Strict 60/120fps requirement. Virtualized lists (lazy loading) for menus and historical logs.
- **Memory:** Aggressive widget const usage and image caching to prevent OOM errors on low-end POS hardware.

## 29. Scalability Strategy
- **Client:** Package-by-feature architecture allows infinite modular expansion without merge conflicts.
- **Backend:** Firestore auto-scales. Heavy read/analytical workloads are offloaded to BigQuery.

## 30. Deployment Architecture
- **CI/CD:** Automated pipelines (e.g., GitHub Actions / Codemagic) building and deploying Android/iOS/Windows/Web binaries and Firebase Rules.
- **Environments:** Development, Staging, and Production logical separation.

## 31. Disaster Recovery
- **Backups:** Firestore Point-in-Time Recovery (PITR) and daily automated multi-region Cloud Storage exports.
- **Hardware Failure:** Instant state restoration upon logging into a replacement POS device.

## 32. Coding Standards
- **Language:** Dart (Strict null safety).
- **State:** Riverpod strictly enforced.
- **Immutability:** Freezed for all models and state classes.
- **Linting:** Very strict lint rules (e.g., `flutter_lints`, `custom_lint`).

## 33. Folder Structure
```text
lib/
├── core/          # Network, Error, Local DB, Base UseCases
├── config/        # Environment and App Configs
├── theme/         # Design Tokens and Theme Engine
├── l10n/          # Localization ARB files
├── router/        # GoRouter configuration
├── shared/        # Reusable Widgets and Utils
└── features/      # Isolated Modules (pos, kds, inventory, finance, etc.)
```

## 34. Naming Conventions
- **Files/Directories:** `snake_case`
- **Classes/Enums:** `PascalCase`
- **Variables/Methods:** `camelCase`
- **Constants:** `SCREAMING_SNAKE_CASE` (or `camelCase` if scoped within a class).

## 35. UI Design Standards
- **Language:** Material Design 3 (Customized for Enterprise).
- **Philosophy:** Minimal cognitive load, high contrast, action-oriented.
- **Components:** Unified library of Buttons, Inputs, Data Tables, and Dialogs avoiding hardcoded styles.

## 36. Theme System
- **Engine:** JSON-driven Theme Engine supporting Light, Dark, and AMOLED modes.
- **Branding:** Remote Config injection of Franchise brand colors and typography.
- **Tokens:** Semantic naming (e.g., `color-primary-base`, `spacing-md`) instead of raw hex codes.

## 37. Responsive Design Rules
- **Fluid Layouts:** Breakpoint-driven adaptations (Mobile < 600dp, Tablet 600-1024dp, Desktop > 1024dp).
- **Navigation Adaptation:** Bottom Nav (Mobile) -> Navigation Rail (Tablet/POS) -> Drawer (Desktop).

## 38. Accessibility Standards
- **Contrast:** Minimum 4.5:1 ratio (WCAG AA).
- **Touch Targets:** Minimum 44x44dp (ideally 48x48dp for fast-paced POS).
- **Screen Readers:** Comprehensive Semantic tagging for all non-text UI elements.

## 39. Testing Strategy
- **Unit Tests:** Minimum 80% coverage for Domain and Data layers.
- **Widget Tests:** Isolated testing of complex interactive components.
- **Golden Tests:** Visual regression testing for critical screens (POS Cart, KDS Ticket) across themes and breakpoints.

## 40. Security Checklist
- [ ] Firestore Rules validate all Custom Claims.
- [ ] App Check enforced on all Firebase services.
- [ ] No hardcoded API keys in the client (use Secret Manager + Cloud Functions).
- [ ] PII encrypted at rest in Firestore.
- [ ] All high-risk POS actions (Voids, Refunds) log a manager PIN/Biometric override.

## 41. Future Expansion
- **AI/ML:** Integration of Vertex AI for inventory demand forecasting, kitchen rush prediction, and personalized CRM marketing.
- **IoT Integration:** Smart weighing scales, temperature sensors, and automated beverage dispensers.
- **Voice Commerce:** NLP integration for drive-through order transcription and ESS HR queries.

---
**END OF SPECIFICATION**
*This document serves as the absolute, single source of truth for the TalkOS Enterprise Restaurant Operating System. All engineering, design, and architecture decisions must strictly adhere to the guidelines set forth herein.*
