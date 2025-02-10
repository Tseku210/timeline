import useStore from "@/store/useStore";

export default function SceneControls() {
  const addEmptyScene = useStore((state) => state.addEmptyScene);
  const addEmptyElement = useStore((state) => state.addEmptyElement);
  return (
    <div className="flex gap-2">
      <button onClick={addEmptyElement}>Add element</button>
      <button onClick={addEmptyScene}>Add scene</button>
    </div>
  );
}
