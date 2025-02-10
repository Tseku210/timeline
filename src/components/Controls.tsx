import useTimeline from "@/hooks/useTimeline";
import useStore from "../store/useStore";
import { formatSecondsToString } from "@/lib/timeline";

export default function Controls() {
  const isPlaying = useStore((state) => state.isPlaying);
  const play = useStore((state) => state.play);
  const pause = useStore((state) => state.pause);
  const zoomIn = useStore((state) => state.zoomIn);
  const zoomOut = useStore((state) => state.zoomOut);
  const currentTime = useStore((state) => state.currentTime);
  const totalDuration = useStore((state) => state.totalDuration);
  const { canZoomIn, canZoomOut } = useTimeline();

  return (
    <div className="w-full grid grid-cols-3 place-items-center py-3">
      <div />
      <div className="flex items-center justify-center gap-0">
        <div className="space-x-2">
          <button>{"<<"}</button>
          <button onClick={isPlaying ? pause : play}>
            {isPlaying ? "||" : "|>"}
          </button>
          <button>{">>"}</button>
        </div>
        {/* TODO: maybe extract time depiction into a component for optimized rendering */}
        <span>{`${formatSecondsToString(currentTime)}/${formatSecondsToString(totalDuration)}`}</span>
      </div>
      <div className="space-x-2">
        <button
          className="disabled:!bg-gray-500"
          disabled={!canZoomIn}
          onClick={zoomIn}
        >
          +
        </button>
        <button
          className="disabled:!bg-gray-500"
          disabled={!canZoomOut}
          onClick={zoomOut}
        >
          -
        </button>
        {/* <button onClick={fit}>Fit</button> */}
      </div>
    </div>
  );
}
