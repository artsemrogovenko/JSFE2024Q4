import Layout from "./layout.js";
const rootStyle = document.querySelector(":root").style;

// import {nonograms} from "../src/nonograms.js";
import Template from "./template.js";


export default class Game {
  #template=new Template();
  #gameLayout = new Layout();
  #currentSize;
  #selectorDifficulty;
  #selectorNonograms;
  #winnerCombination=[];

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

  nanogramHint(){
    const arr = Object.values(this.#template.getTemplate())[0];
    this.#gameLayout.showSolution(arr);
  }

  #selectDifficulty(target){
    let key = target.options[target.selectedIndex].text;
    this.#initBlocks(key,target.value);
  }

  #initBlocks(difficuilty,size){
    this.#currentSize=parseInt(size);
    rootStyle.setProperty("--cell-size",`${this.getSize()}px`);
    this.#addHeadings(this.#template.showTemplates(difficuilty));
    this.#gameLayout.createRowsAndColumns(this.getSize());
  }

  #addHeadings(data){
    for (let i = 0; i < data.length; i++) {
      this.#selectorNonograms[i].textContent=Object.keys(data[i])[0];
    }
    this.#selectNonogram();
  }

  #selectNonogram(){
    this.resetCells();
    let difficulty= this.#selectorDifficulty.options[this.#selectorDifficulty.selectedIndex].text;
    let nonogram= this.#selectorNonograms.options[this.#selectorNonograms.selectedIndex].text;
    this.#selectImage(nonogram);
    this.#template.selectTemplate(difficulty,this.#selectorNonograms.selectedIndex);

    const [countsLeft,countsTop,combination] =this.#template.calculateDigitForTip(this.#currentSize);
    this.#winnerCombination=combination;
    this.#gameLayout.fillTips(countsLeft,countsTop);
  }

  #selectImage(imgName){
    rootStyle.setProperty("--image-src",`url(../assets/images/${imgName}.jpg)`);
  }
}