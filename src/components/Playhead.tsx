import { useRef } from "react";
import useStore from "@/store/useStore";
import useTimelinePosition from "@/hooks/useTImelinePosition";

export default function Playhead() {
  const containerRef = useStore((state) => state.containerRef);
  const currentTime = useStore((state) => state.currentTime);
  const { timeToPosition, positionToTime } = useTimelinePosition();
  const isDragging = useRef(false);

  const handleDrag = (e: React.MouseEvent) => {
    if (!containerRef || !containerRef.current) return;
    e.preventDefault();
    isDragging.current = true;

    const containerRect = containerRef.current.getBoundingClientRect();

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;

      const newTime = positionToTime(
        containerRef.current.scrollLeft + e.clientX - containerRect.left,
      );

      useStore.getState().setCurrentTime(newTime);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className="absolute z-10 h-full top-0 -left-[5px] after:bg-[#FFAA00]  after:absolute after:top-[10px] after:left-[4px] after:h-[calc(100%-10px)] after:w-[2px] hover:cursor-ew-resize"
      style={{
        translate: `${timeToPosition(currentTime)}px`,
      }}
      onMouseDown={handleDrag}
    >
      <div className="size-[10px] bg-[#FFAA00]"></div>
    </div>
  );
}
