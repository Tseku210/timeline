import { create } from "zustand";
import {
  BASE_PPS,
  BASE_ZOOM_INDEX,
  DEFAULT_SCENE_DURATION,
  ZOOM,
} from "../constants/scale";
import { Element, Scene } from "@/types/timeline";
import { generateId } from "@/lib/utils";

interface TimelineState {
  containerRef: React.MutableRefObject<HTMLDivElement | null> | null;
  currentTime: number;
  pps: number;
  zoomLevel: number;
  viewportWidth: number;
  totalDuration: number;
  isPlaying: boolean;

  // Actions
  setContainerRef: (ref: React.RefObject<HTMLDivElement>) => void;
  setCurrentTime: (time: number) => void;
  setZoomLevel: (index: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setViewportWidth: (width: number) => void;
  play: () => void;
  pause: () => void;
  setScroll: (scroll: number) => void;

  // TODO: should separate into slice
  isExpandElements: boolean;
  toggleExpandElements: () => void;

  // scene related
  scenes: Scene[];
  selectedScene: Scene | null;
  setSelectedScene: (scene: Scene) => void;
  setSelectedSceneById: (id: string) => void;
  addEmptyScene: () => void;
  addScene: (scene: Partial<Scene>) => void;
  updateScene: (id: string, scene: Partial<Scene>) => void;
  removeScene: (id: string) => void;
  reorderScenes: (sourceIndex: number, destinationIndex: number) => void;

  // element related
  selectedElement: Element | null;
  elements: Element[];
  setSelectedElement: (element: Element) => void;
  setSelectedElementById: (id: string) => void;
  updateSelectedItemById: (id: string, element: Partial<Element>) => void;
  updateElement: (id: string, element: Partial<Element>) => void;
  addElementToScene: (sceneId: string, element: Element) => void;
  addElement: (element: Element) => void;
  addEmptyElement: () => void;
  reorderElements: (
    sceneId: string,
    sourceIndex: number,
    destinationIndex: number,
  ) => void;
}

const useStore = create<TimelineState>((set, get) => {
  const generateEmptyElement = ({ id, timeline }: Scene): Element => ({
    id: generateId(),
    sceneId: id,
    timeline: timeline,
  });

  const getDefaultScene = (startTime: number): Scene => ({
    id: generateId(),
    background: { type: "color", color: "#ff3311" },
    timeline: {
      startTime: startTime,
      duration: DEFAULT_SCENE_DURATION,
    },
    elements: [],
  });

  return {
    containerRef: null,
    currentTime: 0,
    zoomLevel: BASE_ZOOM_INDEX, // 1x
    pps: BASE_PPS * ZOOM[BASE_ZOOM_INDEX],
    viewportWidth: 0,
    totalDuration: DEFAULT_SCENE_DURATION,
    isPlaying: false,

    // actions
    setContainerRef: (ref) => set({ containerRef: ref }),
    setCurrentTime: (time) =>
      set({ currentTime: Math.max(0, Math.min(time, get().totalDuration)) }),

    setZoomLevel: (index) => {
      const zoomIndex = Math.max(0, Math.min(index, ZOOM.length - 1));
      set({ zoomLevel: zoomIndex, pps: BASE_PPS * ZOOM[zoomIndex] });
    },

    zoomIn: () => {
      const zoomIndex = Math.min(get().zoomLevel + 1, ZOOM.length - 1);
      set({ zoomLevel: zoomIndex, pps: BASE_PPS * ZOOM[zoomIndex] });
    },

    zoomOut: () => {
      const zoomIndex = Math.max(get().zoomLevel - 1, 0);
      set({ zoomLevel: zoomIndex, pps: BASE_PPS * ZOOM[zoomIndex] });
    },

    setViewportWidth: (width) => set({ viewportWidth: width }),
    setScroll: (scroll) =>
      get().containerRef
        ? (get().containerRef!.current!.scrollLeft += scroll)
        : null,

    play: () => {
      if (get().isPlaying) return;

      // play from beginning if currentTime == totalDuration
      if (get().currentTime >= get().totalDuration) {
        get().setCurrentTime(0);
      }

      const startTime = performance.now() / 1000 - get().currentTime;
      set({ isPlaying: true });

      const frame = () => {
        if (!get().isPlaying) return;
        if (get().currentTime >= get().totalDuration) {
          get().pause();
          return;
        }

        const elapsed = performance.now() / 1000 - startTime;
        get().setCurrentTime(elapsed);
        requestAnimationFrame(frame);
      };

      requestAnimationFrame(frame);
    },

    pause: () => set({ isPlaying: false }),

    // TODO: separate this into another slice
    isExpandElements: false,
    toggleExpandElements: () =>
      set((state) => ({ isExpandElements: !state.isExpandElements })),

    // scene related
    selectedScene: null,
    scenes: [getDefaultScene(0)],
    setSelectedSceneById: (id) =>
      set((state) => ({
        selectedScene: state.scenes.find((scene) => scene.id === id) || null,
      })),
    setSelectedScene: (scene) => set({ selectedScene: scene }),
    addEmptyScene: () =>
      set((state) => {
        const newScene = getDefaultScene(state.totalDuration);
        return {
          scenes: [...state.scenes, newScene],
          totalDuration: state.totalDuration + newScene.timeline.duration,
        };
      }),
    addScene: (scene) =>
      set((state) => {
        const newScene = {
          ...getDefaultScene(state.totalDuration),
          ...scene,
        };
        return {
          scenes: [...state.scenes, newScene],
          totalDuration: state.totalDuration + (scene.timeline?.duration || 10),
        };
      }),
    updateScene: (id, scene) =>
      set((state) => {
        const updatedScenes = state.scenes.map((s) =>
          s.id === id ? { ...s, ...scene } : s,
        );
        return {
          scenes: updatedScenes,
          // FIX: calculating totalDuration should be optimized.
          totalDuration: updatedScenes.reduce(
            (acc, s) => acc + s.timeline.duration,
            0,
          ),
        };
      }),
    removeScene: (id) =>
      set((state) => {
        const updatedScenes = state.scenes.filter((s) => s.id !== id);
        return {
          scenes: updatedScenes,
          totalDuration: updatedScenes.reduce(
            (acc, s) => acc + s.timeline.duration,
            0,
          ),
        };
      }),
    // FIX: this is not performant i think.
    reorderScenes: (sourceIndex, destinationIndex) =>
      set((state) => {
        const scenesCopy = [...state.scenes];
        const [removed] = scenesCopy.splice(sourceIndex, 1);
        scenesCopy.splice(destinationIndex, 0, removed);
        // Recalculate each scene's startTime sequentially
        let startTime = 0;
        const updatedScenes = scenesCopy.map((scene) => {
          const updatedScene = {
            ...scene,
            timeline: { ...scene.timeline, startTime },
          };
          startTime += scene.timeline.duration;
          return updatedScene;
        });
        return { scenes: updatedScenes };
      }),

    // element related
    selectedElement: null,
    elements: [],
    setSelectedElement: (element) => set({ selectedElement: element }),
    setSelectedElementById: (id) =>
      set({
        selectedElement: get().elements.find((el) => el.id === id) || null,
      }), // TODO: it should query from currently selected scene's elements list when the scene feature is implemented
    updateSelectedItemById: (id, element) =>
      set((state) => ({
        elements: state.elements.map((el) =>
          el.id === id ? { ...el, ...element } : el,
        ),
      })),
    // FIX: elements should always be bound to a scene. So, it needs optimization.
    updateElement: (id, element) =>
      set((state) => ({
        // update element in global list
        elements: state.elements.map((el) =>
          el.id === id ? { ...el, ...element } : el,
        ),
        // update element within each scene (if present)
        scenes: state.scenes.map((scene) => {
          if (scene.elements) {
            return {
              ...scene,
              elements: scene.elements.map((el) =>
                el.id === id ? { ...el, ...element } : el,
              ),
            };
          }
          return scene;
        }),
      })),
    addElement: (element) => {
      const selectedScene = get().selectedScene;
      if (!selectedScene) return;

      set((state) => ({
        scenes: state.scenes.map((scene) =>
          scene.id === selectedScene.id
            ? { ...scene, elements: [...(scene.elements || []), element] }
            : scene,
        ),
      }));
    },
    addEmptyElement: () => {
      const selectedScene = get().selectedScene;
      if (!selectedScene) return;

      set((state) => ({
        scenes: state.scenes.map((scene) =>
          scene.id === selectedScene.id
            ? {
                ...scene,
                elements: [
                  ...(scene.elements || []),
                  generateEmptyElement(scene),
                ],
              }
            : scene,
        ),
      }));
    },
    addElementToScene: (sceneId, element) =>
      set((state) => ({
        scenes: state.scenes.map((scene) =>
          scene.id === sceneId
            ? { ...scene, elements: [...(scene.elements || []), element] }
            : scene,
        ),
      })),
    reorderElements: (sceneId, sourceIndex, destinationIndex) =>
      set((state) => ({
        scenes: state.scenes.map((scene) => {
          if (scene.id === sceneId && scene.elements) {
            const newElements = [...scene.elements];
            const [removed] = newElements.splice(sourceIndex, 1);
            newElements.splice(destinationIndex, 0, removed);
            return { ...scene, elements: newElements };
          }
          return scene;
        }),
      })),
  };
});

export default useStore;
