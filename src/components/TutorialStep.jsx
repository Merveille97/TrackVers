
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, X, Check } from 'lucide-react';

const TutorialStep = ({ 
  step, 
  totalSteps, 
  currentStepIndex, 
  onNext, 
  onPrev, 
  onSkip, 
  position 
}) => {
  if (!step) return null;

  const isLastStep = currentStepIndex === totalSteps - 1;

  // Determine styles based on position relative to target
  let positionStyles = {};
  const margin = 20;

  // If we have a target rect in position prop (passed from parent calculation)
  if (position?.top !== undefined) {
    positionStyles = {
      top: position.top,
      left: position.left,
      maxWidth: '350px',
      position: 'fixed'
    };
  } else {
    // Centered fallback
    positionStyles = {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '400px',
      position: 'fixed'
    };
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      style={{ ...positionStyles, zIndex: 60 }}
      className="bg-slate-900 border border-cyan-500/30 text-white p-6 rounded-xl shadow-2xl shadow-black/50"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/50">
            {currentStepIndex + 1}
          </span>
          <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">
             of {totalSteps}
          </span>
        </div>
        <button 
          onClick={onSkip}
          className="text-gray-500 hover:text-white transition-colors"
          aria-label="Close tutorial"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <h3 className="text-lg font-bold mb-2 text-white">{step.title}</h3>
      <p className="text-gray-300 text-sm mb-6 leading-relaxed">
        {step.description}
      </p>

      <div className="flex items-center justify-between mt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onSkip}
          className="text-gray-400 hover:text-white text-xs px-2"
        >
          Skip Tour
        </Button>
        
        <div className="flex gap-2">
          {currentStepIndex > 0 && (
             <Button
               variant="outline"
               size="sm"
               onClick={onPrev}
               className="border-gray-700 text-gray-300 hover:text-white hover:bg-slate-800"
             >
               Back
             </Button>
          )}
          <Button 
            size="sm" 
            onClick={onNext}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
          >
            {isLastStep ? (
              <>Finish <Check className="ml-1 w-3 h-3" /></>
            ) : (
              <>Next <ChevronRight className="ml-1 w-3 h-3" /></>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TutorialStep;
