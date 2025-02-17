import { cn } from "@/lib/utils";

interface ResizeMarkerProps extends React.ComponentPropsWithoutRef<"div"> {
  isStart?: boolean;
  disabled?: boolean;
}

export default function ResizeMarker({
  isStart = false,
  disabled = false,
  ...props
}: ResizeMarkerProps) {
  return (
    <div
      className={cn(
        "w-5 select-none invisible h-full cursor-ew-resize absolute right-0 top-0 group-hover:visible after:absolute after:w-1 after:h-4 after:top-1/2 after:left-1/2 after:-mt-2 after:-ml-px after:rounded-sm after:bg-black",
        isStart && "left-0",
        disabled && "invisible",
      )}
      {...props}
    ></div>
  );
}
