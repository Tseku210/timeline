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

/**
 * Reorder a provided `list`
 * Returns a new array and does not modify the original array
 */
export function reorder<Value>({
  list,
  startIndex,
  finishIndex,
}: {
  list: Value[];
  startIndex: number;
  finishIndex: number;
}): Value[] {
  if (startIndex === -1 || finishIndex === -1) {
    return list;
  }

  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(finishIndex, 0, removed);

  return result;
}

/**
 * Binary search an item from items[] by target time
 * Returns the item, otherwise null
 */
export function binarySearch<T>(
  items: T[],
  target: number,
  getRange: (item: T) => { start: number; end: number },
): T | null {
  let low = 0;
  let high = items.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const { start, end } = getRange(items[mid]);

    if (target >= start && target < end) {
      return items[mid];
    } else if (target < start) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return null;
}
