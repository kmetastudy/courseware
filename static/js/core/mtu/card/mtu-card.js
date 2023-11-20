import { adjustConfig } from "../_util/adjust-config.js";
import { config } from "./config";

require("./mtu-card.css");
export class MtuCard {
  constructor(options) {
    this.options = adjustConfig(config, options);
    this.init();
  }

  init() {
    this.card = this.create();

    this.applyAttributes();

    this.setEvents();
  }

  create() {
    const card = document.createElement("div");
    card.classList.add("mtu-card");

    const cardBody = document.createElement("div");
    cardBody.classList.add("mtu-card-body");
    card.appendChild(cardBody);
    return card;
  }

  applyAttributes() {
    const shouldCreateHead = this.options.title || this.options.tabs;
    if (shouldCreateHead) {
      this.head = this.createHead();
      this.card.prepend(this.head);
    }

    if (this.options.title) {
      this.head.appendChild(this.createTitle(this.options.title));
    }

    if (this.options.cover) {
      this.setCover(this.options.cover);
    }

    if (this.options.bordered) {
      this.setBordered(this.options.bordered);
    }

    const defaultSize = "middle";
    if (this.options.size && this.options.size !== defaultSize) {
      this.setSize(this.options.size);
    }

    if (this.options.hoverable) {
      this.setHoverable();
    }

    if (this.options.className) {
      this.setClassName(this.options.className);
    }
  }
  // Attributes
  createHead() {
    const head = document.createElement("div");
    head.classList.add("mtu-card-head");

    const wrapper = document.createElement("div");
    wrapper.classList.add("mtu-card-head-wrapper");
    head.appendChild(wrapper);

    return head;
  }

  createTitle(title) {
    const titleElement = document.createElement("div");
    titleElement.classList.add("mtu-card-title");
    titleElement.textContent = title;
    return titleElement;
  }

  setCover(cover) {
    const coverElement = document.createElement("div");
    coverElement.classList.add("mtu-card-cover");

    const coverImg = document.createElement("image");
    for (const key of cover) {
      coverImg.setAttribute(key, cover[key]);
    }

    coverElement.appendChild(coverImg);
    this.card.appendChild(coverElement);
  }

  setHoverable() {
    this.card.classList.add("mtu-card-hoverable");
  }

  setBordered() {
    this.card.classList.add("mtu-card-bordered");
  }

  setSize(size) {
    this.card.classList.add(`mtu-card-${size}`);
  }

  setClassName(className) {
    this.card.classList.add(className);
  }

  setEvents() {
    if (this.options.onClick) {
      this.card.addEventListener("click", this.handleClick.bind(this));
    }
  }

  ////////////////// Handler //////////////////
  handleClick(evt) {
    this.options.onClick();
  }

  ////////////////// API //////////////////
  getElement() {
    return this.card;
  }
}

const formItems = [
  {
    item: "input",
    config: {
      htmlType: "text",
      name: "email",
      icon: "email",
      placeholder: "Enter the email",
    },
  },
  {
    item: "input",
    config: {
      htmlType: "password",
      name: "password",
      icon: "lock",
      placeholder: "Enter the email",
    },
  },
  {
    item: "button",
    config: {
      htmlType: "submit",
      name: "submit",
      text: "Submit!",
    },
  },
];

// {cover: {
//   src: '',
// }}
