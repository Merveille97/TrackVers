import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Slight delay on mount before showing tooltip for better UX
    const showTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 1500);

    // Auto-hide the tooltip after 5 seconds
    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 6500); // 1.5s delay + 5s display

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleInteraction = () => {
    setIsOpen(true);
    // Hide tooltip immediately upon interaction
    if (showTooltip) {
      setShowTooltip(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end sm:flex-row sm:items-center pointer-events-none">
        <AnimatePresence>
          {showTooltip && (
            <>
              {/* Desktop Tooltip (Left side) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="hidden sm:block mr-4 pointer-events-auto bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-white px-4 py-2 rounded-xl shadow-lg shadow-blue-500/10 border border-slate-200 dark:border-slate-700 text-sm font-medium whitespace-nowrap backdrop-blur-sm relative"
              >
                Send us your feedback here
                {/* Arrow pointing right */}
                <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white/95 dark:bg-slate-800/95 border-t border-r border-slate-200 dark:border-slate-700 rotate-45 transform" />
              </motion.div>

              {/* Mobile Tooltip (Top side) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="sm:hidden mb-4 mr-0 pointer-events-auto bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-white px-4 py-2 rounded-xl shadow-lg shadow-blue-500/10 border border-slate-200 dark:border-slate-700 text-sm font-medium whitespace-nowrap backdrop-blur-sm relative"
              >
                Send us your feedback here
                {/* Arrow pointing down */}
                <div className="absolute bottom-[-5px] right-6 w-2.5 h-2.5 bg-white/95 dark:bg-slate-800/95 border-b border-r border-slate-200 dark:border-slate-700 rotate-45 transform" />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="relative pointer-events-auto">
          {/* Pulsing Ring Animation */}
          <AnimatePresence>
            {!isOpen && (
              <>
                 <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                  className="absolute inset-0 rounded-full bg-cyan-400/30 z-0"
                />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1.4, opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.6
                  }}
                  className="absolute inset-0 rounded-full bg-blue-500/20 z-0"
                />
              </>
            )}
          </AnimatePresence>

          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={handleInteraction}
            className="relative z-10 p-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow duration-300 flex items-center justify-center group"
            aria-label="Give Feedback"
          >
            <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
          </motion.button>
        </div>
      </div>

      <FeedbackModal isOpen={isOpen} onClose={setIsOpen} />
    </>
  );
};

export default FeedbackButton;