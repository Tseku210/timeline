import { Element } from "@/types/timeline";
import ResizeMarker from "./ResizeMarker";
import { useEffect, useRef, useState } from "react";
import { clamp, cn } from "@/lib/utils";
import useStore from "@/store/useStore";
import useTimelinePosition from "@/hooks/useTImelinePosition";

const MIN_DURATION = 1;

interface SceneItemProps {
  element: Element;
}

export default function SceneItem({ element }: SceneItemProps) {
  const { id, timeline } = element;
  const selectedElement = useStore((state) => state.selectedElement);
  const totalDuration = useStore((state) => state.totalDuration);
  const setSelectedElement = useStore((state) => state.setSelectedElement);
  const updateSelectedItemById = useStore(
    (state) => state.updateSelectedItemById,
  );
  const { timeToPosition, positionToTime } = useTimelinePosition();
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // initialize element sizing and update further changes to the element
  useEffect(() => {
    if (!elementRef || !elementRef.current) return;
    elementRef.current.style.left = `${timeToPosition(timeline.startTime)}px`;
    elementRef.current.style.width = `${timeToPosition(timeline.duration)}px`;
  }, [elementRef, timeToPosition, timeline.duration, timeline.startTime]);

  const onSelectElement = () => {
    if (selectedElement && selectedElement.id === id) return;
    setSelectedElement(element);
  };

  const handleDrag = (
    e: React.MouseEvent<HTMLDivElement>,
    isStart: boolean,
  ) => {
    e.preventDefault();
    const initialX = e.clientX;
    const initialStart = timeline.startTime;
    const initialEnd = timeline.duration + timeline.startTime;

    const handleMouseMove = (ev: MouseEvent) => {
      if (!elementRef.current) return;
      setIsDragging(true);
      const deltaTime = positionToTime(ev.clientX - initialX);

      if (isStart) {
        const newStart = clamp(
          initialStart + deltaTime,
          0,
          initialEnd - MIN_DURATION,
        );
        const newWidth = initialEnd - newStart;
        elementRef.current.style.left = `${timeToPosition(newStart)}px`;
        elementRef.current.style.width = `${timeToPosition(newWidth)}px`;
      } else {
        const newEnd = clamp(
          initialEnd + deltaTime,
          initialStart + MIN_DURATION,
          totalDuration,
        );
        const newWidth = newEnd - initialStart;
        elementRef.current.style.width = `${timeToPosition(newWidth)}px`;
      }
    };

    const handleMouseUp = () => {
      if (!elementRef.current) return;
      const finalStart = positionToTime(
        parseFloat(elementRef.current.style.left),
      );
      const finalWidth = positionToTime(
        parseFloat(elementRef.current.style.width),
      );
      updateSelectedItemById(id, {
        timeline: {
          startTime: finalStart,
          duration: finalWidth,
        },
      });
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        "bg-orange-500 absolute px-5 py-2 rounded-xl group transition-all",
        selectedElement &&
          selectedElement.id === id &&
          "outline-2 outline-orange-900",
        isDragging && "transition-none",
      )}
      draggable
      onClick={onSelectElement}
    >
      <div>hello</div>
      <ResizeMarker isStart onMouseDown={(e) => handleDrag(e, true)} />
      <ResizeMarker onMouseDown={(e) => handleDrag(e, false)} />
    </div>
  );
}
