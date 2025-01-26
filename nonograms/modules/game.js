import Layout from "./layout.js";
const rootStyle = document.querySelector(":root").style;

import {nonograms} from "../src/nonograms.js";


export default class Game {
  #gameLayout = new Layout();
  #currentSize;
  constructor(size=5){
    this.#currentSize=size;
    this.#gameLayout.createRowsAndColumns(size);

    const selectDifficulty= document.getElementById("difficulty");
    const selectNonogram= document.getElementById("difficulty");
    selectDifficulty.addEventListener('change',(event)=>this.#selectDifficulty(event.target.value));
  }

  getSize(){
    return this.#currentSize;
  }

  getRootStyles(){
    return rootStyle;
  }

  resetCells(){
    this.#gameLayout.resetCells();
  }

  #selectDifficulty(value){
    this.#gameLayout.createRowsAndColumns(parseInt(value));
  }

  #selectImage(){}
}