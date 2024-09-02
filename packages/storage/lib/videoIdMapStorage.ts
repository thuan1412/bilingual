import { createStorage } from './base';
import { StorageEnum } from './enums';
import type { VideoIdMap, VideoIdMapStorage } from './types';

const storage = createStorage<VideoIdMap>(
  'video-id-map-key',
  {},
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);

export const videoIdMapStorage: VideoIdMapStorage = {
  ...storage,
  addVideoId: async (videoId: string, url: string) => {
    await storage.set(prev => {
      return { ...prev, [videoId]: url };
    });
  },
  removeVideoId: async (videoId: string) => {
    await storage.set(prev => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [videoId]: _, ...rest } = prev;
      return rest;
    });
  },
  getByVideoId: async (videoId: string): Promise<string> => {
    return storage.get().then(map => map[videoId]);
  },
};
