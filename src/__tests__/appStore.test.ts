import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../core/store/appStore';

describe('Global AppStore State Management', () => {
  beforeEach(() => {
    useAppStore.setState({
      theme: 'light',
      branchId: null,
      isOfflineMode: false,
    });
  });

  it('initializes with expected default values', () => {
    const state = useAppStore.getState();
    expect(state.theme).toBe('light');
    expect(state.branchId).toBeNull();
    expect(state.isOfflineMode).toBe(false);
  });

  it('updates theme correctly', () => {
    useAppStore.getState().setTheme('dark');
    expect(useAppStore.getState().theme).toBe('dark');

    useAppStore.getState().setTheme('system');
    expect(useAppStore.getState().theme).toBe('system');
  });

  it('updates branch ID', () => {
    useAppStore.getState().setBranchId('branch_123');
    expect(useAppStore.getState().branchId).toBe('branch_123');
  });

  it('toggles offline status', () => {
    useAppStore.getState().setOfflineMode(true);
    expect(useAppStore.getState().isOfflineMode).toBe(true);

    useAppStore.getState().setOfflineMode(false);
    expect(useAppStore.getState().isOfflineMode).toBe(false);
  });
});
