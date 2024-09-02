/* eslint-disable @typescript-eslint/no-unused-vars */
import 'webextension-polyfill';
import { captionsStorage, exampleThemeStorage, requestParamsStorage, videoIdMapStorage } from '@extension/storage';

exampleThemeStorage.get().then(theme => {
  // console.log('theme test', theme);
});

const getCaptions = async (urlStr: string, tlang: string) => {
  const url = new URL(urlStr);

  url.searchParams.set('isBot', '1');
  url.searchParams.set('lang', 'en');

  if (url.searchParams.get('lang') === tlang) {
    url.searchParams.delete('tlang');
  } else {
    // url.searchParams.set('lang', tlang);
    url.searchParams.set('tlang', tlang);
  }
  const response = await fetch(url.toString());
  const captionsRes = await response.json();

  return captionsRes;
};

const saveCaptionsHandler = async (url: string) => {
  const firstLang = 'en';
  const secondLang = 'vi';

  const params = new URL(url).searchParams;
  const currentVideoId = (await captionsStorage.get()).videoId;
  // console.log('🚀 ~ saveCaptionsHandler ~ currentVideoId:', params, currentVideoId);

  if (currentVideoId === params.get('v')) {
    return;
  }

  const firstCaps = await getCaptions(url, firstLang);
  const secondCaps = await getCaptions(url, secondLang);

  const data = {
    videoId: params.get('v'),
    firstLang: firstCaps,
    secondLang: secondCaps,
  };
  console.log('saving data', data.videoId, data);
  await captionsStorage.set(data);
};

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (details.url.includes('timedtext') && !details.url.includes('isBot')) {
      const videoId = new URL(details.url).searchParams.get('v') as string;

      requestParamsStorage.set(details.url);
      console.log('videoId', videoId, details.url);
      videoIdMapStorage.addVideoId(videoId, details.url);
    }
  },
  { urls: ['<all_urls>'] },
);
