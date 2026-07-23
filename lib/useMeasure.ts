"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Measure an element's content width with a ResizeObserver. Unlike recharts'
 * ResponsiveContainer (which leans on requestAnimationFrame), this updates even
 * when the tab is backgrounded, so charts still size correctly off-screen.
 */
export function useMeasure<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, width };
}
