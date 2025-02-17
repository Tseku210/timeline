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
 * Formats a time duration (in seconds) into a customizable string format.
 * @param seconds - The time duration in seconds.
 * @param format - A colon-separated string defining the format ("MM:SS:MS").
 *                 Example options: "MM:SS", "MM:SS:MS"
 * @returns Formatted time string.
 */
export const formatSecondsToString = (
  seconds: number,
  format: string = "MM:SS",
): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds * 100) % 100);

  let formattedTime = "";
  const formats = format.split(":");

  if (formats[0] === "MM") {
    formattedTime += `${mins.toString().padStart(2, "0")}`;
  }
  if (formats[1] === "SS") {
    formattedTime +=
      (formattedTime ? ":" : "") + secs.toString().padStart(2, "0");
  }
  if (formats[2] === "MS") {
    formattedTime +=
      (formattedTime ? ":" : "") + millis.toString().padStart(2, "0");
  }

  return formattedTime;
};
