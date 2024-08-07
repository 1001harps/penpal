import { useRef } from "react";

export type Lazy<T> = {
  value: T;
};

export const useLazyValue = <T extends any>(factory: () => T): Lazy<T> => {
  const valueRef = useRef<T | null>();

  return {
    get value() {
      if (!valueRef.current) valueRef.current = factory();
      return valueRef.current;
    },
  };
};
