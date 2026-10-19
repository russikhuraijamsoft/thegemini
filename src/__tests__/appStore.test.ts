import { describe, it, expect, beforeEach, vi, afterAll } from 'vitest';

const { localStorageMock, navigatorMock } = vi.hoisted(() => {
  const store: Record<string, string> = {};
  return {
    localStorageMock: {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => {
        for (const k of Object.keys(store)) delete store[k];
      },
    },
    navigatorMock: { onLine: true },
  };
});

vi.stubGlobal('localStorage', localStorageMock);
vi.stubGlobal('navigator', navigatorMock);

// Import only after installing browser globals; static imports are hoisted.
const { useAppStore } = await import('../core/store/appStore');

describe('Global AppStore State Management', () => {
  beforeEach(() => {
    localStorageMock.clear();
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

  afterAll(() => vi.unstubAllGlobals());

  it('persists changes and rehydrates saved settings', async () => {
    useAppStore.getState().setTheme('dark');
    useAppStore.getState().setBranchId('branch_saved');
    const saved = localStorageMock.getItem('talkos-app-storage');
    expect(saved).not.toBeNull();
    expect(JSON.parse(saved!).state).toMatchObject({
      theme: 'dark', branchId: 'branch_saved',
    });
    useAppStore.setState({ theme: 'light', branchId: null });
    localStorageMock.setItem('talkos-app-storage', saved!);
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState()).toMatchObject({
      theme: 'dark', branchId: 'branch_saved',
    });
  });

  it('toggles offline status', () => {
    useAppStore.getState().setOfflineMode(true);
    expect(useAppStore.getState().isOfflineMode).toBe(true);

    useAppStore.getState().setOfflineMode(false);
    expect(useAppStore.getState().isOfflineMode).toBe(false);
  });
});
