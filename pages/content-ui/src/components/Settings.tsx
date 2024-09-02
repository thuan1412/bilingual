import { useState } from 'react';

const MenuSetting = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={toggleMenu}
          className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Settings
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 01.993.883L11 4v2h2a1 1 0 01.117 1.993L13 8h-2v2a1 1 0 01-1.993.117L9 10V8H7a1 1 0 01-.117-1.993L7 6h2V4a1 1 0 01.883-.993L10 3zm-2 9h4a1 1 0 011 .883V14a1 1 0 01-.883.993L12 15h-4a1 1 0 01-.993-.883L7 14v-1a1 1 0 01.883-.993L8 12zm-3 1a1 1 0 01.993.883L6 14v1a1 1 0 01-.883.993L5 16H4a1 1 0 01-.993-.883L3 15v-1a1 1 0 01.883-.993L4 13h1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <a href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Account settings
            </a>
            <a href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Support
            </a>
            <a href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              License
            </a>
            <a href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Sign out
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuSetting;
