import { createStorage } from './base';
import { exampleThemeStorage } from './exampleThemeStorage';
import { captionsStorage } from './captionsStorage';
import { requestParamsStorage } from './requestParams';
import { configStorage } from './config';
import { SessionAccessLevelEnum, StorageEnum } from './enums';
import type { BaseStorage } from './types';

export {
  captionsStorage,
  exampleThemeStorage,
  createStorage,
  StorageEnum,
  SessionAccessLevelEnum,
  requestParamsStorage,
  configStorage,
};
export type { BaseStorage };
