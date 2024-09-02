import type { Subtitle } from '@src/types';
import { timeToSeconds } from '@src/utils';

type SubtitleProps = {
  subtitle: Subtitle;
  isActive: boolean;
};

const SubtitleComponent = ({ subtitle, isActive }: SubtitleProps) => {
  const { timestamp, firstLanguage, secondLanguage } = subtitle;
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
        <div className="flex flex-col">
          <p className={isActive ? 'font-bold' : ''}>{firstLanguage}</p>
          <p className={'italic ' + (isActive ? 'font-medium' : '')}>{secondLanguage}</p>
        </div>
      </div>
    </div>
  );
};

export default SubtitleComponent;
