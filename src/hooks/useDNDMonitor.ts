import { useEffect } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

export default function useDNDMonitor() {
  useEffect(() => {
    return monitorForElements({
      onDragStart: ({ source }) => console.debug("On drag start", source),
      // onDrag: ({ source, location }) =>
      //   console.debug("On drag", { source, location }),
      onDrop: ({ source, location }) =>
        console.debug("On drop", { source, location }),
      onDropTargetChange: ({ source, location }) =>
        console.debug("On drop target change", { source, location }),
      onGenerateDragPreview: ({ source, location }) =>
        console.debug("On generate drag preview", { source, location }),
    });
  }, []);

  return {};
}
