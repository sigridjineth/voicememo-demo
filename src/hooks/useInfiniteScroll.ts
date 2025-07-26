import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export function useInfiniteScroll(
  callback: () => void,
  options: UseInfiniteScrollOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '100px',
    enabled = true,
  } = options;

  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLElement | null>(null);

  const observe = useCallback(
    (element: HTMLElement) => {
      if (!enabled) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            callback();
          }
        },
        {
          threshold,
          rootMargin,
        }
      );

      if (element) {
        observerRef.current.observe(element);
        targetRef.current = element;
      }
    },
    [callback, threshold, rootMargin, enabled]
  );

  const unobserve = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      unobserve();
    };
  }, [unobserve]);

  return {
    observe,
    unobserve,
    targetRef,
  };
}