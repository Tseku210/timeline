import { useCallback, useRef } from "react";
import useTimelinePosition from "./useTImelinePosition";

export default function useMove({
  initialStart,
  onMoveCommit,
}: {
  initialStart: number;
  onMoveCommit: (newStart: number) => void;
}) {
  const { timeToPosition, positionToTime } = useTimelinePosition();
  const initialXRef = useRef<number>(0);
  const initialStartRef = useRef<number>(initialStart);

  const handleMoveStart = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement>,
      elementRef: React.RefObject<HTMLDivElement>,
    ) => {
      e.preventDefault();
      initialXRef.current = e.clientX;
      // Save the current starting time
      initialStartRef.current = initialStart;

      const handleMouseMove = (ev: MouseEvent) => {
        if (!elementRef.current) return;
        // Calculate how much time has changed based on the horizontal delta
        const deltaTime = positionToTime(ev.clientX - initialXRef.current);
        const newStart = initialStartRef.current + deltaTime;
        // Update the element's style for immediate feedback
        elementRef.current.style.left = `${timeToPosition(newStart)}px`;
      };

      const handleMouseUp = (ev: MouseEvent) => {
        if (!elementRef.current) return;
        const deltaTime = positionToTime(ev.clientX - initialXRef.current);
        const newStart = initialStartRef.current + deltaTime;
        onMoveCommit(newStart);

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [initialStart, onMoveCommit, positionToTime, timeToPosition],
  );

  return { handleMoveStart };
}
