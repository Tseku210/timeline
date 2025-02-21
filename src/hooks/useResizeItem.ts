import { useCallback } from "react";
import { clamp } from "@/lib/utils";
import useTimelinePosition from "@/hooks/useTImelinePosition";

const MIN_DURATION = 1;

interface ResizeOptions {
  initialStart: number;
  initialEnd: number;
  sceneDuration: number;
  onResize: (newStart: number, newDuration: number) => void;
}

export default function useResize({
  initialStart,
  initialEnd,
  sceneDuration,
  onResize,
}: ResizeOptions) {
  const { timeToPosition, positionToTime } = useTimelinePosition();

  const startResize = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement>,
      isStart: boolean,
      elementRef: React.RefObject<HTMLDivElement>,
    ) => {
      e.stopPropagation();
      e.preventDefault();
      const initialX = e.clientX;

      const handleMouseMove = (ev: MouseEvent) => {
        if (!elementRef.current) return;
        const deltaTime = positionToTime(ev.clientX - initialX);
        let newStart = initialStart;
        let newEnd = initialEnd;

        if (isStart) {
          newStart = clamp(
            initialStart + deltaTime,
            0,
            initialEnd - MIN_DURATION,
          );
        } else {
          newEnd = clamp(
            initialEnd + deltaTime,
            initialStart + MIN_DURATION,
            sceneDuration,
          );
        }

        // Update visual feedback
        elementRef.current.style.left = `${timeToPosition(newStart)}px`;
        elementRef.current.style.width = `${timeToPosition(newEnd - newStart)}px`;
      };

      const handleMouseUp = () => {
        if (!elementRef.current) return;
        const newStart = positionToTime(
          parseFloat(elementRef.current.style.left),
        );
        const newWidth = positionToTime(
          parseFloat(elementRef.current.style.width),
        );
        onResize(newStart, newWidth);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [
      initialStart,
      initialEnd,
      sceneDuration,
      onResize,
      positionToTime,
      timeToPosition,
    ],
  );

  return { startResize };
}
