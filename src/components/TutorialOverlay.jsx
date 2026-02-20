
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TutorialOverlay = ({ targetRect, isVisible, onClick }) => {
  if (!isVisible) return null;

  // If no target (e.g., centered step), use a full screen overlay
  const isCentered = !targetRect;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 pointer-events-auto overflow-hidden"
        style={{
          background: isCentered 
            ? 'rgba(15, 23, 42, 0.85)' // Simple dark overlay for centered
            : 'transparent' // We use box-shadow for the spotlight effect
        }}
        onClick={onClick}
      >
        {!isCentered && targetRect && (
          <motion.div
            className="absolute rounded-lg"
            initial={false}
            animate={{
              top: targetRect.top - 10,
              left: targetRect.left - 10,
              width: targetRect.width + 20,
              height: targetRect.height + 20,
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20
            }}
            style={{
              boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.85)',
              zIndex: 51
            }}
          />
        )}
        
        {!isCentered && targetRect && (
          <motion.div
             className="absolute border-2 border-cyan-400 rounded-lg"
             initial={{ opacity: 0, scale: 1.1 }}
             animate={{ 
               opacity: 1, 
               scale: 1,
               top: targetRect.top - 10,
               left: targetRect.left - 10,
               width: targetRect.width + 20,
               height: targetRect.height + 20,
             }}
             transition={{
                duration: 0.4,
                ease: "easeOut"
             }}
             style={{ zIndex: 52, pointerEvents: 'none' }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default TutorialOverlay;
