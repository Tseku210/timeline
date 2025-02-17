interface TimelineZoom {
  zoom: number;
  unit: number;
  segments: number;
}

export const BASE_UNIT = 60;

export const TIMELINE_ZOOM_LEVELS: TimelineZoom[] = [
  {
    zoom: 1,
    unit: BASE_UNIT,
    segments: 5,
  },
  {
    zoom: 0.25,
    unit: BASE_UNIT,
    segments: 5,
  },
  {
    zoom: 0.5,
    unit: BASE_UNIT,
    segments: 5,
  },
];

interface Zoom {
  id: string;
  pxPerMs: number;
  segments: number;
}
// const h = {
//   unit: 1000,
//   unitSize:
//   segments: 5,
// }
//

export const DEFAULT_UNIT_PX = 100;

export const ZOOM_LEVELS: Zoom[] = [
  {
    id: "5s",
    pxPerMs: DEFAULT_UNIT_PX / 5000,
    segments: 5,
  },
  {
    id: "2s",
    pxPerMs: DEFAULT_UNIT_PX / 2000,
    segments: 5,
  },
  {
    id: "1s",
    pxPerMs: DEFAULT_UNIT_PX / 1000,
    segments: 5,
  },
  {
    id: "500ms",
    pxPerMs: DEFAULT_UNIT_PX / 500,
    segments: 5,
  },
  {
    id: "100ms",
    pxPerMs: DEFAULT_UNIT_PX / 100,
    segments: 5,
  },
];

export const BASE_PPS = 100;
export const BASE_ZOOM_INDEX = 3;
export const ZOOM = [0.1, 0.2, 0.5, 1, 2, 5, 10];
export const INTERVALS = [1, 2, 5, 10, 15, 30, 60];
export const DEFAULT_SCENE_DURATION = 10;
export const TIMELINE_PADDING = 16;
