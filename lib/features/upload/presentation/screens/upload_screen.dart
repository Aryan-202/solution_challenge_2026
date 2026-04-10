import 'package:flutter/material.dart';

class UploadScreen extends StatefulWidget {
  const UploadScreen({super.key});

  @override
  State<UploadScreen> createState() => _UploadScreenState();
}

class _UploadScreenState extends State<UploadScreen> {
  bool _isUploading = false;
  double _progress = 0.0;

  Future<void> _pickAndUpload() async {
    // Simulator for file picking on dummy mode
    await Future.delayed(const Duration(milliseconds: 500));
    
    if (!mounted) return;
    setState(() {
      _isUploading = true;
      _progress = 0.0;
    });

    // Simulate upload process
    for (int i = 1; i <= 10; i++) {
      await Future.delayed(const Duration(milliseconds: 200));
      if (!mounted) return;
      setState(() {
        _progress = i / 10.0;
      });
    }

    if (!mounted) return;
    setState(() {
      _isUploading = false;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('File uploaded successfully!')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Upload Media')),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 500),
          child: InkWell(
            onTap: _isUploading ? null : _pickAndUpload,
            borderRadius: BorderRadius.circular(12),
            child: Container(
              padding: const EdgeInsets.all(48.0),
              decoration: BoxDecoration(
                border: Border.all(color: Colors.blue.withValues(alpha: 0.5), width: 2, style: BorderStyle.solid),
                borderRadius: BorderRadius.circular(12),
                color: Colors.blue.withValues(alpha: 0.05),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.cloud_upload_outlined, size: 80, color: Colors.blue[300]),
                  const SizedBox(height: 16),
                  const Text('Click or Drag & Drop to upload', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  const Text('Supports MP4, MOV, AVI', style: TextStyle(color: Colors.grey)),
                  const SizedBox(height: 24),
                  if (_isUploading) ...[
                    LinearProgressIndicator(value: _progress),
                    const SizedBox(height: 8),
                    Text('${(_progress * 100).toInt()}% uploaded', style: const TextStyle(fontWeight: FontWeight.bold)),
                  ] else ...[
                    ElevatedButton(
                      onPressed: _pickAndUpload,
                      child: const Text('Select File'),
                    ),
                  ]
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
