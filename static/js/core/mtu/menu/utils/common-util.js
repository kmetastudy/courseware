import { toArray } from "../../progress/utils";

export function parseChildren(
  children, // : React.ReactNode | undefined,
  keyPath, // : string[],
) {
  return toArray(children).map((child, index) => {
    if (React.isValidElement(child)) {
      const { key } = child;
      let eventKey = child.props?.eventKey ?? key;

      const emptyKey = eventKey === null || eventKey === undefined;

      if (emptyKey) {
        eventKey = `tmp_key-${[...keyPath, index].join("-")}`;
      }

      const cloneProps = {
        key: eventKey,
        eventKey,
      };

      if (process.env.NODE_ENV !== "production" && emptyKey) {
        cloneProps.warnKey = true;
      }

      return React.cloneElement(child, cloneProps);
    }

    return child;
  });
}
