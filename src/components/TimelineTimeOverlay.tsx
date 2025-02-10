import useStore from "@/store/useStore";
import { useState } from "react";

export default function TimelineTimeOverlay() {
  const containerRef = useStore((state) => state.containerRef);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef?.current) return;
    const boundingRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - boundingRect.left;
    setHoverPosition(x);
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Temporarily disable the overlay's pointer events if needed.
    // Get the element directly beneath the cursor.
    const underlyingEl = document.elementFromPoint(e.clientX, e.clientY);
    if (underlyingEl) {
      // Create a new click event based on the original event.
      const newEvent = new MouseEvent("click", e.nativeEvent);
      underlyingEl.dispatchEvent(newEvent);
    }
  };

  return (
    <div
      className="absolute select-none size-full top-0 left-0"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {hoverPosition !== null && (
        <div
          className="absolute h-full top-0 bottom-0 w-[2px] bg-red-500"
          style={{ left: `${hoverPosition}px` }}
        />
      )}
    </div>
  );
}
