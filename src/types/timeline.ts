export interface Scene {
  id: string;
  background: SceneBackground;
  index: number;
  transition?: Transition;
  elements: Element[];
  timeline: Timeline;
}

export interface SceneBackground {
  type: "image" | "color" | "video";
  src?: string;
  color?: string;
}

export interface Transition {
  keyframes: object;
}

export interface Element {
  id: string;
  sceneId: string;
  index: number;
  timeline: Timeline;
}

export interface Timeline {
  startTime: number;
  duration: number;
}
