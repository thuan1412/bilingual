/* eslint-disable @typescript-eslint/no-explicit-any */
import { configStorage, requestParamsStorage } from '@extension/storage/';
import { useStorageSuspense } from '@extension/shared';
import { findCurrentSubtitle, getCurrentTimeInMs, useCaptions } from './utils';
import type { Subtitle } from './types';
import { useEffect, useState } from 'react';

type SubtitleProps = {
  timeInMs: number;
  timestamp: string;
  firstLanguage: string;
  secondLanguage: string;
  isActive: boolean;
};

const timeToSeconds = (time: string) => {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

// type Event = {
//   tStartMs: number;
//   dDurationMs: number;
//   segs: { utf8: string }[];
// };

const SubtitleComponent = ({ timestamp, firstLanguage, secondLanguage, isActive }: SubtitleProps) => {
  const setVideoTime = () => {
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.currentTime = timeToSeconds(timestamp);
    }
  };
  return (
    <div id={`subtitle-${timestamp}`}>
      <div className="flex flex-row items-start justify-items-center">
        <button onClick={setVideoTime} className="mr-2 cursor-pointer text-gray-400">
          {timestamp}
        </button>
        <div className={'flex flex-col ' + (isActive ? 'font-bold' : '')}>
          <p>{firstLanguage}</p>
          <p>{secondLanguage}</p>
        </div>
      </div>
    </div>
  );
};

function msToTime(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const remainingSeconds = String(seconds % 60).padStart(2, '0');

  return `${hours}:${minutes}:${remainingSeconds}`;
}

const mergeCaptionsToBiSubtitle = (firstEvents: any, secondEvents: any): Subtitle[] => {
  const timestampToSecondSeg: Record<number, string> = {};
  secondEvents.forEach((event: { segs: { utf8: string }[]; tStartMs: number }) => {
    const text = event.segs.flatMap((segment: { utf8: string }) => segment.utf8).join('');
    timestampToSecondSeg[event.tStartMs] = text;
  });
  const data = firstEvents.map((event: { tStartMs: number; segs: { utf8: string }[] }) => {
    return {
      timeInMs: event.tStartMs,
      timestamp: msToTime(event.tStartMs),
      firstLanguage: event.segs.flatMap(segment => segment.utf8).join(''),
      secondLanguage: timestampToSecondSeg[event.tStartMs],
    };
  });
  return data;
};

// Example usage: Log the current timestamp to the console every second
const MainUI = () => {
  const requestUrl = useStorageSuspense(requestParamsStorage);
  const { captions: firstCaptions } = useCaptions(requestUrl, 'en');
  const { captions: secondCaptions } = useCaptions(requestUrl, 'vi');
  const biCaptions = mergeCaptionsToBiSubtitle(firstCaptions?.events ?? [], secondCaptions?.events ?? []);
  const [activeSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = getCurrentTimeInMs();
      const currentSub = findCurrentSubtitle(currentTime ?? 0, biCaptions);
      setCurrentSubtitle(currentSub);
      if (currentSub) scrollToSubtitle(currentSub.timestamp);
    }, 1000);
    return () => clearInterval(intervalId);
  });

  const scrollToSubtitle = (currentTime: string) => {
    const subtitleElement = document
      .querySelector('#bilingual-view-root')
      ?.shadowRoot?.getElementById(`subtitle-${currentTime}`);
    if (subtitleElement) {
      subtitleElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div
      className="border-gray-100 border-2 border-solid p-2 size-full rounded-lg text-2xl overflow-scroll"
      style={{ maxHeight: 500 }}>
      {biCaptions.map((item, idx) => (
        <SubtitleComponent key={idx} {...item} isActive={activeSubtitle?.timestamp == item.timestamp} />
      ))}
    </div>
  );
};

export default function App() {
  // const [biCaptions, setBiCaptions] = useState<Subtitle[]>(data);
  const config = useStorageSuspense(configStorage);
  if (config.enable === false) {
    return null;
  }

  return <MainUI />;
}
