import useStore from "@/store/useStore";
import SceneItemDND from "./SceneItemsDND";

function SceneItemsDNDList() {
  const scenes = useStore((state) => state.scenes);

  return (
    <div>
      {scenes.map((scene) =>
        scene.elements.map((element) => (
          <SceneItemDND key={element.id} scene={scene} element={element} />
        )),
      )}
    </div>
  );
}

export default SceneItemsDNDList;
