import { createStorage } from './base';
import { StorageEnum } from './enums';
import type { Config } from './types';

const storage = createStorage<Config>(
  'config',
  {
    aiTranslate: true,
    enable: true,
  },
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);

// You can extend it with your own methods
export const configStorage = {
  ...storage,
  toggleExtension: async () => {
    await storage.set(current => {
      return { ...current, enable: !current.enable };
    });
  },
  toggleAI: async () => {
    await storage.set(current => {
      return { ...current, aiTranslate: !current.aiTranslate };
    });
  },
};
