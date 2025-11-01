
import React, { useEffect } from 'react';
import { HistoryItem } from '../types';
import { XIcon } from './icons/XIcon';
import { TrashIcon } from './icons/TrashIcon';
import { F1CarIcon } from './icons/F1CarIcon';

interface HistorySidebarProps {
  /** Determines if the sidebar is visible. */
  isOpen: boolean;
  /** Callback function to close the sidebar. */
  onClose: () => void;
  /** An array of history items to display. */
  items: HistoryItem[];
  /** Callback function when a history item is selected. */
  onSelect: (item: HistoryItem) => void;
  /** Callback function to clear the entire history. */
  onClear: () => void;
}

/**
 * A sidebar component that displays a list of past analysis results.
 * It allows users to view, select, and clear their history.
 */
const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onClose, items, onSelect, onClear }) => {
  // Effect to handle keyboard controls and background scroll locking.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  /**
   * Formats an ISO date string into a more readable local format.
   * @param dateString The ISO date string to format.
   * @returns A formatted date and time string.
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-sidebar-title"
        className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out ${isOpen ? 'bg-black/50 backdrop-blur-sm' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      ></div>
      {/* Sidebar panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-gray-900/50 backdrop-blur-2xl shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full border-l border-white/10">
          <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
            <h2 id="history-sidebar-title" className="text-xl font-bold text-white">Analysis History</h2>
            <button
              onClick={onClose}
              aria-label="Close history"
              className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </header>
          
          <div className="flex-grow overflow-y-auto p-4">
            {/* Conditional rendering: show message if history is empty, otherwise show list. */}
            {items.length === 0 ? (
              <div className="text-center text-gray-500 pt-10">
                <F1CarIcon className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg">No history yet.</p>
                <p className="text-sm">Your analyzed articles will appear here.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item.id}>
                    <button 
                      onClick={() => onSelect(item)}
                      className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                      <p className="font-semibold text-gray-200 truncate">{item.source}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(item.date)}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer with "Clear History" button, only shown if there are items. */}
          {items.length > 0 && (
             <footer className="p-4 border-t border-white/10 flex-shrink-0">
                <button
                    onClick={onClear}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-800/50 text-red-300 font-medium rounded-lg hover:bg-red-800/80 hover:text-red-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500"
                >
                    <TrashIcon className="w-5 h-5" />
                    <span>Clear History</span>
                </button>
             </footer>
          )}
        </div>
      </div>
    </>
  );
};

export default HistorySidebar;
