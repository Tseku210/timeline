import { useState } from "react";
import ResizeMarker from "./ResizeMarker";

export default function ResizeableItem() {
  const [width, setWidth] = useState(100);

  const handleDrag = (
    e: React.MouseEvent<HTMLDivElement>,
    isStart: boolean,
  ) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (ev: MouseEvent) => {
      const deltaX = ev.clientX - startX;
      const newWidth = isStart ? startWidth - deltaX : startWidth + deltaX;
      setWidth(Math.max(100, newWidth));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className="bg-orange-500 absolute px-5 py-2 rounded-xl group"
      style={{ width: `${width}px` }}
      draggable
    >
      <div>hello</div>
      <ResizeMarker isStart onMouseDown={(e) => handleDrag(e, true)} />
      <ResizeMarker onMouseDown={(e) => handleDrag(e, false)} />
    </div>
  );
}
