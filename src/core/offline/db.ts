import localforage from 'localforage';

localforage.config({
  name: 'TalkOS',
  version: 1.0,
  storeName: 'talkos_offline_db', // Should be alphanumeric, with underscores.
  description: 'TalkOS Offline Database for caching and sync queue'
});

export const offlineDB = {
  setItem: async <T>(key: string, value: T): Promise<T> => {
    return await localforage.setItem(key, value);
  },
  getItem: async <T>(key: string): Promise<T | null> => {
    return await localforage.getItem<T>(key);
  },
  removeItem: async (key: string): Promise<void> => {
    return await localforage.removeItem(key);
  },
  clear: async (): Promise<void> => {
    return await localforage.clear();
  }
};
