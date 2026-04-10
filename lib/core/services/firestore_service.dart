import 'package:cloud_firestore/cloud_firestore.dart';
import '../../shared/models/asset_model.dart';
import '../../shared/models/violation_model.dart';

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  Future<List<AssetModel>> getAssets() async {
    final snapshot = await _db.collection('assets').get();
    return snapshot.docs.map((doc) => AssetModel.fromMap(doc.data(), doc.id)).toList();
  }

  Future<List<ViolationModel>> getViolations() async {
    final snapshot = await _db.collection('violations').get();
    return snapshot.docs.map((doc) => ViolationModel.fromMap(doc.data(), doc.id)).toList();
  }
}
