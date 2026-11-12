import 'package:flutter/material.dart';
import '../features/shell/presentation/talkos_shell.dart';

class TalkOsApp extends StatelessWidget {
  const TalkOsApp({super.key});

  @override
  Widget build(BuildContext context) {
    const brand = Color(0xFF800000);
    return MaterialApp(
      title: 'TalkOS',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: brand, primary: brand),
        scaffoldBackgroundColor: const Color(0xFFFFFCFC),
      ),
      home: const TalkOsShell(),
    );
  }
}
