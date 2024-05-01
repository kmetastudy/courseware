import elem from "../../utils/elem/elem";
import { pick } from "../../utils/objects";
import { Popper } from "../popper";

export function Popover() {
  const popper = Popper();

  let triggerElement;
  let contentElement;

  const state = {
    // contentId: null,
    open: false,
  };

  const context = {
    onOpenChange: null,
    userOnOpenChange: null,
    onOpenToggle: null,
    modal: undefined,
  };

  const contentContext = {
    forceMount: undefined,
  };

  function onOpenChange() {
    setTriggerAttributes(triggerElement);
    if (context.userOnOpenChange) {
      context.userOnOpenChange(state.open);
    }
  }

  function setTriggerAttributes(element) {
    element.setAttribute("aria-expanded", state.open);
    // element.setAttribute("aria-controls", state.contentId);
    element.setAttribute("data-state", state.open);

    return element;
  }

  const popover = {
    Root(props) {
      const { defaultOpen, onOpenChange: userOnOpenChange, modal = false } = props;
      context.userOnOpenChange = userOnOpenChange;
      state.open = !!defaultOpen;
      context.modal = modal;
    },
    Anchor() {},
    Trigger({ element, ...triggerProps }) {
      triggerElement = element ?? document.createElement("button");
      triggerElement.setAttribute("type", "button");
      triggerElement.setAttribute("haspopup", "dialog");

      triggerElement.addEventListener("click", () => {
        state.open = !state.open;
        onOpenChange();
      });

      for (const [key, value] of Object.entries(triggerProps)) {
        element.setAttribute(key, value);
      }

      setTriggerAttributes(triggerElement, triggerProps);

      return triggerElement;
    },
    Content(props) {
      const {
        element,
        onOpenAutoFocus,
        onCloseAutoFocus,
        onEscapeKeyDown,
        onFocusOutside,
        forceMount = contentContext.forceMount,
        side = "bottom",
        sideOffset = 0,
        align = "center",
        alignOffset = 0,
        avoidCollisions = true,
        collisionBoundary = [],
        collisionPadding = 0,
        arrowPadding = 0,
        sticky = "partial",
        hideWhenDetached = false,
        ...contentProps
      } = props;

      const popperProps = pick();

      contentElement = popper.Content({
        element,
        "data-state": state.open,
        role: "dialog",
        // id: state.contentId,
        style: {
          ...contentProps.style,
        },
      });
    },
    Arrow(props) {
      return popper.Arrow(props);
    },
    Close() {},
  };
}
