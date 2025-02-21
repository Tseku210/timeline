import useStore from "@/store/useStore";

export default function SceneControls() {
  const visibleElements = useStore((state) => state.visibleElements);
  const addEmptyScene = useStore((state) => state.addEmptyScene);
  const addEmptyElement = useStore((state) => state.addEmptyElement);
  return (
    <div className="flex gap-2">
      <button onClick={addEmptyElement}>Add element</button>
      <button onClick={addEmptyScene}>Add scene</button>
      <span>
        {visibleElements.map((element) => (
          <div key={element.id}>{element.id}</div>
        ))}
      </span>
    </div>
  );
}
