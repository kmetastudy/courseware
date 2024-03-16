import elem from "../../../core/utils/elem/elem";
import { classNames } from "../../../core/utils/class-names";
import { MtuIcon } from "../../../core/mtu/icon/mtu-icon";
import { omit } from "../../../core/utils/objects/omit";

export function ClassCombobox({ data = [], initialValue, placeholder = "Select" }) {
  const initialLabel = initialValue ? data.find((item) => item.value)?.label : placeholder;
  console.log(data.find((item) => item.value === initialValue).label);

  function handleSelect(evt, item) {
    //
    console.log(item);
  }

  return elem(
    "div",
    { class: "dropdown" },
    elem(
      "input",
      {
        tabindex: "0",
        class: "input input-bordered",
        value: initialValue ?? null,
        placeholder: initialLabel,
      },
      initialLabel,
      elem(MtuIcon("upDown")),
    ),
    elem(
      "ul",
      {
        tabindex: 0,
        class: "p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52",
      },
      ...data.map((item) => {
        return elem(
          "li",
          { key: item.value, value: item.value, on: { click: handleSelect(item) } },
          elem("a", item.label),
        );
      }),
    ),
  );
}
