import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../features/auth/presentation/providers/auth_provider.dart';

class DashboardLayout extends ConsumerWidget {
  final Widget child;

  const DashboardLayout({super.key, required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('SportShield', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              ref.read(authProvider.notifier).signOut();
              context.go('/login');
            },
            tooltip: 'Logout',
          )
        ],
      ),
      body: Row(
        children: [
          NavigationRail(
            selectedIndex: _calculateSelectedIndex(context),
            onDestinationSelected: (int index) {
              _onItemTapped(index, context);
            },
            labelType: NavigationRailLabelType.all,
            destinations: const [
              NavigationRailDestination(
                icon: Icon(Icons.dashboard),
                label: Text('Dashboard'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.upload_file),
                label: Text('Upload'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.video_library),
                label: Text('Assets'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.warning),
                label: Text('Violations'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.map),
                label: Text('Map'),
              ),
            ],
          ),
          const VerticalDivider(thickness: 1, width: 1),
          // Expanded ensures the main content takes up remaining width.
          Expanded(child: child),
        ],
      ),
    );
  }

  int _calculateSelectedIndex(BuildContext context) {
    final String location = GoRouterState.of(context).uri.path;
    if (location.startsWith('/dashboard')) return 0;
    if (location.startsWith('/upload')) return 1;
    if (location.startsWith('/assets')) return 2;
    if (location.startsWith('/violations')) return 3;
    if (location.startsWith('/map')) return 4;
    return 0;
  }

  void _onItemTapped(int index, BuildContext context) {
    switch (index) {
      case 0:
        context.go('/dashboard');
        break;
      case 1:
        context.go('/upload');
        break;
      case 2:
        context.go('/assets');
        break;
      case 3:
        context.go('/violations');
        break;
      case 4:
        context.go('/map');
        break;
    }
  }
}
