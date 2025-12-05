import { useEffect, useState } from "react";

export default function useSearch(delay = 2000) {
  const [input, setInput] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(input), delay);
    return () => clearTimeout(timer);
  }, [input]);

  return { input, setInput, debounced };
}
