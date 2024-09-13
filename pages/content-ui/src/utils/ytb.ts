export const scrollToSubtitle = (currentTime: string) => {
  const rootElement = document.querySelector('#bilingual-view-root');
  const subtitleElement = rootElement?.shadowRoot?.getElementById(`subtitle-${currentTime}`);
  const scrollableDiv = rootElement?.shadowRoot?.getElementById('subtitile-container');

  console.log(subtitleElement, scrollableDiv);
  if (subtitleElement && scrollableDiv) {
    const subtitleElementRect = subtitleElement.getBoundingClientRect();
    const scrollableDivRect = scrollableDiv.getBoundingClientRect();
    const relativeTop = subtitleElementRect.top - scrollableDivRect.top;

    const newScrollTop = scrollableDiv.scrollTop + relativeTop - scrollableDivRect.height / 2;

    scrollableDiv.scrollTo({
      top: newScrollTop,
      behavior: 'smooth',
    });
  }
};

export const getCurrentTimeInMs = () => {
  const videoElement = document.querySelector('video');
  if (videoElement) {
    return videoElement.currentTime * 1000;
  }
  return null;
};

export const isVideoPage = () => window.location.pathname.startsWith('/watch');

export const getCurrentVideoId = () => {
  if (!isVideoPage()) {
    return '';
  }
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('v') || '';
};

export const isVideoPlaying = () => {
  const videoElement = document.querySelector('video');
  return videoElement && !videoElement.paused;
};

export const getVideIdFromUrl = (url: string) => {
  const urlParams = new URL(url).searchParams;
  return urlParams.get('v') || '';
};
