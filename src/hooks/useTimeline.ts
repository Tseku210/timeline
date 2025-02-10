import { ZOOM } from "../constants/scale";
import useStore from "../store/useStore";

export default function useTimeline() {
  const zoomLevel = useStore((state) => state.zoomLevel);

  const canZoomIn = zoomLevel < ZOOM.length - 1;
  const canZoomOut = zoomLevel > 0;

  return {
    canZoomIn,
    canZoomOut,
  };
}
