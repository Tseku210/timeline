import {
  attachClosestEdge,
  extractClosestEdge,
  Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { DraggableState, idleState, draggingState } from "@/types/dnd";
import { useCallback, useEffect, useRef, useState } from "react";
import { reorder } from "@/lib/timeline";
import invariant from "tiny-invariant";
import { clamp } from "@/lib/utils";

type Identifiable<T = unknown> = T & { id: string; index: number };

interface UseDndProps<T> {
  axis: "horizontal" | "vertical";
  initialData: Identifiable<T>;
  items: Array<Identifiable<T>>;
  startPosition: number;
  container: React.RefObject<HTMLDivElement | null> | null;
  onReorder: (orderedItems: Array<Identifiable<T>>) => void;
  onDragDrop: (x: number) => void;
  min?: number;
  max?: number;
}

export default function useDnd<T>({
  axis = "vertical",
  items = [],
  initialData,
  container,
  startPosition,
  onReorder,
  onDragDrop,
  min,
  max,
}: UseDndProps<T>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const [draggableState, setDraggableState] =
    useState<DraggableState>(idleState);
  const dragOffsetRef = useRef<number | null>(null);

  const reorderItem = useCallback(
    ({
      startIndex,
      indexOfTarget,
      closestEdgeOfTarget,
    }: {
      startIndex: number;
      indexOfTarget: number;
      closestEdgeOfTarget: Edge | null;
    }) => {
      const finishIndex = getReorderDestinationIndex({
        startIndex,
        closestEdgeOfTarget,
        indexOfTarget,
        axis: axis,
      });

      if (finishIndex === startIndex) {
        // If there would be no change, we skip the update
        return;
      }

      const reorderedItems = reorder({
        list: items,
        startIndex,
        finishIndex,
      });

      return reorderedItems.map((item, i) => ({ ...item, index: i }));
    },
    [axis, items],
  );

  useEffect(() => {
    invariant(ref.current);

    return combine(
      draggable({
        element: ref.current,
        getInitialData: () => {
          invariant(initialData.id, "Initial data must have an id");
          return initialData;
        },
        onDragStart() {
          setDraggableState(draggingState);
          dragOffsetRef.current = null;
        },
        onDrag({ location }) {
          invariant(ref.current, "ref cannot be null");
          invariant(container, "container must not be null for dragging");
          invariant(
            container.current,
            "container must not be null for dragging",
          );

          const clientX = location.current.input.clientX;
          const elementRect = ref.current.getBoundingClientRect();
          const containerRect = container.current.getBoundingClientRect();

          if (dragOffsetRef.current === null) {
            dragOffsetRef.current =
              clientX -
              elementRect.left +
              containerRect.left -
              container.current.scrollLeft +
              startPosition;
          }

          let left = clientX - dragOffsetRef.current;

          if (typeof min === "number" && typeof max === "number") {
            left = clamp(left, min, max);
          }

          ref.current.style.left = `${left}px`;
        },
        onDrop() {
          setDraggableState(idleState);
          dragOffsetRef.current = null;
          invariant(ref.current);
          onDragDrop(parseFloat(ref.current.style.left));
        },
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            render({ container }) {
              setDraggableState({ type: "preview", container });

              return () => setDraggableState(draggingState);
            },
          });
        },
      }),

      dropTargetForElements({
        element: ref.current,
        getData: (args) =>
          attachClosestEdge(
            { initialData },
            {
              input: args.input,
              element: args.element,
              allowedEdges:
                axis === "horizontal" ? ["left", "right"] : ["top", "bottom"],
            },
          ),
        getDropEffect: () => "move",
        onDrag: (args) => {
          const isSource = args.source.element === ref.current;
          setClosestEdge(isSource ? null : extractClosestEdge(args.self.data));
        },
        onDragLeave() {
          setClosestEdge(null);
        },
        onDrop({ location, source }) {
          setClosestEdge(null);

          const target = location.current.dropTargets[0];
          if (!target) {
            return;
          }

          const sourceData = source.data as Identifiable<T>;
          const targetData = target.data.initialData as Identifiable<T>;

          const indexOfTarget = items.findIndex(
            (item) => item.id === targetData.id,
          );
          if (indexOfTarget < 0) return;

          const closestEdgeOfTarget = extractClosestEdge(target.data);

          const reorderedItems = reorderItem({
            startIndex: sourceData.index,
            indexOfTarget,
            closestEdgeOfTarget,
          });

          if (!reorderedItems) return;

          onReorder(reorderedItems);
        },
      }),
    );
  }, [
    axis,
    container,
    initialData,
    items,
    max,
    min,
    onDragDrop,
    onReorder,
    reorderItem,
    startPosition,
  ]);

  return {
    ref,
    closestEdge,
    draggableState,
    reorderItem,
  };
}
