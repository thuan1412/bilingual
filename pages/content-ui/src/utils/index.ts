/* eslint-disable @typescript-eslint/no-explicit-any */
import { useStorageSuspense } from '@extension/shared';
import { configStorage } from '@extension/storage';
import { useEffect, useState } from 'react';
import type { Subtitle } from '../types';

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

  const enLangCode = new Set(['en', 'en-US', 'en-GB']);

  if (url.searchParams.get('lang') === tlang || (enLangCode.has(url.searchParams.get('lang') || '') && tlang == 'en')) {
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
        // console.error('Error fetching captions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaptions();
  }, [newUrlStr, tlang]);

  return { captions, loading };
};

export const findSubtitleOfTime = (timeInMs: number, subtitles: Subtitle[]) => {
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

export const timeToSeconds = (time: string) => {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

function msToTime(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const remainingSeconds = String(seconds % 60).padStart(2, '0');

  return `${hours}:${minutes}:${remainingSeconds}`;
}

export const mergeCaptionsToBiSubtitle = (firstEvents: any, secondEvents: any): Subtitle[] => {
  if (firstEvents.length === 0) {
    return [];
  }
  const timestampToSecondSeg: Record<number, string> = {};
  secondEvents.forEach((event: { segs?: { utf8: string }[]; tStartMs: number }) => {
    if (!event.segs) {
      return '';
    }
    const text = event.segs.flatMap((segment: { utf8: string }) => segment.utf8).join('');
    timestampToSecondSeg[event.tStartMs] = text;
  });
  const data = firstEvents.map((event: { tStartMs: number; segs?: { utf8: string }[] }) => {
    if (!event.segs) {
      return '';
    }
    return {
      timeInMs: event.tStartMs,
      timestamp: msToTime(event.tStartMs),
      firstLanguage: event.segs.flatMap(segment => segment.utf8).join(''),
      secondLanguage: timestampToSecondSeg[event.tStartMs],
    };
  });
  return data;
};
