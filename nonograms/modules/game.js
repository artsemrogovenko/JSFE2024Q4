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
  #userInput=new Set();
  #isGameStarted=false;
  constructor(size=5){
    this.#currentSize=size;

    this.#selectorDifficulty= document.getElementById("difficulty");
    this.#selectorNonograms= document.getElementById("nonogram");
    this.#selectorDifficulty.addEventListener('change',(event)=>this.#selectDifficulty(event.target));
    this.#selectorNonograms.addEventListener('change',()=>this.#selectNonogram());
    this.#initBlocks("easy",size);
    this.#selectNonogram();
  }

  getSize(){
    return this.#currentSize;
  }

  getRootStyles(){
    return rootStyle;
  }

  resetCells(){
    this.#isGameStarted=false;
    this.#gameLayout.clock.stopClock();
    this.#gameLayout.clock.resetClock();
    this.#userInput.clear();
    this.#gameLayout.resetCells();
  }

  nanogramHint(){
    this.#gameLayout.clock.stopClock();
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
    this.#selectNonogram();
  }

  #addHeadings(data){
    for (let i = 0; i < data.length; i++) {
      this.#selectorNonograms[i].textContent=Object.keys(data[i])[0];
    }
  }

  #selectNonogram(){
    this.#userInput.clear();
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

  handleState(event){
    if (!this.#isGameStarted){
      this.#isGameStarted=true;
      this.#gameLayout.clock.startClock();
    }
    const obj = event.detail;

      if(obj.stateCell.includes("dark_cell")){
        this.#userInput.add(obj.idCell);
      }else{
        if(this.#userInput.has(obj.idCell)){
          this.#userInput.delete(obj.idCell);
        }
      }
    if(this.#userInput.size===this.#winnerCombination.length){
      let isWinner = this.#template.calculateWinnerCombination(Array.from(this.#userInput),this.#winnerCombination);
      if(isWinner){
        this.#isGameStarted=false;
        this.#gameLayout.clock.stopClock();
        const [minutes, seconds]=this.#gameLayout.clock.getValue();
        console.log(`Отлично! Вы решили нонограмму за ${minutes} минут : ${seconds} секунд!`);
      }
    }
  }

  randomGame(){
    const [d,t] = this.#template.setRandom();
    this.#selectorDifficulty.selectedIndex=d;
    this.#selectorNonograms.selectedIndex=t;

    const difficulty= this.#selectorDifficulty.options[this.#selectorDifficulty.selectedIndex].text;
    const size = this.#selectorDifficulty.options[this.#selectorDifficulty.selectedIndex].value;
    this.#initBlocks(difficulty,size);
  }
}