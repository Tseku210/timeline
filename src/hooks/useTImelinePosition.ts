import { pxToTime, timeToPx } from "@/lib/timeline";
import useStore from "@/store/useStore";
import { useCallback } from "react";

export default function useTimelinePosition() {
  const pps = useStore((state) => state.pps);
  const timeToPosition = useCallback(
    (time: number) => timeToPx(time, pps),
    [pps],
  );
  const positionToTime = useCallback(
    (px: number) => {
      useStore.getState().pause();
      return pxToTime(px, pps);
    },
    [pps],
  );

  return { timeToPosition, positionToTime };
}
