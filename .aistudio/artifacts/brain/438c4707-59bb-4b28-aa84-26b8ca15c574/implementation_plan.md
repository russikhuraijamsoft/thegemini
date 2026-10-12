# Cross-Platform Architecture & Peripheral Integration Plan

Unified, multi-target architecture for **Talk of the Town POS** that operates as an installable desktop application (Windows `.exe`, Linux, macOS), native mobile application (Android Google Play, iOS App Store), and offline-resilient PWA—all running against a single authoritative ERP core and Firestore database.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Summary of Confirmed Architectural Decisions (Phase 1):**
> 1. **Packaging Approach**: **Unified Web & PWA with Electron and Capacitor configurations**. The core business logic, Zustand stores, and React UI remain 100% shared across all platforms. Desktop binaries for Windows (`.exe`/MSI), Linux (`.AppImage`/`.deb`), and macOS (`.dmg`) are packaged via Electron; mobile native apps for Android and iOS are packaged via Capacitor.
> 2. **Hardware & Peripherals**: **ESC/POS thermal printers (USB/Network/Bluetooth), electronic cash drawers (kick pulse), and hardware/camera barcode scanners** will be integrated through a unified hardware abstraction layer.
> 3. **Responsive Ergonomics**: **Adaptive UI** featuring a high-density, multi-panel workstation layout on desktop with keyboard shortcuts (`F2`, `F4`, `F9`, `F10`), paired with a thumb-zone-optimized mobile layout with compact bottom navigation and bottom-sheet cart drawers.

---

### 1. Overview & Core Concept

- **What It Does**: Transforms the Talk of the Town POS and restaurant ERP into a true cross-platform operating suite. Cashiers on Windows desktop touchscreens, waiters on Android/iOS mobile devices, and managers in web browsers interact with the exact same catalog, live tables, kitchen display tickets (KDS), and inventory stock without fragmented codebases.
- **Target Audience & Devices**:
  - **Counter Cashiers (Windows / Linux / macOS)**: High-speed barcode scanning, physical cash drawer release, 80mm/58mm ESC/POS thermal slip printing, and keyboard hotkeys.
  - **Floor Waiters (Android / iOS Handhelds)**: Touch-first table order entry, camera-based barcode scanning, real-time table status updates, and mobile bill generation.
  - **Kitchen Staff (Large Wall Displays / Tablets)**: Real-time Kitchen Display System (KDS) routing with instant audio/visual ticket alerts.
  - **Restaurant Owners (Any Browser / Desktop)**: Real-time revenue analytics, daily register reconciliation, inventory tracking, and recipe costing.
- **Key Value**: A single source of truth for restaurant operations that eliminates platform silos, prevents duplicate inventory deductions, and ensures consistent POS billing.

---

### 2. User Experience & Visual Design

#### A. Adaptive Layout Strategy
- **Desktop Viewport ($\ge 1024\text{px}$)**:
  - **Multi-Panel Workstation**: Three-column layout—Left navigation sidebar, center catalog grid with category filters and combo cards, right persistent order sidebar with live subtotal/tax/discount calculations.
  - **Information Density**: Compact data grids (36px–44px row heights), tabular figures (`tabular-nums`), quick cash tender pads, and instant keyboard shortcuts.
  - **Keyboard Hotkeys**:
    - `F2`: Start New Sale / Focus Catalog Search
    - `F4`: Hold / Park Active Order
    - `F8`: Open Bills & Orders History
    - `F9`: Open Settle & Pay Modal
    - `F10`: Pulse Open Cash Drawer
    - `Esc`: Dismiss Active Modal / Clear Selection
- **Mobile Handheld Viewport ($375\text{px}$–$768\text{px}$)**:
  - **Thumb-Zone Optimization**: Primary navigation located in a fixed bottom tab bar (Catalog, Tables, KDS, Orders, More) within natural thumb reach.
  - **Sticky Bottom Action Bar**: Prominent cart bar showing item count and total with a slide-up bottom sheet for checkout.
  - **Touch Hitboxes**: Strict minimum $44 \times 44\text{px}$ hitboxes for all interactive buttons, modifier chips, and quantity steppers to prevent mis-taps during rush hours.
  - **Camera Barcode Scanner**: Built-in floating barcode scan trigger activating the device camera to identify packaged goods or customer loyalty cards.

