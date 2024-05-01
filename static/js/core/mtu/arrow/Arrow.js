import { isHTMLNode } from "../../utils/type";

export function Arrow(props = {}) {
  const { children, width = 10, heigth = 5, style, ...arrowProps } = props;

  const arrowElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  if (style) {
    arrowElement.style = style;
  }
  arrowElement.style.width = `${width}px`;
  arrowElement.style.height = `${heigth}px`;

  arrowElement.setAttribute("viewBox", "0 0 30 10");
  arrowElement.setAttribute("preserveAspectRatio", "none");

  for (const [key, value] of Object.entries(arrowProps)) {
    arrowElement.setAttribute(key, value);
  }

  if (props.asChild && isHTMLNode(children)) {
    arrowElement.append(children);
  } else {
    const child = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    child.setAttribute("points", "0,0 30,0 15,10");
    arrowElement.append(child);
  }

  return arrowElement;
}
