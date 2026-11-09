# TalkOS Native Flutter Application

Native Flutter workspace for Android, iOS, Windows and macOS. Not a WebView or HTML wrapper.

Platform runner files are generated with `flutter create --platforms=android,ios,windows,macos --project-name talkos --org com.talkofthetown .` from this directory.

Build APK: `flutter build apk --release`.
Build AAB: `flutter build appbundle --release`.
Build iOS: `flutter build ios --release` (macOS + Xcode required).
Build Windows: `flutter build windows --release` (Windows + Visual Studio C++ workload required).
Build macOS: `flutter build macos --release` (macOS + Xcode required).

Flutter is the native client. Backend integrations must be behind repositories and server-authoritative APIs. No Gemini API key or privileged backend secret may be embedded in the app.