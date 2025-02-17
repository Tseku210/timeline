export default function Canvas() {
  return (
    <div
      className="relative flex h-[calc(100%-124px)] w-full flex-1 items-center justify-center"
      id="canvas-wrapper"
    >
      <div id="canvas-area" className="absolute size-full text-clip bg-white">
        {/* {child} */}
      </div>
      <EditorMoveable />
      <EditorSelecto />
    </div>
  );
}
