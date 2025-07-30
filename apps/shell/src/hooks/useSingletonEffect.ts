import { useEffect, useRef } from 'react';

/**
 * A custom hook that ensures an effect runs only once, even in React StrictMode
 * and during Hot Module Reload (HMR) in development.
 * 
 * This is useful for side effects like API calls that should only happen once
 * when a component mounts, regardless of React's development mode behaviors.
 */
export const useSingletonEffect = (effect: () => void | (() => void), deps?: React.DependencyList) => {
  const hasRun = useRef(false);
  const cleanup = useRef<(() => void) | void>(undefined);

  useEffect(() => {
    // If this effect has already run, don't run it again
    if (hasRun.current) {
      return;
    }

    // Mark as run and execute the effect
    hasRun.current = true;
    cleanup.current = effect();

    // Return cleanup function if provided
    return () => {
      if (cleanup.current) {
        cleanup.current();
      }
    };
  }, deps);

  // Reset the flag when component unmounts for real (not during React StrictMode)
  useEffect(() => {
    return () => {
      // Use a small timeout to distinguish between React StrictMode unmount/remount
      // and actual component unmount
      setTimeout(() => {
        hasRun.current = false;
      }, 100);
    };
  }, []);
};
