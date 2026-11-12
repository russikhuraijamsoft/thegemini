# TalkOS — Native Cross-Platform Restaurant Operating System

TalkOS is being developed as a native Flutter application for Android, iOS, Windows and macOS. The product is not being delivered as a browser-only POS, HTML wrapper, Electron web shell, or WebView-based mobile app.

## Native application

The Flutter application lives in [apps/talkos_flutter](apps/talkos_flutter).

- Android: APK and Play Store AAB
- iOS: native iPhone and iPad application
- Windows: native desktop application
- macOS: native desktop application

The platform runners are generated from the Flutter SDK in the target environment. See [native app setup](apps/talkos_flutter/README.md).

## Product modules

- POS and order management
- Kitchen Display System (KDS)
- Tables, QR ordering and kiosk workflows
- Inventory, recipes, purchasing and suppliers
- Finance, cash management and reports
- HR, attendance and payroll
- CRM, loyalty and customer management
- Gemini-powered business intelligence

## Engineering principles

- Offline-capable operations with a durable local queue and controlled synchronization.
- Server-authoritative prices, taxes, payment state, stock movements and permissions.
- Integer minor currency units for financial calculations.
- Branch-aware role-based access control.
- Hardware abstraction for ESC/POS receipt printers, cash drawers and barcode scanners.
- No API secrets or privileged database credentials embedded in client binaries.
- Tests and platform builds are release gates, not claims based on documentation alone.

## Current status

The Flutter workspace is an early development foundation. It includes adaptive native navigation, an initial POS layout, a currency-safe cart domain model and automated tests. The live catalogue, authentication, durable offline storage, synchronization, payment integrations, printer support and the remaining ERP modules are not yet complete.

The existing React/Vite code remains in the repository as legacy implementation/reference during migration. It is not the target runtime for the native application and must not be represented as production-ready.
