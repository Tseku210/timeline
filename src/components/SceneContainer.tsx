import { memo } from "react";
import Scene from "./Scene";

interface SceneContainerProps {
  scene: Scene;
  isFirstScene?: boolean;
}
function SceneContainer({ scene, isFirstScene = false }: SceneContainerProps) {
  return (
    <div className="space-y-2">
      <Scene scene={scene} isFirstScene={isFirstScene} />
    </div>
  );
}

export default memo(SceneContainer);
