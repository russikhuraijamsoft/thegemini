# TalkOS Native Flutter Application

Native cross-platform Flutter application for Android, iOS, Windows, Linux, and macOS. Not a WebView or HTML wrapper.

Platform runner files are generated with `flutter create --platforms=android,ios,windows,macos,linux --project-name talkos --org com.talkofthetown .` from this directory.

Build APK: `flutter build apk --release`.
Build AAB: `flutter build appbundle --release`.
Build Linux: `flutter build linux --release` (Linux + GTK/Clang/CMake required).
Build Windows: `flutter build windows --release` (Windows + Visual Studio C++ workload required).
Build macOS: `flutter build macos --release` (macOS + Xcode required).
Build iOS: `flutter build ios --release` (macOS + Xcode required).

Continuous native multi-platform builds run via `.github/workflows/flutter-native.yml` and publish ready-to-run release bundles for:
- **Android**: `app-release.apk` & `app-release.aab`
- **Windows**: `talkos-windows-x64.zip`
- **Linux**: `talkos-linux-x64.tar.gz`
- **macOS**: `talkos-macos.zip`
- **iOS**: `talkos-ios.zip`

Flutter is the native client. Backend integrations must be behind repositories and server-authoritative APIs. No Gemini API key or privileged backend secret may be embedded in the app.