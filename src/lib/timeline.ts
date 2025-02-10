/**
 * Converts time in seconds to pixels based on the provided pps (pixels per second).
 */
export const timeToPx = (time: number, pps: number): number => time * pps;

/**
 * Converts pixels to time in seconds based on the provided pps (pixels per second).
 */
export const pxToTime = (px: number, pps: number): number => px / pps;

/**
 * Converts milliseconds to pixels based on the provided pps (pixels per second).
 */
export const msToPixels = (ms: number, scale: number): number =>
  (ms * scale) / 1000;

/**
 * Formats a time duration (in seconds) into a MM:SS string format.
 */
export const formatSecondsToString = (seconds: number): string => {
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
