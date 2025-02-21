import { type Scene, type Element } from "@/types/timeline";
import { cn } from "@/lib/utils";
import DropIndicator from "./dnd/DropIndicator";
import { createPortal } from "react-dom";
import useStore from "@/store/useStore";
import useDnd from "@/hooks/useDnd";

interface SceneItemProps {
  scene: Scene;
  element: Element;
}

function SceneItemDND({ scene, element }: SceneItemProps) {
  const updateElements = useStore((state) => state.updateSceneElements);
  const {
    ref: itemRef,
    closestEdge,
    draggableState,
  } = useDnd({
    axis: "vertical",
    items: scene.elements,
    initialData: element,
    onReorder: (orderedItems) => updateElements(scene.id, orderedItems),
    onDrag: () => {},
  });

  return (
    <div
      ref={itemRef}
      className={cn(
        "p-2 my-2 bg-orange-500 relative rounded-xl border border-orange-500",
        draggableState.type === "dragging" && "border-dashed bg-orange-200",
      )}
    >
      {element.id}
      {closestEdge && <DropIndicator edge={closestEdge} gap="8px" />}
      {draggableState.type === "preview" &&
        createPortal(<div>{element.id}</div>, draggableState.container)}
    </div>
  );
}

export default SceneItemDND;
