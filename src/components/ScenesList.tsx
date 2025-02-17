import { memo } from "react";
import Scene from "./Scene";
import useStore from "@/store/useStore";

function ScenesList() {
  const scenes = useStore((state) => state.scenes);
  return (
    <div className="flex">
      {scenes.map((scene, index) => (
        <Scene key={scene.id} scene={scene} isFirstScene={index === 0} />
      ))}
    </div>
  );
}

export default memo(ScenesList);
