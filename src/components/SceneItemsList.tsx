import useStore from "@/store/useStore";
import { memo } from "react";
import SceneItem from "./SceneItem";
import useTimelinePosition from "@/hooks/useTImelinePosition";

function SceneItemsList() {
  const scenes = useStore((state) => state.scenes);
  const { timeToPosition } = useTimelinePosition();

  return (
    <div className="flex">
      {scenes.map((scene) => (
        <div
          key={scene.id}
          className="flex relative flex-col gap-2"
          style={{
            width: `${timeToPosition(scene.timeline.duration)}px`,
          }}
        >
          {scene.elements.map((element) => (
            <SceneItem key={element.id} scene={scene} element={element} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default memo(SceneItemsList);
