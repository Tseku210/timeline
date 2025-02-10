import { MutableRefObject, useEffect, useState } from "react";

interface Props {
  onResize?: () => void;
}

export default function useResizeObserver(
  ref: MutableRefObject<HTMLElement | null>,
  { onResize }: Props = {},
) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    // init
    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setWidth(width);
        setHeight(height);
      }
      onResize?.();
    });

    resizeObserver.observe(ref.current);

    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        resizeObserver.unobserve(ref.current);
      }
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return {
    width,
    height,
  };
}
