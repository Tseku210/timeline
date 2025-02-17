import useTimelinePosition from "@/hooks/useTImelinePosition";
import { clamp, cn } from "@/lib/utils";
import useStore from "@/store/useStore";
import type { Scene } from "@/types/timeline";
import { memo, useRef, useState } from "react";
import ResizeMarker from "./ResizeMarker";

const MIN_DURATION = 1;

interface SceneProps {
  scene: Scene;
  isFirstScene?: boolean;
}

function Scene({ scene, isFirstScene = false }: SceneProps) {
  const { id, timeline } = scene;
  const sceneRef = useRef<HTMLDivElement>(null);
  const selectedSceneId = useStore((state) => state.selectedSceneId);
  const selectScene = useStore((state) => state.setSelectedSceneById);
  const updateScene = useStore((state) => state.updateScene);
  const [isDragging, setIsDragging] = useState(false);
  const { timeToPosition, positionToTime } = useTimelinePosition();

  const width = timeToPosition(timeline.duration);

  const handleDrag = (
    e: React.MouseEvent<HTMLDivElement>,
    isStart: boolean,
  ) => {
    e.preventDefault();
    const initialX = e.clientX;
    const initialStart = timeline.startTime;
    const initialEnd = timeline.duration + timeline.startTime;

    const handleMouseMove = (ev: MouseEvent) => {
      if (!sceneRef.current) return;
      setIsDragging(true);
      const deltaTime = positionToTime(ev.clientX - initialX);

      if (isStart) {
        if (isFirstScene) return;
        const newStart = clamp(
          initialStart + deltaTime,
          0,
          initialEnd - MIN_DURATION,
        );
        sceneRef.current.style.left = `${timeToPosition(newStart)}px`;
        sceneRef.current.style.width = `${timeToPosition(initialEnd - newStart)}px`;
      } else {
        const newEnd = clamp(
          initialEnd + deltaTime,
          initialStart + MIN_DURATION,
          Infinity,
        );
        sceneRef.current.style.width = `${timeToPosition(newEnd - initialStart)}px`;
      }
    };

    const handleMouseUp = () => {
      if (!sceneRef.current) return;
      const newDuration = positionToTime(
        parseFloat(sceneRef.current.style.width),
      );

      updateScene(id, {
        timeline: {
          startTime: timeline.startTime,
          duration: newDuration,
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
      ref={sceneRef}
      className={cn(
        "h-24 rounded-xl w-full border-yellow-200 group transition-all relative bg-yellow-100",
        selectedSceneId === id && "border-2 border-blue-500",
        isDragging && "transition-none",
      )}
      style={{ width: `${width}px` }}
      onClick={() => selectScene(id)}
    >
      <div>content</div>
      <ResizeMarker onMouseDown={(e) => handleDrag(e, false)} />
    </div>
  );
}

export default memo(Scene);
