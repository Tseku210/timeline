export type DraggableState =
  | { type: "idle" }
  | { type: "preview"; container: HTMLElement }
  | { type: "dragging" };

export const idleState: DraggableState = { type: "idle" };
export const draggingState: DraggableState = { type: "dragging" };
