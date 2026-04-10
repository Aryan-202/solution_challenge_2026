import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ott_shield/shared/providers/mock_data_provider.dart';
import 'package:intl/intl.dart';

class ViolationsScreen extends ConsumerWidget {
  const ViolationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final violations = ref.watch(mockViolationsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Detected Violations'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              flex: 2,
              child: Card(
                child: ListView.separated(
                  itemCount: violations.length,
                  separatorBuilder: (context, index) => const Divider(height: 1),
                  itemBuilder: (context, index) {
                    final violation = violations[index];
                    return ListTile(
                      leading: const CircleAvatar(
                        backgroundColor: Colors.redAccent,
                        child: Icon(Icons.warning, color: Colors.white),
                      ),
                      title: Text(violation.matchedUrl),
                      subtitle: Text('Similarity: ${violation.similarityScore}% • ${DateFormat('yyyy-MM-dd HH:mm').format(violation.timestamp)}'),
                      trailing: _buildStatusChip(violation.status),
                      onTap: () {
                        // In a real app we change selection state
                      },
                    );
                  },
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              flex: 1,
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const Text('Preview', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 16),
                      Container(
                        height: 200,
                        color: Colors.black87,
                        child: const Center(
                          child: Icon(Icons.play_circle_outline, size: 64, color: Colors.white54),
                        ),
                      ),
                      const SizedBox(height: 16),
                      const Text('Matched content segment', style: TextStyle(color: Colors.grey)),
                    ],
                  ),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildStatusChip(String status) {
    return Chip(
      label: Text(status, style: const TextStyle(fontSize: 12)),
      backgroundColor: Colors.red.withValues(alpha: 0.1),
      labelStyle: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
    );
  }
}
