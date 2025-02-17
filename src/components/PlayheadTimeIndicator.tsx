import { formatSecondsToString } from "@/lib/timeline";
import { createPortal } from "react-dom";

interface Props {
  isDragging: boolean;
  position: number;
  time: number;
}

export default function PlayheadTimeIndicator({
  isDragging,
  position,
  time,
}: Props) {
  if (!isDragging) return null;

  {
    /* NOTE: the positioning is tightly coupled with `Controls` componenent's height */
  }
  return createPortal(
    <span
      className="absolute top-12 z-10 bg-[#FFAA00] px-2 py-1 rounded-full text-xs"
      style={{
        left: `${position}px`,
        transform: "translateX(-50%) translateY(-10px)",
      }}
    >
      {formatSecondsToString(time, "MM:SS:MS")}
    </span>,
    document.getElementById("container")!,
  );
}
