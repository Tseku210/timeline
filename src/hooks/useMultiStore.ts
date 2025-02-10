import { StoreApi, UseBoundStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

export function useMultiStore<T extends object, K extends keyof T>(
  useStoreFn: UseBoundStore<StoreApi<T>>,
  ...items: K[]
): Pick<T, K> {
  const obj = useStoreFn(
    useShallow((state) =>
      items.reduce((acc, item) => ({ ...acc, [item]: state[item] }), {}),
    ),
  );
  return obj as Pick<T, K>;
}
