import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'app/app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Try initializing Firebase, but if it fails (e.g. no config provided),
  // we catch the error so we can still use mock mode.
  try {
    await Firebase.initializeApp();
  } catch (e) {
    debugPrint('Firebase init failed (expected if missing options): $e');
  }

  runApp(
    const ProviderScope(
      child: SportShieldApp(),
    ),
  );
}
