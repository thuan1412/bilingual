import { createStorage } from './base';
import { StorageEnum } from './enums';

const storage = createStorage('request-params', '', {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

// You can extend it with your own methods
export const requestParamsStorage = {
  ...storage,
};
