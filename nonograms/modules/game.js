import Layout from "./layout.js";
const rootStyle = document.querySelector(":root").style;

export default class Game {
  #gameLayout = new Layout();
  #currentSize;
  constructor(size=5){
    this.#currentSize=size;
    this.#gameLayout.createRowsAndColumns(size);
  }

  getSize(){
    return this.#currentSize;
  }

  getRootStyles(){
    return rootStyle;
  }
}