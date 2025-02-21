import { Element, Scene } from "@/types/timeline";
import ResizeMarker from "./ResizeMarker";
import { memo } from "react";
import { cn } from "@/lib/utils";
import useStore from "@/store/useStore";
import useTimelinePosition from "@/hooks/useTImelinePosition";
import useDnd from "@/hooks/useDnd";
import DropIndicator from "./dnd/DropIndicator";
import { createPortal } from "react-dom";
import useResize from "@/hooks/useResizeItem";

interface SceneItemProps {
  scene: Scene;
  element: Element;
}

const SceneItem = ({ scene, element }: SceneItemProps) => {
  const { id, timeline } = element;
  const { timeline: sceneTimeline } = scene;
  const selectedElementIds = useStore((state) => state.selectedElementIds);
  const containerRef = useStore((state) => state.containerRef);
  const selectElements = useStore((state) => state.selectElements);
  const updateElement = useStore((state) => state.updateElement);
  const updateSceneElements = useStore((state) => state.updateSceneElements);
  const { timeToPosition, positionToTime } = useTimelinePosition();

  // NOTE: the startTime and duration are calculated relative to scene timeline
  const startTime = timeline.startTime - sceneTimeline.startTime;
  const duration = timeline.duration;

  const left = timeToPosition(startTime);
  const width = timeToPosition(duration);

  const {
    ref: elementRef,
    draggableState,
    closestEdge,
  } = useDnd({
    axis: "vertical",
    items: scene.elements,
    initialData: element,
    startPosition: timeToPosition(sceneTimeline.startTime),
    container: containerRef,
    onReorder: (orderedElements) =>
      updateSceneElements(scene.id, orderedElements),
    onDragDrop: (x) =>
      updateElement(scene.id, element.id, {
        timeline: {
          startTime: positionToTime(x) + sceneTimeline.startTime,
          duration: timeline.duration,
        },
      }),
    min: 0,
    max: timeToPosition(scene.timeline.duration) - width,
  });

  const { startResize } = useResize({
    initialStart: startTime,
    initialEnd: startTime + duration,
    sceneDuration: scene.timeline.duration,
    onResize: (newStart, newDuration) =>
      updateElement(scene.id, element.id, {
        timeline: {
          startTime: scene.timeline.startTime + newStart,
          duration: newDuration,
        },
      }),
  });

  const onSelectElement = () => {
    if (selectedElementIds.includes(id)) return;
    selectElements([id]);
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        "bg-orange-500 px-4 py-2 overflow-clip relative rounded-xl group transition-none",
        selectedElementIds.includes(id) && "outline-2 outline-blue-500",
        draggableState.type === "dragging" && "border-dashed bg-orange-200",
      )}
      style={{ left: `${left}px`, width: `${width}px` }}
      onClick={onSelectElement}
    >
      <div>{element.id}</div>
      <ResizeMarker
        isStart
        disabled={selectedElementIds.length > 1}
        onMouseDown={(e) => startResize(e, true, elementRef)}
      />
      <ResizeMarker
        disabled={selectedElementIds.length > 1}
        onMouseDown={(e) => startResize(e, false, elementRef)}
      />
      {closestEdge && <DropIndicator edge={closestEdge} gap="8px" />}
      {draggableState.type === "preview" &&
        createPortal(<div>{element.id}</div>, draggableState.container)}
    </div>
  );
};

export default memo(SceneItem);
