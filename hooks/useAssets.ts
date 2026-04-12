'use client';
import { useAppStore } from '@/store/useAppStore';

export function useAssets() {
  const assets = useAppStore((state) => state.assets);
  const addAsset = useAppStore((state) => state.addAsset);
  const updateAssetStatus = useAppStore((state) => state.updateAssetStatus);

  return { assets, addAsset, updateAssetStatus };
}
