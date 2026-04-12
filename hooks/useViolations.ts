'use client';
import { useAppStore } from '@/store/useAppStore';

export function useViolations() {
  const violations = useAppStore((state) => state.violations);
  const resolveViolation = useAppStore((state) => state.resolveViolation);
  const ignoreViolation = useAppStore((state) => state.ignoreViolation);

  return { violations, resolveViolation, ignoreViolation };
}
