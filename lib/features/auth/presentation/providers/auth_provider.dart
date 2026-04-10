import 'package:flutter_riverpod/flutter_riverpod.dart';

final authProvider = NotifierProvider<AuthNotifier, bool>(AuthNotifier.new);

class AuthNotifier extends Notifier<bool> {
  @override
  bool build() => false; // Initial internal state false

  Future<void> signInWithGoogle() async {
    // Basic mock authentication login process
    // In a full environment, you would call FirebaseAuth here.

    // todo: implement google sign in
    
    state = true;
  }

  Future<void> signOut() async {
    // Basic mock authentication logout process
    state = false;
  }
}