#### B. Visual Identity & Brand Discipline
- **Color Palette (60-30-10 Rule)**:
  - **Canvas (60%)**: Pure white (`#FFFFFF`) with ultra-subtle warm tint (`#FDF5F6`) for background areas.
  - **Structure (30%)**: Refined hairline border lines (`#EBD5DA`), subdued surfaces, and clear typography.
  - **Accent (10%)**: Solid, authoritative crimson/maroon (`#800000`) for primary brand marks, active order states, and key settlement CTAs. Zero gratuitous purple gradients or floating neon capsules.
- **Typography**: Clean, contemporary sans pairing using `Plus Jakarta Sans` for headers and buttons, paired with monospace tabular figures (`font-mono tabular-nums`) for currency amounts, quantities, and order timestamps.
- **Anti-Slop Discipline**: No decorative pulsing dots on static text, no artificial scoreboards, no static pill chips on metadata (using clean unboxed text with `·` separators), and zero dead-click affordances.

---

### 3. Key Product Decisions & Trade-Offs

#### Decision 1: Shared Core with Electron & Capacitor Wrapper Strategy
- **Chosen Approach**: Maintain a single React + TypeScript codebase in `/src`. Configure Electron (`electron/main.ts`, `electron/preload.ts`) for desktop builds (Windows `.exe`, Linux, macOS) and Capacitor (`capacitor.config.ts`) for mobile builds (Android APK/AAB, iOS).
- **Why**: Eliminates 100% of business logic duplication. Menu models, combo logic, recipe cost deductions, tax computations (CGST/SGST), and Firestore real-time sync remain unified.
- **Trade-Off**: Native platform capabilities (e.g. raw hardware ports or native push notifications) must be interfaced through clean abstraction bridges (Web APIs with Capacitor/Electron fallbacks), which requires a unified hardware service.

#### Decision 2: Hardware Abstraction Layer (`hardwareService`)
- **Chosen Approach**: A unified service that dynamically detects the runtime environment:
  - **Thermal Printing**: Uses WebUSB / Web Serial / Network ESC/POS when available in browser or Electron, with automatic fallback to standard CSS thermal `@media print` formatted for 80mm/58mm slips.
  - **Cash Drawer**: Sends ESC/POS pulse command (`\x1B\x70\x00\x19\xFA`) to thermal receipt printer or serial drawer.
  - **Barcode Scanning**: Listens for rapid hardware HID keyboard wedge inputs ($\le 50\text{ms}$ keystroke bursts) on desktop/tablet, and launches Capacitor Barcode Scanner or HTML5 BarcodeDetector API on mobile phones.
- **Why**: Allows the same POS application to operate flawlessly in a browser preview, a dedicated Windows touchscreen terminal with a USB thermal printer, and an Android handheld device.

