import Ruler from "./Ruler";
import Controls from "./Controls";
import useResizeObserver from "../hooks/useResizeObserver";
import { useEffect, useRef } from "react";
import useStore from "../store/useStore";
import Scenes from "./Scenes";
import Playhead from "./Playhead";
import SceneControls from "./SceneControls";

export default function Timeline() {
  // NOTE: using useMultiStore hook is no longer good choice. It's not production ready, plus it's not working as expected. Needs testing.
  const ref = useRef<HTMLDivElement | null>(null);
  const { width } = useResizeObserver(ref);

  useEffect(() => {
    if (width) useStore.getState().setViewportWidth(width);
  }, [width]);

  useEffect(() => {
    if (!ref.current) return;
    useStore.getState().setContainerRef(ref);
  }, [ref]);

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "f") {
        console.log("Scenes: ", useStore.getState().scenes);
      }
    };
    document.addEventListener("keydown", onKeydown);

    return () => document.removeEventListener("keydown", onKeydown);
  }, []);

  return (
    //TODO: add resize functionality using shadcn ref(https://github.com/bvaughn/react-resizable-panels)
    <div className="w-full bg-slate-200 min-h-96">
      <Controls />
      <div
        ref={ref}
        className="w-full overflow-x-scroll relative overflow-auto h-full"
      >
        <Ruler />
        <Playhead />
        <Scenes />
      </div>
      <SceneControls />
    </div>
  );
}
