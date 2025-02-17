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
  selectedSceneIndex: number;
  selectedSceneId: string | null;
  setSelectedSceneIndex: (index: number) => void;
  setSelectedSceneById: (id: string) => void;
  addEmptyScene: () => void;
  addScene: (scene: Partial<Scene>) => void;
  updateScene: (id: string, scene: Partial<Scene>) => void;
  updateSceneElements: (id: string, elements: Element[]) => void;
  removeScene: (id: string) => void;
  reorderScenes: (sourceIndex: number, destinationIndex: number) => void;

  // element related
  selectedElementIds: Array<string>;
  selectElements: (ids: Array<string>) => void;
  updateElement: (id: string, element: Partial<Element>) => void;
  addElementToScene: (sceneId: string, element: Element) => void;
  addElement: (element: Element) => void;
  addEmptyElement: () => void;
  reorderElements: (sourceIndex: number, destinationIndex: number) => void;
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

  // uses binary search for performance
  // TODO: cache index (don't know how yet.)
  const getCurrentSceneIndex = (
    scenes: Scene[],
    currentTime: number,
  ): number => {
    let low = 0;
    let high = scenes.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const { startTime, duration } = scenes[mid].timeline;
      const endTime = startTime + duration;

      // If currentTime is within the current scene's time interval, return its index.
      if (currentTime >= startTime && currentTime < endTime) {
        get().setSelectedSceneIndex(mid);
        return mid;
      }
      // If currentTime is before this scene, search left half.
      else if (currentTime < startTime) {
        high = mid - 1;
      }
      // Otherwise, search right half.
      else {
        low = mid + 1;
      }
    }

    get().setSelectedSceneIndex(-1);
    return -1;
  };

  // const scrollToEnd = () => {
  //   const container = get().containerRef?.current;
  //   if (!container) return;
  //   container.scrollTo({
  //     left: container.scrollWidth,
  //     behavior: "smooth",
  //   });
  // };

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
    selectedSceneId: null,
    selectedSceneIndex: -1,
    scenes: [getDefaultScene(0)],
    setSelectedSceneIndex: (index) => set({ selectedSceneIndex: index }),
    setSelectedSceneById: (id) => set({ selectedSceneId: id }),
    addEmptyScene: () => {
      set((state) => {
        const newScene = getDefaultScene(state.totalDuration);
        return {
          scenes: [...state.scenes, newScene],
          totalDuration: state.totalDuration + newScene.timeline.duration,
        };
      });
    },
    addScene: (scene) => {
      set((state) => {
        const newScene = {
          ...getDefaultScene(state.totalDuration),
          ...scene,
        };
        return {
          scenes: [...state.scenes, newScene],
          totalDuration: state.totalDuration + (scene.timeline?.duration || 10),
        };
      });
    },
    updateScene: (id, scene) =>
      set((state) => {
        const updatedScenes = state.scenes.map((s) =>
          s.id === id
            ? {
                ...s,
                ...scene,
                // NOTE: only updates elements when `timeline` is changed.
                elements: scene.timeline
                  ? s.elements.map((el) => {
                      if (!scene.timeline) return el;
                      const newDuration =
                        el.timeline.duration +
                        (scene.timeline.duration - s.timeline.duration);
                      const newStartTime =
                        el.timeline.startTime +
                        (scene.timeline.startTime - s.timeline.startTime);
                      return {
                        ...el,
                        timeline: {
                          startTime: newStartTime,
                          duration: newDuration,
                        },
                      };
                    })
                  : s.elements,
              }
            : s,
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
    updateSceneElements: (id, elements) =>
      set((state) => ({
        scenes: state.scenes.map((scene) =>
          scene.id === id ? { ...scene, elements: elements } : scene,
        ),
      })),
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
    selectedElementIds: [],
    selectElements: (ids) => set({ selectedElementIds: ids }),
    updateElement: (id, element) =>
      set((state) => {
        const currentSceneIndex = getCurrentSceneIndex(
          state.scenes,
          state.currentTime,
        );
        if (currentSceneIndex === -1) return {};

        // Update element only in the current scene.
        const currentScene = state.scenes[currentSceneIndex];
        const updatedElements = currentScene.elements.map((el) =>
          el.id === id ? { ...el, ...element } : el,
        );

        // Replace the current scene with its updated version.
        const updatedScene = { ...currentScene, elements: updatedElements };
        const updatedScenes = [...state.scenes];
        updatedScenes[currentSceneIndex] = updatedScene;

        return { scenes: updatedScenes };
      }),
    addElement: (element) =>
      set((state) => {
        const currentSceneIndex = getCurrentSceneIndex(
          state.scenes,
          state.currentTime,
        );
        if (currentSceneIndex === -1) return {};

        const currentScene = state.scenes[currentSceneIndex];
        const updatedElements = [...currentScene.elements, element];

        const updatedScene = { ...currentScene, elements: updatedElements };
        const updatedScenes = [...state.scenes];
        updatedScenes[currentSceneIndex] = updatedScene;

        return { scenes: updatedScenes };
      }),

    addEmptyElement: () =>
      set((state) => {
        const currentSceneIndex = getCurrentSceneIndex(
          state.scenes,
          state.currentTime,
        );
        if (currentSceneIndex === -1) return {};

        const currentScene = state.scenes[currentSceneIndex];
        const updatedElements = [
          ...currentScene.elements,
          generateEmptyElement(currentScene),
        ];

        const updatedScene = { ...currentScene, elements: updatedElements };
        const updatedScenes = [...state.scenes];
        updatedScenes[currentSceneIndex] = updatedScene;

        return { scenes: updatedScenes };
      }),
    addElementToScene: (element) =>
      set((state) => {
        const currentSceneIndex = getCurrentSceneIndex(
          state.scenes,
          state.currentTime,
        );
        if (currentSceneIndex === -1) return {};

        const currentScene = state.scenes[currentSceneIndex];
        const updatedScene = {
          ...currentScene,
          elements: [...(currentScene.elements || []), element],
        } as Scene;
        const updatedScenes = [...state.scenes];
        updatedScenes[currentSceneIndex] = updatedScene;

        return { scenes: updatedScenes };
      }),
    reorderElements: (sourceIndex, destinationIndex) =>
      set((state) => {
        const currentIndex = getCurrentSceneIndex(
          state.scenes,
          state.currentTime,
        );
        if (currentIndex === -1) return {};

        const currentScene = state.scenes[currentIndex];
        if (!currentScene.elements) return {};

        const newElements = [...currentScene.elements];
        const [removed] = newElements.splice(sourceIndex, 1);
        newElements.splice(destinationIndex, 0, removed);

        // Determine the range that needs to be updated.
        const start = Math.min(sourceIndex, destinationIndex);
        const end = Math.max(sourceIndex, destinationIndex);
        // Only update the index property for elements in the affected range.
        for (let i = start; i <= end; i++) {
          newElements[i] = {
            ...newElements[i],
            index: i,
          };
        }

        const updatedScene = { ...currentScene, elements: newElements };
        const updatedScenes = [...state.scenes];
        updatedScenes[currentIndex] = updatedScene;

        return { scenes: updatedScenes };
      }),
  };
});

export default useStore;
