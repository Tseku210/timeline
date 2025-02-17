import useStore from "@/store/useStore";
import { memo } from "react";
import { List } from "react-movable";
import SceneItem from "./SceneItem";

function SceneItemsList() {
  const scenes = useStore((state) => state.scenes);
  const reorderElements = useStore((state) => state.reorderElements);
  return (
    <div className="flex">
      {scenes.map((scene) => (
        <List
          lockVertically
          transitionDuration={0}
          key={scene.id}
          values={scene.elements}
          onChange={({ oldIndex, newIndex }) =>
            reorderElements(oldIndex, newIndex)
          }
          renderList={({ children, props }) => (
            <div className="hello w-fit" {...props}>
              {children}
            </div>
          )}
          renderItem={({ value, props }) => (
            <SceneItem
              {...props}
              key={props.key}
              scene={scene}
              element={value}
            />
          )}
        />
      ))}
    </div>
  );
}

export default memo(SceneItemsList);
