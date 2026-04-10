
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ott_shield/app/app.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(
      const ProviderScope(
        child: SportShieldApp(),
      ),
    );

    // Initial dummy test since go_router and UI will build login screen
    expect(find.text('SportShield'), findsWidgets);
  });
}
