import 'package:cloud_firestore/cloud_firestore.dart';

class AssetModel {
  final String id;
  final String name;
  final String storageUrl;
  final DateTime uploadedAt;
  final String status;

  AssetModel({
    required this.id,
    required this.name,
    required this.storageUrl,
    required this.uploadedAt,
    required this.status,
  });

  factory AssetModel.fromMap(Map<String, dynamic> map, String id) {
    DateTime uploadedAt;
    if (map['uploadedAt'] is Timestamp) {
      uploadedAt = (map['uploadedAt'] as Timestamp).toDate();
    } else {
      uploadedAt = DateTime.now();
    }

    return AssetModel(
      id: id,
      name: map['name'] ?? '',
      storageUrl: map['storageUrl'] ?? '',
      uploadedAt: uploadedAt,
      status: map['status'] ?? 'processing',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'storageUrl': storageUrl,
      'uploadedAt': uploadedAt,
      'status': status,
    };
  }
}
