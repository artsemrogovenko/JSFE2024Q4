import Layout from "./layout.js";
const rootStyle = document.querySelector(":root").style;

import {nonograms} from "../src/nonograms.js";


export default class Game {
  #gameLayout = new Layout();
  #currentSize;
  #selectorDifficulty;
  #selectorNonograms;
  #winnerCombination=new Set();

  constructor(size=5){
    this.#currentSize=size;

    this.#selectorDifficulty= document.getElementById("difficulty");
    this.#selectorNonograms= document.getElementById("nonogram");
    this.#selectorDifficulty.addEventListener('change',(event)=>this.#selectDifficulty(event.target));
    this.#selectorNonograms.addEventListener('change',()=>this.#selectNonogram());
    this.#initBlocks("easy",size);
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

  #selectDifficulty(target){
    let key = target.options[target.selectedIndex].text;
    this.#initBlocks(key,target.value);
  }

  #initBlocks(difficuilty,size){
    this.#addHeadings(nonograms[difficuilty]);
    this.#gameLayout.createRowsAndColumns(parseInt(size));
  }

  #addHeadings(data){
    for (let i = 0; i < data.length; i++) {
      this.#selectorNonograms[i].textContent=Object.keys(data[i])[0];
    }
    this.#selectNonogram();
  }

  #selectNonogram(){
    let key= this.#selectorNonograms.options[this.#selectorNonograms.selectedIndex].text;
    this.#selectImage(key);
  }

  #selectImage(imgName){
    const url = new URL(`../nonograms/assets/images/${imgName}.jpg`,document.location.origin).href;
    rootStyle.setProperty("--image-src",url);
  }
}