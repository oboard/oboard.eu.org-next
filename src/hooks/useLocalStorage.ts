import { useEffect, useState, Dispatch, SetStateAction } from "react";

export default function useLocalStorage<T>(
  storageKey: string,
  fallbackState: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return fallbackState;

    try {
      const item = localStorage.getItem(storageKey);
      return item ? JSON.parse(item) : fallbackState;
    } catch (error) {
      console.warn(`Error reading localStorage key "${storageKey}":`, error);
      return fallbackState;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, JSON.stringify(value));
      } catch (error) {
        console.warn(`Error setting localStorage key "${storageKey}":`, error);
      }
    }
  }, [value, storageKey]);

  return [value, setValue];
}
