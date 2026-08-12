import { useSyncExternalStore } from "react";

function subscribeMediaQuery(query: string, callback: () => void) {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getMediaQuerySnapshot(query: string) {
  return () => window.matchMedia(query).matches;
}

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (callback) => subscribeMediaQuery(query, callback),
    getMediaQuerySnapshot(query),
    () => false,
  );
}

export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function useCoarsePointer() {
  return useMediaQuery("(pointer: coarse)");
}

export function useLowPower() {
  return typeof navigator !== "undefined" && navigator.hardwareConcurrency
    ? navigator.hardwareConcurrency < 4
    : false;
}

export function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
