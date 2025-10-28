import React, { createContext, useContext, useState } from 'react';

interface PopupContextType {
  openPopup: (content: React.ReactNode) => void;
  closePopup: () => void;
}
const PopupContext = createContext<PopupContextType | null>(null);

export const usePopup = () => {
  const ctx = useContext(PopupContext);
  if (!ctx) throw new Error('usePopup outside PopupProvider');
  return ctx;
};

export const PopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<React.ReactNode | null>(null);

  const openPopup = (modalContent: React.ReactNode) => setContent(modalContent);
  const closePopup = () => setContent(null);

  return (
    <PopupContext.Provider value={{ openPopup, closePopup }}>
      {children}
      {content && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-4 text-gray-500 text-xl"
              onClick={closePopup}
              aria-label="Close"
            >
              &times;
            </button>
            {content}
          </div>
        </div>
      )}
    </PopupContext.Provider>
  );
};
