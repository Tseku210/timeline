import { useRef, useState } from "react";
import useStore from "@/store/useStore";
import TimelineTimeIndicator from "./TimelineTimeIndicator";
import useTimelinePosition from "@/hooks/useTImelinePosition";
import SceneItemsList from "./SceneItemsList";
import ScenesList from "./ScenesList";
import useDNDMonitor from "@/hooks/useDNDMonitor";
import SceneItemsDNDList from "./SceneItemsDNDLIst";

export default function Scenes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalDuration = useStore((state) => state.totalDuration);
  const viewportWidth = useStore((state) => state.viewportWidth);
  const pps = useStore((state) => state.pps);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const { positionToTime } = useTimelinePosition();
  useDNDMonitor();

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
      className="h-96 w-full relative"
      style={{
        width: `${Math.max(viewportWidth, totalDuration * pps)}px`, // TODO: should be abstracted.
      }}
      onMouseMove={handleMoveIndicator}
      onMouseLeave={handleLeaveIndicator}
      onClick={handleTimePosition}
    >
      <TimelineTimeIndicator position={hoverPosition} />
      <ScenesList />
      <SceneItemsList />
      {/* <SceneItemsDNDList /> */}

      {/* Avatars */}

      {/* Scripts */}
    </div>
  );
}
