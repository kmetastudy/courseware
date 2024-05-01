import { useState } from "../../../utils/state/useState";

export function useSize(element) {
  const [size, setSize, setListener] = useState(null);

  if (element) {
    setSize({ width: element.offsetWidth, height: element.offsetHeight });

    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries)) {
        return;
      }

      if (!entries.length) {
        return;
      }

      const entry = entries[0];
      let width;
      let height;

      if ("borderBoxSize" in entry) {
        const borderSizeEntry = entry["borderBoxSize"];
        // iron out differences between browsers
        const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
        width = borderSize["inlineSize"];
        height = borderSize["blockSize"];
      } else {
        // for browsers that don't support `borderBoxSize`
        // we calculate it ourselves to get the correct border box.
        width = element.offsetWidth;
        height = element.offsetHeight;
      }
      setSize({ width, height });
    });

    resizeObserver.observe(element, { box: "border-box" });

    return () => resizeObserver.unobserve(element);
  } else {
    setSize(undefined);
  }

  return [size, setListener];
}
