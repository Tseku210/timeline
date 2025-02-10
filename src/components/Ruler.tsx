import { formatSecondsToString, timeToPx } from "../lib/timeline";
import { useMemo } from "react";
import { BASE_PPS, INTERVALS } from "../constants/scale";
import useStore from "@/store/useStore";
import useTimelinePosition from "@/hooks/useTImelinePosition";

interface RulerProps {
  height?: number;
  zoom?: number;
}

export default function Ruler({ height = 40 }: RulerProps) {
  const totalDuration = useStore((state) => state.totalDuration);
  const pps = useStore((state) => state.pps);
  const { positionToTime } = useTimelinePosition();

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = e.clientX - rect.left;
    useStore.getState().setCurrentTime(positionToTime(position));
  };

  // TODO: (tseku) not satisfied with this result. Currently, when zooming in and out the transition doesn't look good IMO.
  const markers = useMemo(() => {
    const markers = [];
    const endTime = totalDuration;
    const targetInterval = BASE_PPS / pps;
    const chosenInterval =
      INTERVALS.findLast((val) => val <= targetInterval) || INTERVALS[0];

    for (let time = 0; time <= endTime; time += chosenInterval) {
      const position = timeToPx(time, pps);
      markers.push(
        <Marker key={time} time={time} position={position} isLong />,
      );

      // Short markers (5 segments between long markers)
      const shortMarkerInterval = chosenInterval / 6; // 5 segments = 6 parts
      for (let i = 1; i <= 5; i++) {
        const shortTime = time + i * shortMarkerInterval;
        const shortPosition = timeToPx(shortTime, pps);
        markers.push(
          <Marker key={shortTime} time={shortTime} position={shortPosition} />,
        );
      }
    }

    return markers;
  }, [pps, totalDuration]);

  return (
    <div
      className="relative w-full bg-gray-100 cursor-pointer"
      style={{
        height: `${height}px`,
        width: `${totalDuration * pps}px`,
      }}
      onClick={handleScrub}
    >
      {markers}
    </div>
  );
}

const Marker = ({
  time,
  position,
  isLong = false,
}: {
  time: number;
  position: number;
  isLong?: boolean;
}) => {
  return (
    <div
      className={`absolute ${isLong ? "h-5" : "h-2"} w-px bg-gray-400 transition-transform`}
      style={{ translate: `${position}px` }}
    >
      {isLong && (
        <span className="absolute top-0 transform -translate-x-1/2 text-xs text-gray-600">
          {formatSecondsToString(time)}
        </span>
      )}
    </div>
  );
};
