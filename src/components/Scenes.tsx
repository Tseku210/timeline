import useStore from "@/store/useStore";
import Scene from "./Scene";
import TimelineTimeIndicator from "./TimelineTimeIndicator";
import { useRef, useState } from "react";
import useTimelinePosition from "@/hooks/useTImelinePosition";

export default function Scenes() {
  const scenes = useStore((state) => state.scenes);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const { positionToTime } = useTimelinePosition();

  const handleMoveIndicator = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const boundingRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - boundingRect.left;
    setHoverPosition(x);
  };

  const handleLeaveIndicator = () => {
    setHoverPosition(null);
  };

  const handleTimePosition = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = e.clientX - rect.left;
    useStore.getState().setCurrentTime(positionToTime(position));
  };

  return (
    <div
      ref={containerRef}
      className="h-96 relative"
      onMouseMove={handleMoveIndicator}
      onMouseLeave={handleLeaveIndicator}
      onClick={handleTimePosition}
    >
      <TimelineTimeIndicator position={hoverPosition} />
      {/* Scenes */}
      {scenes.map((scene) => (
        <Scene key={scene.id} scene={scene} />
      ))}
      {/* Avatars */}
      {/* Scripts */}
    </div>
  );
}
