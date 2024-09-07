import { createRoot } from 'react-dom/client';
import App from '@src/app';
// @ts-expect-error That's because output file is create during build
import tailwindcssOutput from '../dist/tailwind-output.css?inline';

const root = document.createElement('div');
root.id = 'bilingual-view-root';

const startTime = Date.now();
const injectRoot = () => {
  const intervalId = setInterval(() => {
    // if not video page, then return
    if (!window.location.pathname.startsWith('/watch')) {
      return;
    }
    const secondary = document.querySelector('div#columns div#secondary');
    if (secondary) {
      secondary.insertBefore(root, secondary.firstChild);
      clearInterval(intervalId);
    } else if (Date.now() - startTime > 5000) {
      clearInterval(intervalId);
    }
  }, 500);
};

let lastUrl = '';

setInterval(() => {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl || lastUrl === '') {
    injectRoot();
    lastUrl = currentUrl; // Update the last URL to the new one
  }
}, 500); // Check every 1 second

const rootIntoShadow = document.createElement('div');
rootIntoShadow.id = 'shadow-root';

const shadowRoot = root.attachShadow({ mode: 'open' });

if (navigator.userAgent.includes('Firefox')) {
  /**
   * In the firefox environment, adoptedStyleSheets cannot be used due to the bug
   * @url https://bugzilla.mozilla.org/show_bug.cgi?id=1770592
   *
   * Injecting styles into the document, this may cause style conflicts with the host page
   */
  const styleElement = document.createElement('style');
  styleElement.innerHTML = tailwindcssOutput;
  shadowRoot.appendChild(styleElement);
} else {
  /** Inject styles into shadow dom */
  const globalStyleSheet = new CSSStyleSheet();
  globalStyleSheet.replaceSync(tailwindcssOutput);
  shadowRoot.adoptedStyleSheets = [globalStyleSheet];
}

shadowRoot.appendChild(rootIntoShadow);
createRoot(rootIntoShadow).render(<App />);
