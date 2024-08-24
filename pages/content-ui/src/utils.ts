/* eslint-disable @typescript-eslint/no-explicit-any */
import { useStorageSuspense } from '@extension/shared';
import { configStorage } from '@extension/storage';
import { useEffect, useState } from 'react';
import type { Subtitle } from './types';

export const getCaptions = async (urlStr: string) => {
  const response = await fetch(urlStr);
  const captionsRes = await response.json();

  return captionsRes;
};

export const useCaptions = (urlStr: string, tlang: string) => {
  const [captions, setCaptions] = useState<any>(null); // Replace `any` with a more specific type if possible
  const [loading, setLoading] = useState<boolean>(true);
  const config = useStorageSuspense(configStorage);

  const url = new URL(urlStr);

  url.searchParams.set('isBot', '1');

  if (url.searchParams.get('lang') === tlang || (url.searchParams.get('lang') === 'en-US' && tlang == 'en')) {
    url.searchParams.delete('tlang');
  } else {
    if (config.aiTranslate) {
      url.searchParams.set('tlang', tlang);
    } else {
      url.searchParams.set('lang', tlang);
    }
  }
  const newUrlStr = url.toString();

  useEffect(() => {
    const fetchCaptions = async () => {
      setLoading(true);
      try {
        const data = await getCaptions(newUrlStr);
        setCaptions(data);
      } catch (error) {
        console.error('Error fetching captions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaptions();
  }, [newUrlStr, tlang]);

  return { captions, loading };
};

export const findCurrentSubtitle = (timeInMs: number, subtitles: Subtitle[]) => {
  const optimal = false;
  if (optimal) {
    return findCurrentSubtitleBs(timeInMs, subtitles);
  }
  let res = null;
  for (let i = 0; i < subtitles.length; i++) {
    if (subtitles[i].timeInMs >= timeInMs) {
      break;
    }
    if (subtitles[i].timeInMs < timeInMs) {
      res = subtitles[i];
    }
  }
  return res;
};

const findCurrentSubtitleBs = (timeInMs: number, subtitles: Subtitle[]) => {
  let left = 0;
  let right = subtitles.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (subtitles[mid].timeInMs > timeInMs) {
      right = mid - 1;
    } else if (subtitles[mid].timeInMs < timeInMs) {
      left = mid + 1;
    } else {
      return subtitles[mid];
    }
  }

  return subtitles[right];
};

export const getCurrentTimeInMs = () => {
  const videoElement = document.querySelector('video');
  if (videoElement) {
    return videoElement.currentTime * 1000;
  }
  return null;
};
