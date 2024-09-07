/* eslint-disable @typescript-eslint/no-explicit-any */
import { configStorage, videoIdMapStorage } from '@extension/storage/';
import { useStorageSuspense } from '@extension/shared';
import { findSubtitleOfTime, mergeCaptionsToBiSubtitle, useCaptions } from './utils';
import type { Subtitle } from './types';
import { useEffect, useState } from 'react';
import SubtitleComponent from './components/SubtitleComponent';
import { getCurrentTimeInMs, getVideIdFromUrl, isVideoPlaying, scrollToSubtitle } from './utils/ytb';
import Settings from './components/Settings';

type MainUIProps = {
  videoUrl: string;
  requestUrl: string;
};

const MainUI = ({ requestUrl }: MainUIProps) => {
  const config = useStorageSuspense(configStorage);
  const { captions: firstCaptions } = useCaptions(requestUrl, config.firstLanguage);
  const { captions: secondCaptions } = useCaptions(requestUrl, config.secondLanguage);
  const biCaptions = mergeCaptionsToBiSubtitle(firstCaptions?.events ?? [], secondCaptions?.events ?? []);
  const [activeSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = getCurrentTimeInMs();
      const currentSub = findSubtitleOfTime(currentTime ?? 0, biCaptions);
      setCurrentSubtitle(currentSub);
      if (currentSub && isVideoPlaying()) {
        scrollToSubtitle(currentSub.timestamp);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [biCaptions]);

  if (!requestUrl) return null;
  // get height of the video tag
  const videoHeight = document.querySelector('video')?.clientHeight ?? 0;

  return (
    <div className="border-gray-100 border-2 border-solid p-2 rounded-lg text-2xl " style={{ maxHeight: videoHeight }}>
      <Settings />
      <div className="overflow-scroll size-full " style={{ maxHeight: videoHeight - 50 }}>
        {biCaptions.map((item, idx) => (
          <SubtitleComponent key={idx} subtitle={item} isActive={activeSubtitle?.timestamp == item.timestamp} />
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const config = useStorageSuspense(configStorage);

  const videoIdMap = useStorageSuspense(videoIdMapStorage);
  const [currentWindowUrl, setCurrentWindowUrl] = useState(window.location.toString());

  const videoId = getVideIdFromUrl(currentWindowUrl);
  const requestUrl = videoIdMap[videoId];

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentWindowUrl !== window.location.toString()) {
        setCurrentWindowUrl(window.location.toString());
      }
    }, 200);
    return () => clearInterval(intervalId);
  }, [currentWindowUrl]);

  if (!requestUrl || !currentWindowUrl) {
    return null;
  }

  if (config.enable === false) {
    return null;
  }
  return <MainUI videoUrl={currentWindowUrl} requestUrl={requestUrl} />;
}
