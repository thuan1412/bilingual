import '@src/Popup.css';
import { useStorageSuspense, withErrorBoundary, withSuspense } from '@extension/shared';
import { configStorage, exampleThemeStorage } from '@extension/storage';

const Popup = () => {
  const theme = useStorageSuspense(exampleThemeStorage);
  const config = useStorageSuspense(configStorage);
  const isLight = theme === 'light';

  return (
    <div className={`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`}>
      <header className={`App-header ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
        <button
          onClick={configStorage.toggleExtension}
          className="font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 bg-white text-black shadow-black">
          {config.enable ? 'ON' : 'OFF'}
        </button>
        <button
          onClick={configStorage.toggleAI}
          className="font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 bg-white text-black shadow-black">
          Toggle the AI translation: {config.aiTranslate ? 'ON' : 'OFF'}
        </button>
      </header>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
