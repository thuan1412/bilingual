import { createStorage } from './base';
import { StorageEnum } from './enums';

const storage = createStorage('caption-storage-key', {} as any, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

// You can extend it with your own methods
export const captionsStorage = {
  ...storage,
};
