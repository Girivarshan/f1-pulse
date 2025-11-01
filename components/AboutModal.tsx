
import React, { useEffect } from 'react';
import { F1Logo } from './icons/F1Logo';
import { XIcon } from './icons/XIcon';

interface AboutModalProps {
  /** Determines if the modal is visible. */
  isOpen: boolean;
  /** Callback function to close the modal. */
  onClose: () => void;
}

/**
 * A modal dialog that provides information about the F1 Pulse application.
 */
const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  // Effect hook to handle side effects when the modal's open state changes.
  useEffect(() => {
    // Function to close the modal when the 'Escape' key is pressed.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      // Add event listener for the escape key.
      document.addEventListener('keydown', handleKeyDown);
      // Prevent scrolling of the background content when the modal is open.
      document.body.style.overflow = 'hidden';
    }

    // Cleanup function to remove the event listener and restore body scrolling.
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Do not render the modal if it's not open.
  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fade-in"
      onClick={onClose} // Close the modal if the backdrop is clicked.
    >
      <div
        className="bg-gray-900/50 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it.
      >
        <div className="p-6 sm:p-8">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                    <F1Logo className="h-8 w-auto text-red-500" />
                    <h2 id="about-modal-title" className="text-2xl font-bold text-white">About F1 Pulse</h2>
                </div>
                 <button
                    onClick={onClose}
                    aria-label="Close modal"
                    className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <XIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="mt-6 space-y-6 text-gray-300 leading-relaxed">
                <section>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-2">What is F1 Pulse?</h3>
                    <p>
                        F1 Pulse is a specialized tool for Formula 1 fans, designed to quickly distill long news articles into concise, easy-to-digest summaries. Whether you're catching up on race results, team strategies, or the latest paddock gossip, F1 Pulse helps you get the key information in seconds.
                    </p>
                </section>
                
                <section>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-2">How It Works</h3>
                    <p>
                        This application leverages the power of Google's advanced <span className="font-semibold text-white">Gemini AI</span> model. When you provide an article's text or a URL, the content is securely sent to the Gemini API. The AI then reads, understands, and analyzes the text to perform three key tasks:
                    </p>
                    <ul className="list-disc list-inside mt-3 space-y-2 pl-2">
                        <li><span className="font-semibold text-gray-100">Summarization:</span> Generates a brief summary of the article's main points.</li>
                        <li><span className="font-semibold text-gray-100">Topic Extraction:</span> Identifies and pulls out the key "hot topics" like drivers, teams, and technical terms.</li>
                        <li><span className="font-semibold text-gray-100">Sentiment Analysis:</span> Determines the overall tone of the article (Positive, Neutral, or Negative) and explains its reasoning.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-2">Our Goal</h3>
                     <p>
                        Our goal is to enhance your F1 experience by saving you time and providing a deeper layer of insight into the news you're reading. All analysis is performed by AI, giving you an unbiased perspective on the latest happenings in the world of Formula 1.
                    </p>
                </section>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
