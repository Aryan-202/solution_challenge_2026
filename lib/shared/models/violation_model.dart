import 'package:cloud_firestore/cloud_firestore.dart';

class ViolationModel {
  final String id;
  final double similarityScore;
  final String matchedUrl;
  final DateTime timestamp;
  final String status;
  final double latitude;
  final double longitude;

  ViolationModel({
    required this.id,
    required this.similarityScore,
    required this.matchedUrl,
    required this.timestamp,
    required this.status,
    required this.latitude,
    required this.longitude,
  });

  factory ViolationModel.fromMap(Map<String, dynamic> map, String id) {
    DateTime timestamp;
    if (map['timestamp'] is Timestamp) {
      timestamp = (map['timestamp'] as Timestamp).toDate();
    } else {
      timestamp = DateTime.now();
    }

    return ViolationModel(
      id: id,
      similarityScore: (map['similarityScore'] ?? 0.0).toDouble(),
      matchedUrl: map['matchedUrl'] ?? '',
      timestamp: timestamp,
      status: map['status'] ?? 'Violation',
      latitude: (map['latitude'] ?? 0.0).toDouble(),
      longitude: (map['longitude'] ?? 0.0).toDouble(),
    );
  }
}
