import { useEffect, useRef } from 'react';

export const useInterval = (callback: () => void | Promise<void>, interval?: number) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!interval || interval <= 0) {
      return;
    }

    const timer = setInterval(() => callbackRef.current(), interval);
    return () => clearInterval(timer);
  }, [interval]);
};
