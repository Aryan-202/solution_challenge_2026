import { create } from 'zustand';
import { Asset, Violation } from '@/lib/types';

interface AppState {
  user: { uid: string; displayName: string; email: string } | null;
  assets: Asset[];
  violations: Violation[];
  setUser: (user: AppState['user']) => void;
  addAsset: (asset: Asset) => void;
  updateAssetStatus: (id: string, status: Asset['status']) => void;
  resolveViolation: (id: string) => void;
  ignoreViolation: (id: string) => void;
}

// Seed data based on SRS
const initialAssets: Asset[] = [
  {
    id: 'asset_1',
    orgId: 'mock_org',
    name: 'champions_league_final_highlights.mp4',
    mediaType: 'video',
    status: 'violation',
    fingerprintHash: 'a1b2c3d4e5f60718',
    fingerprintFrames: [],
    storageUrl: '',
    storagePath: '',
    uploadedAt: new Date().toISOString(),
    fileSize: 1024 * 1024 * 50,
  },
  {
    id: 'asset_2',
    orgId: 'mock_org',
    name: 'player_transfer_announcement.jpg',
    mediaType: 'image',
    status: 'violation',
    fingerprintHash: 'f0e1d2c3b4a59687',
    fingerprintFrames: [],
    storageUrl: '',
    storagePath: '',
    uploadedAt: new Date().toISOString(),
    fileSize: 1024 * 1024 * 2,
  },
  {
    id: 'asset_3',
    orgId: 'mock_org',
    name: 'halftime_show_recap.mp4',
    mediaType: 'video',
    status: 'protected',
    fingerprintHash: '0123456789abcdef',
    fingerprintFrames: [],
    storageUrl: '',
    storagePath: '',
    uploadedAt: new Date().toISOString(),
    fileSize: 1024 * 1024 * 25,
  },
  {
    id: 'asset_4',
    orgId: 'mock_org',
    name: 'trophy_ceremony.jpg',
    mediaType: 'image',
    status: 'scanning',
    fingerprintHash: 'fedcba9876543210',
    fingerprintFrames: [],
    storageUrl: '',
    storagePath: '',
    uploadedAt: new Date().toISOString(),
    fileSize: 1024 * 1024 * 3,
  },
  {
    id: 'asset_5',
    orgId: 'mock_org',
    name: 'match_day_promo.jpg',
    mediaType: 'image',
    status: 'protected',
    fingerprintHash: '1a2b3c4d5e6f7089',
    fingerprintFrames: [],
    storageUrl: '',
    storagePath: '',
    uploadedAt: new Date().toISOString(),
    fileSize: 1024 * 1024 * 4,
  },
];

const initialViolations: Violation[] = [
  {
    id: 'viol_1',
    assetId: 'asset_1',
    orgId: 'mock_org',
    matchedUrl: 'https://twitter.com/random/status/123456',
    platform: 'Twitter',
    similarityScore: 95,
    detectedAt: new Date().toISOString(),
    status: 'open',
    geoLocation: { lat: 40.7128, lng: -74.0060, country: 'USA', city: 'New York' },
  },
  {
    id: 'viol_2',
    assetId: 'asset_2',
    orgId: 'mock_org',
    matchedUrl: 'https://youtube.com/watch?v=mock',
    platform: 'YouTube',
    similarityScore: 88,
    detectedAt: new Date().toISOString(),
    status: 'open',
    geoLocation: { lat: 19.0760, lng: 72.8777, country: 'India', city: 'Mumbai' },
  },
  {
    id: 'viol_3',
    assetId: 'asset_1',
    orgId: 'mock_org',
    matchedUrl: 'https://reddit.com/r/soccer/comments/mock',
    platform: 'Reddit',
    similarityScore: 72,
    detectedAt: new Date().toISOString(),
    status: 'open',
    geoLocation: { lat: -23.5505, lng: -46.6333, country: 'Brazil', city: 'Sao Paulo' },
  },
  {
    id: 'viol_4',
    assetId: 'asset_2',
    orgId: 'mock_org',
    matchedUrl: 'https://t.me/random',
    platform: 'Telegram',
    similarityScore: 65,
    detectedAt: new Date().toISOString(),
    status: 'resolved',
    geoLocation: { lat: 52.5200, lng: 13.4050, country: 'Germany', city: 'Berlin' },
  },
  {
    id: 'viol_5',
    assetId: 'asset_1',
    orgId: 'mock_org',
    matchedUrl: 'https://unknownwebsite.com/video',
    platform: 'Unknown Website',
    similarityScore: 91,
    detectedAt: new Date().toISOString(),
    status: 'open',
    geoLocation: { lat: 51.5074, lng: -0.1278, country: 'UK', city: 'London' },
  },
  {
    id: 'viol_6',
    assetId: 'asset_2',
    orgId: 'mock_org',
    matchedUrl: 'https://twitter.com/another/status/654321',
    platform: 'Twitter',
    similarityScore: 78,
    detectedAt: new Date().toISOString(),
    status: 'open',
    geoLocation: { lat: -33.8688, lng: 151.2093, country: 'Australia', city: 'Sydney' },
  },
];

export const useAppStore = create<AppState>((set) => ({
  user: null,
  assets: initialAssets,
  violations: initialViolations,
  setUser: (user) => set({ user }),
  addAsset: (asset) => set((state) => ({ assets: [asset, ...state.assets] })),
  updateAssetStatus: (id, status) => set((state) => ({
    assets: state.assets.map((a) => (a.id === id ? { ...a, status } : a)),
  })),
  resolveViolation: (id) => set((state) => ({
    violations: state.violations.map((v) => (v.id === id ? { ...v, status: 'resolved' } : v)),
  })),
  ignoreViolation: (id) => set((state) => ({
    violations: state.violations.map((v) => (v.id === id ? { ...v, status: 'ignored' } : v)),
  })),
}));
