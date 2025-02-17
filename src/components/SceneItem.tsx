import { Element, Scene } from "@/types/timeline";
import ResizeMarker from "./ResizeMarker";
import { forwardRef, memo, useRef } from "react";
import { clamp, cn } from "@/lib/utils";
import useStore from "@/store/useStore";
import useTimelinePosition from "@/hooks/useTImelinePosition";
import { IItemProps } from "react-movable";

const MIN_DURATION = 1;

interface SceneItemProps {
  scene: Scene;
  element: Element;
}

const SceneItem = forwardRef(
  (
    { scene, element, ...props }: SceneItemProps & IItemProps,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const { id, timeline } = element;
    const { timeline: sceneTimeline } = scene;
    const selectedElementIds = useStore((state) => state.selectedElementIds);
    const selectElements = useStore((state) => state.selectElements);
    const updateElement = useStore((state) => state.updateElement);
    const { timeToPosition, positionToTime } = useTimelinePosition();
    const elementRef = useRef<HTMLDivElement>(null);

    // NOTE: the startTime and duration are calculated relative to scene timeline
    const startTime = timeline.startTime - sceneTimeline.startTime;
    const duration = timeline.duration;

    const left = timeToPosition(startTime);
    const width = timeToPosition(duration);

    const onSelectElement = () => {
      if (selectedElementIds.includes(id)) return;
      selectElements([id]);
    };

    const handleDrag = (
      e: React.MouseEvent<HTMLDivElement>,
      isStart: boolean,
    ) => {
      e.stopPropagation();
      e.preventDefault();
      const initialX = e.clientX;
      const initialStart = startTime;
      const initialEnd = duration + startTime;

      const handleMouseMove = (ev: MouseEvent) => {
        if (!elementRef.current) return;
        const deltaTime = positionToTime(ev.clientX - initialX);

        if (isStart) {
          const newStart = clamp(
            initialStart + deltaTime,
            0,
            initialEnd - MIN_DURATION,
          );
          elementRef.current.style.left = `${timeToPosition(newStart)}px`;
          elementRef.current.style.width = `${timeToPosition(initialEnd - newStart)}px`;
        } else {
          const newEnd = clamp(
            initialEnd + deltaTime,
            initialStart + MIN_DURATION,
            sceneTimeline.duration,
          );
          elementRef.current.style.width = `${timeToPosition(newEnd - initialStart)}px`;
        }
      };

      const handleMouseUp = () => {
        if (!elementRef.current) return;
        const newStartTime = positionToTime(
          parseFloat(elementRef.current.style.left),
        );
        const newDuration = positionToTime(
          parseFloat(elementRef.current.style.width),
        );

        // NOTE: how to handle updating multiple selected elements? Heygen doesn't  support multiple timeline update it shows as a group type on the timline
        updateElement(id, {
          timeline: {
            startTime: sceneTimeline.startTime + newStartTime,
            duration: newDuration,
          },
        });

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    return (
      <div className="my-2 w-fit" {...props} ref={ref}>
        <div
          ref={elementRef}
          className={cn(
            "bg-orange-500 px-5 py-2 relative rounded-xl group transition-none",
            selectedElementIds.includes(id) && "outline-2 outline-blue-500",
          )}
          style={{ left: `${left}px`, width: `${width}px` }}
          onClick={onSelectElement}
        >
          <div>hello</div>
          <ResizeMarker
            isStart
            disabled={selectedElementIds.length > 1}
            onMouseDown={(e) => handleDrag(e, true)}
          />
          <ResizeMarker
            disabled={selectedElementIds.length > 1}
            onMouseDown={(e) => handleDrag(e, false)}
          />
        </div>
      </div>
    );
  },
);

SceneItem.displayName = "SceneItem";
export default memo(SceneItem);
