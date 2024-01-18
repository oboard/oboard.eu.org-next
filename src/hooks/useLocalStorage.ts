import {useEffect, useState} from "react";

export default function useLocalStorage(
    storageKey: string,
    fallbackState: string | never[]
) {
    const [value, setValue] = useState(
        (typeof window !== "undefined" &&
            JSON.parse(localStorage.getItem(storageKey) ?? "[]")) ||
        fallbackState
    );

    useEffect(() => {
        if (typeof window !== "undefined")
            localStorage.setItem(storageKey, JSON.stringify(value));
    }, [value, storageKey]);

    if (typeof window == "undefined") return [fallbackState, () => { }];

    return [value, setValue];

    // If there is no window (e.g., server-side rendering), provide a fallback.
    // return [fallbackState, () => {}]; // Return a dummy setState function.
};