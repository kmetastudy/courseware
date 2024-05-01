import { useSize } from "../use-size";

// example usage:
const element = document.createElement("div");
const state = { size: null };
const size = useSize(element, (size) => {
  state.size = size;
  const { width, height } = size;
  console.log(`width: ${width}, height: ${height}`);
});
