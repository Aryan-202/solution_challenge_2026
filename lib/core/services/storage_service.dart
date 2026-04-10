import 'package:firebase_storage/firebase_storage.dart';
import 'dart:typed_data';

class StorageService {
  final FirebaseStorage _storage = FirebaseStorage.instance;

  Future<String> uploadVideo(String filename, Uint8List bytes) async {
    final ref = _storage.ref().child('assets/$filename');
    await ref.putData(bytes);
    return await ref.getDownloadURL();
  }
}
