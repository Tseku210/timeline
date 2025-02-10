import useStore from "@/store/useStore";
import type { Scene } from "@/types/timeline";
import SceneItem from "./SceneItem";
import { memo } from "react";

interface SceneProps {
  scene: Scene;
}
function Scene({ scene }: SceneProps) {
  const { id, elements } = scene;
  const selectedScene = useStore((state) => state.selectedScene);
  const selectScene = useStore((state) => state.setSelectedSceneById);

  return (
    <>
      {elements.map((element) => (
        <SceneItem key={element.id} element={element} />
      ))}
      <div
        className="h-24 rounded-xl w-full border-yellow-200 bg-yellow-100"
        onClick={() => selectScene(id)}
      >
        {selectedScene && "im selected"}
      </div>
    </>
  );
}

export default memo(Scene);
