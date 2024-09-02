export const scrollToSubtitle = (currentTime: string) => {
  const subtitleElement = document
    .querySelector('#bilingual-view-root')
    ?.shadowRoot?.getElementById(`subtitle-${currentTime}`);
  if (subtitleElement) {
    subtitleElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