#### Decision 3: Offline-Resilient Local Storage & Firestore Sync
- **Chosen Approach**: Local-first queue via `localforage` / IndexedDB for offline transactions, coupled with Firebase Firestore enterprise synchronization when online.
- **Why**: Restaurants cannot stop billing during network blips or ISP drops. Orders placed offline are assigned temporary sequential offline IDs and automatically flushed to Firestore upon reconnecting.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                      TALK OF THE TOWN POS CLIENT                       │
│                                                                        │
│   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐     │
│   │ Desktop (Win/Mac)│  │ Mobile (iOS/And) │  │   Web / PWA      │     │
│   │  Electron Layer  │  │ Capacitor Layer  │  │  Service Worker  │     │
│   └─────────┬────────┘  └────────┬─────────┘  └────────┬─────────┘     │
│             └────────────────────┼─────────────────────┘               │
│                                  ▼                                     │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    SHARED APPLICATION LAYER                      │  │
│  │                                                                  │  │
│  │  Adaptive UI Shell (Desktop Sidebar + Mobile Bottom Navigation)  │  │
│  │  ├── POS Workstation (Multi-size, Combos, Billing Settlement)    │  │
│  │  ├── KDS Ticket Screen (Kitchen Order Tickets, Expeditor)        │  │
│  │  ├── Table Management (Floors, Table Statuses, Seating)          │  │
│  │  └── Day Register & Cash Drawer Management (Shift Reports)       │  │
│  └───────────────────────────────┬──────────────────────────────────┘  │
│                                  ▼                                     │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    HARDWARE ABSTRACTION LAYER                    │  │
│  │                                                                  │  │
│  │  ├── ESC/POS Thermal Printer (80mm/58mm WebUSB, Serial, Print)   │  │
│  │  ├── Electronic Cash Drawer (Printer Pulse Kick)                 │  │
│  │  ├── Barcode Scanner Driver (HID Keyboard Wedge + Camera OCR)    │  │
│  │  └── Keyboard Shortcut Manager (Global F-Keys & Keybinds)        │  │
│  └───────────────────────────────┬──────────────────────────────────┘  │
│                                  ▼                                     │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      UNIFIED BUSINESS LOGIC                      │  │
│  │                                                                  │  │
│  │  ├── posStore (Cart, Multi-Size, Combo Choice, Discounts, Holds) │  │
│  │  ├── tableStore (Table Statuses, Reservations, Seated State)     │  │
│  │  ├── kdsStore (Ticket Queues, Station Routing, Timers)           │  │
│  │  └── inventoryService (Recipe Deduction & Stock Tracking)        │  │
│  └───────────────────────────────┬──────────────────────────────────┘  │
└──────────────────────────────────┼─────────────────────────────────────┘
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   CLOUD FIRESTORE & ERP BACKEND                        │
│                                                                        │
│   /pos_products        /menu_item_sizes       /pos_orders              │
│   /tickets (KDS)       /table_items           /inventory               │
└────────────────────────────────────────────────────────────────────────┘
```

#### A. Component & Layout Mapping
1. **`AppShell` & Navigation**:
   - Detects screen breakpoint (`useMediaQuery` hook) and runtime platform.
   - On desktop ($\ge 1024\text{px}$): Displays collapsible navigation sidebar with active branch badge, quick-action indicators, and keyboard shortcut legends.
   - On mobile ($< 1024\text{px}$): Displays compact top app bar and thumb-friendly fixed bottom navigation bar with active route highlighting.
2. **`HardwareManager` Service**:
   - `printReceipt(order, type: 'receipt' | 'kot')`: Sends raw ESC/POS commands or triggers thermal print stylesheet.
   - `kickCashDrawer()`: Sends drawer kick pulse through printer or serial interface.
   - `onBarcodeScanned(callback)`: Hooks keyboard input buffer to catch high-speed USB scanners.
3. **`BarcodeScannerModal`**:
   - Integrated camera-based scanner modal for mobile devices using HTML5 canvas / BarcodeDetector API for instant SKU/item scanning.
4. **PWA & Packaging Manifests**:
   - `vite-plugin-pwa` configuration with full Web App Manifest (standalone display, 192px/512px icons, offline service worker precaching).
   - Capacitor configuration (`capacitor.config.ts`) with app ID `com.talkofthetown.pos`.
   - Electron main entry script (`electron/main.ts`) configuring cross-platform desktop windows, secure preload script, hardware serial access, and single-instance locks.
   - Package build scripts in `package.json` for building Windows executable (`npm run build:win`), Linux AppImage (`npm run build:linux`), and mobile sync (`npm run cap:sync`).

---

### Verification & Testing Plan

1. **Compilation & Syntax**: Validate that TypeScript compiles without errors (`npm run lint` / `tsc --noEmit`) and Vite builds cleanly (`npm run build`).
2. **Cross-Platform Responsive Verification**:
   - Test desktop breakpoint ($1440\text{px}$): Verify multi-panel layout, catalog grid, persistent cart, and keyboard shortcuts (`F2`, `F4`, `F9`, `F10`).
   - Test mobile breakpoint ($390\text{px}$): Verify bottom navigation bar, touch hitboxes ($\ge 44\text{px}$), slide-up cart drawer, and camera barcode scanner modal.
3. **Hardware Simulation Testing**:
   - Test thermal print trigger for both 80mm Customer Receipts and Kitchen Order Tickets (KOT).
   - Test cash drawer kick trigger in POS checkout and Day Register views.
   - Test barcode scanner detection with simulated rapid keystrokes.
4. **Automated Unit Tests**:
   - Run Vitest suite (`npm run test`) to verify all POS store logic, size pricing, combo bundle deductions, and order settlement calculations continue to pass 100%.
