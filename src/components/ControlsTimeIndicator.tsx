import { formatSecondsToString } from "@/lib/timeline";
import useStore from "@/store/useStore";

export default function ControlsTimeIndicator() {
  const currentTime = useStore((state) => state.currentTime);
  const totalDuration = useStore((state) => state.totalDuration);
  return (
    <span>{`${formatSecondsToString(currentTime)}/${formatSecondsToString(totalDuration)}`}</span>
  );
}
