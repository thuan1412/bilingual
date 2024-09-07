import { createStorage } from './base';
import { StorageEnum } from './enums';
import type { Config, ConfigStorage } from './types';

const storage = createStorage<Config>(
  'config',
  {
    aiTranslate: true,
    enable: true,
    firstLanguage: 'en',
    secondLanguage: 'es',
  } as Config,
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);

// You can extend it with your own methods
export const configStorage: ConfigStorage = {
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
  setFirstLanguage: async (language: string) => {
    await storage.set(current => {
      return { ...current, firstLanguage: language };
    });
  },
  setSecondLanguage: async (language: string) => {
    await storage.set(current => {
      return { ...current, secondLanguage: language };
    });
  },
};
