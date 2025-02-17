interface Props {
  position: number | null;
}

export default function TimelineTimeIndicator({ position }: Props) {
  if (position === null) return null;
  return (
    <div
      style={{ left: `${position}px` }}
      className="absolute z-10 top-0 h-full w-0 border border-gray-500 border-dashed pointer-events-none"
    />
  );
}
