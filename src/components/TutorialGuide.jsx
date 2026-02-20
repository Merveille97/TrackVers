
import React, { useEffect, useState, useRef } from 'react';
import { useTutorial } from '@/hooks/useTutorial';
import TutorialOverlay from './TutorialOverlay';
import TutorialStep from './TutorialStep';

const TutorialGuide = ({ steps }) => {
  const {
    currentStep,
    isActive,
    isCompleted,
    startTutorial,
    nextStep,
    prevStep,
    skipTutorial,
    completeTutorial
  } = useTutorial();

  const [targetRect, setTargetRect] = useState(null);
  const [stepPosition, setStepPosition] = useState(null);
  const resizeObserverRef = useRef(null);

  // Auto-start if not completed
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (!isCompleted && !isActive) {
        startTutorial();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [isCompleted, isActive, startTutorial]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (currentStep < steps.length - 1) nextStep();
        else completeTutorial();
      } else if (e.key === 'ArrowLeft') {
        prevStep();
      } else if (e.key === 'Escape') {
        skipTutorial();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, currentStep, steps.length, nextStep, prevStep, skipTutorial, completeTutorial]);

  // Calculate positions
  const updatePositions = () => {
    if (!isActive || !steps[currentStep]) return;

    const step = steps[currentStep];
    
    if (step.targetSelector === 'center') {
      setTargetRect(null);
      setStepPosition(null); // Triggers center fallback in TutorialStep
      return;
    }

    const element = document.querySelector(step.targetSelector);
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);

      // Calculate step card position
      // Default spacing
      const gap = 20;
      let top = 0;
      let left = 0;

      // Basic positioning logic (can be expanded)
      if (step.position === 'bottom') {
        top = rect.bottom + gap;
        left = rect.left + (rect.width / 2) - 175; // 175 is half of max-width (350px)
      } else if (step.position === 'top') {
        top = rect.top - gap - 200; // estimated height
        left = rect.left + (rect.width / 2) - 175;
      } else if (step.position === 'right') {
        top = rect.top;
        left = rect.right + gap;
      } else {
        // Fallback to bottom if unknown
        top = rect.bottom + gap;
        left = rect.left;
      }

      // Boundary checks (keep on screen)
      const padding = 20;
      if (left < padding) left = padding;
      if (left + 350 > window.innerWidth) left = window.innerWidth - 350 - padding;
      if (top < padding) top = padding;
      // We don't check bottom overflow rigorously for now, relying on scroll if needed, 
      // but sticky positioning usually handles it.
      
      setStepPosition({ top, left });
    } else {
      // Element not found fallback
      console.warn(`Tutorial target ${step.targetSelector} not found`);
      setTargetRect(null);
      setStepPosition(null); 
    }
  };

  useEffect(() => {
    updatePositions();
    
    // Listen for resize and scroll to update positions
    window.addEventListener('resize', updatePositions);
    window.addEventListener('scroll', updatePositions, true);
    
    return () => {
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions, true);
    };
  }, [currentStep, isActive, steps]);

  // Scroll target into view
  useEffect(() => {
    if (isActive && steps[currentStep] && steps[currentStep].targetSelector !== 'center') {
      const element = document.querySelector(steps[currentStep].targetSelector);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep, isActive, steps]);

  if (!isActive) return null;

  return (
    <>
      <TutorialOverlay 
        targetRect={targetRect} 
        isVisible={isActive} 
      />
      <TutorialStep
        step={steps[currentStep]}
        totalSteps={steps.length}
        currentStepIndex={currentStep}
        onNext={() => {
          if (currentStep >= steps.length - 1) {
            completeTutorial();
          } else {
            nextStep();
          }
        }}
        onPrev={prevStep}
        onSkip={skipTutorial}
        position={stepPosition}
      />
    </>
  );
};

export default TutorialGuide;
