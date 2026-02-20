
import { useState, useEffect, useCallback } from 'react';

export const useTutorial = (tutorialKey = 'trackvers_tutorial_completed') => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(tutorialKey);
    if (completed === 'true') {
      setIsCompleted(true);
    }
  }, [tutorialKey]);

  const startTutorial = useCallback(() => {
    // Only start if not completed or forced
    if (!isCompleted) {
      setIsActive(true);
      setCurrentStep(0);
    }
  }, [isCompleted]);

  const restartTutorial = useCallback(() => {
    setIsActive(true);
    setCurrentStep(0);
    setIsCompleted(false);
    localStorage.removeItem(tutorialKey);
  }, [tutorialKey]);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const skipTutorial = useCallback(() => {
    setIsActive(false);
    setIsCompleted(true);
    localStorage.setItem(tutorialKey, 'true');
  }, [tutorialKey]);

  const completeTutorial = useCallback(() => {
    setIsActive(false);
    setIsCompleted(true);
    localStorage.setItem(tutorialKey, 'true');
  }, [tutorialKey]);

  return {
    currentStep,
    isActive,
    isCompleted,
    startTutorial,
    restartTutorial,
    nextStep,
    prevStep,
    skipTutorial,
    completeTutorial
  };
};
