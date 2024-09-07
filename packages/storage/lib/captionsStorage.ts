import { createStorage } from './base';
import { StorageEnum } from './enums';
import type { Config } from './types';

const storage = createStorage(
  'caption-storage-key',
  {
    firstLanguage: 'en',
    secondLanguage: 'es',
  } as Config,
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);

// You can extend it with your own methods
export const captionsStorage = {
  ...storage,
};
