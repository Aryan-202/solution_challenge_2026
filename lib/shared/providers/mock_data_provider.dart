import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/asset_model.dart';
import '../models/violation_model.dart';

final mockDataEnabledProvider = NotifierProvider<MockDataEnabledNotifier, bool>(MockDataEnabledNotifier.new);

class MockDataEnabledNotifier extends Notifier<bool> {
  @override
  bool build() => true;
  void toggle() => state = !state;
}

final mockAssetsProvider = Provider<List<AssetModel>>((ref) {
  return [
    AssetModel(
      id: '1',
      name: 'EPL_Match_Highlights.mp4',
      storageUrl: 'https://example.com/video1.mp4',
      uploadedAt: DateTime.now().subtract(const Duration(hours: 1)),
      status: 'Protected',
    ),
    AssetModel(
      id: '2',
      name: 'UCL_Final_Stream.mp4',
      storageUrl: 'https://example.com/video2.mp4',
      uploadedAt: DateTime.now().subtract(const Duration(minutes: 30)),
      status: 'Violation',
    ),
    AssetModel(
      id: '3',
      name: 'NBA_Finals_Q3.mp4',
      storageUrl: 'https://example.com/video3.mp4',
      uploadedAt: DateTime.now().subtract(const Duration(minutes: 5)),
      status: 'Scanning',
    ),
  ];
});

final mockViolationsProvider = Provider<List<ViolationModel>>((ref) {
  return [
    ViolationModel(
      id: 'v1',
      similarityScore: 98.5,
      matchedUrl: 'https://piratesite1.com/stream/epl',
      timestamp: DateTime.now().subtract(const Duration(hours: 2)),
      status: 'Takedown Issued',
      latitude: 51.5074,
      longitude: -0.1278,
    ),
    ViolationModel(
      id: 'v2',
      similarityScore: 92.0,
      matchedUrl: 'https://freestreams.xyz/nba',
      timestamp: DateTime.now().subtract(const Duration(hours: 5)),
      status: 'Detected',
      latitude: 40.7128,
      longitude: -74.0060,
    ),
    ViolationModel(
      id: 'v3',
      similarityScore: 88.3,
      matchedUrl: 'https://illegal-sports.net/ucl',
      timestamp: DateTime.now().subtract(const Duration(days: 1)),
      status: 'Resolved',
      latitude: 35.6895,
      longitude: 139.6917,
    ),
  ];
});
