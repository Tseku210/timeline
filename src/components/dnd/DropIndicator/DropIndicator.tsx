import { cn } from "@/lib/utils";
import { DropIndicatorProps } from "./type";

const terminalSize = 8;
const lineThickness = 2;
const lineColor = "bg-blue-500";

const edgeToOrientationMap = {
  top: "horizontal",
  bottom: "horizontal",
  left: "vertical",
  right: "vertical",
};

const DropIndicator = ({ edge, gap = "0px" }: DropIndicatorProps) => {
  const orientation = edgeToOrientationMap[edge];
  const offsetToAlignTerminalWithLine = (lineThickness - terminalSize) / 2;
  const lineOffset = `calc(-0.5 * (${gap} + ${lineThickness}px))`;

  return (
    <div
      className={cn(
        "absolute z-20 pointer-events-none",
        lineColor,
        orientation === "horizontal"
          ? `h-[${lineThickness}px] w-full left-4 right-0`
          : `w-[${lineThickness}px] top-4 bottom-0`,
      )}
      style={{ [edge]: lineOffset }}
    >
      <div
        className={`absolute box-border rounded-full ${lineColor}`}
        style={{
          width: terminalSize,
          height: terminalSize,
          border: `${lineThickness}px solid`,
          [orientation === "horizontal" ? "left" : "top"]: -terminalSize,
          [edge]: offsetToAlignTerminalWithLine,
        }}
      />
    </div>
  );
};

export default DropIndicator;
