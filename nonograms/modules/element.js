export default class Block {
  #components = [];
  #listeners = {};
  #element;

  constructor(tag = 'div', classN = '', text = '') {
    let element = document.createElement(tag);
    if (classN) {
      element.className = classN;
    }
    if (text) {
      element.textContent = text;
    }
    this.#element = element;
  }

  addBlock(block) {
    this.#components.push(block);
    this.#element.append(block.getNode());
  }

  setId(_id) {
    this.#element.id = _id;
  }

  setText(text) {
    this.#element.textContent = text;
  }

  deleteAllBlocks() {
    this.#components.forEach((child) => {
      child.destroy();
    });
    this.#components = [];
  }

  getNode() {
    return this.#element;
  }

  destroy() {
    this.deleteAllBlocks();
    this.removeAllListeners();
    this.#element.remove();
  }

  addListener(event, listener, option = false) {
    if (!this.#listeners[event]) {
      this.#listeners[event] = new Array();
    }
    this.#listeners[event].push(listener);
    this.#element.addEventListener(event, listener, option);
  }
  removeListener(event, listener, option = false) {
    this.#element.removeEventListener(event, listener, option);
    this.#listeners = this.#listeners[event].filter((l) => l !== listener);
  }

  removeAllListeners() {
    if (Array.isArray(this.#listeners)) {
      for (const [event, listener] of this.#listeners) {
        this.#element.removeListener(event, listener);
      }
    }
  }

  getComponents() {
    return this.#components;
  }
}
