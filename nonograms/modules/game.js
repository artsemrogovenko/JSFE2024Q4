import Layout from "./layout.js";
import { loadGame, writeScore } from "./storage.js";
const rootStyle = document.querySelector(":root").style;

import Template from "./template.js";
import {playWin} from "./audio.js";

export default class Game {
  #template=new Template();
  #gameLayout = new Layout(this);
  #currentSize;
  #selectorDifficulty;
  #selectorNonograms;
  #winnerCombination=[];
  #userInput=new Set();
  #isGameStarted=false;

  #difficulty;
  #nonogram;
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
    this.#difficulty= this.#selectorDifficulty.options[this.#selectorDifficulty.selectedIndex].text;
    this.#nonogram= this.#selectorNonograms.options[this.#selectorNonograms.selectedIndex].text;
    this.#selectImage(this.#nonogram);
    this.#template.selectTemplate(this.#difficulty,this.#selectorNonograms.selectedIndex);

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
        this.#gameLayout.disableCells();
        this.#gameLayout.clock.stopClock();
        const [minutes, seconds]=this.#gameLayout.clock.getValue();
        this.#gameLayout.popUps.greetMsg(this.#difficulty,this.#nonogram,[minutes, seconds]);
        writeScore(this.#difficulty,this.#nonogram,[minutes, seconds]);
        playWin();
      }
    }
  }

  randomGame(){
    const [d,t] = this.#template.setRandom();
    this.#selectorDifficulty.selectedIndex=d;
    this.#selectorNonograms.selectedIndex=t;

    this.#difficulty= this.#selectorDifficulty.options[this.#selectorDifficulty.selectedIndex].text;
    this.#currentSize = this.#selectorDifficulty.options[this.#selectorDifficulty.selectedIndex].value;
    this.#initBlocks(this.#difficulty,this.#currentSize);
  }

  get resources(){
    return [
      Array.from(this.#userInput),
      this.#isGameStarted,
      this.#currentSize,
      this.#difficulty,
      this.#nonogram,
      this.#selectorNonograms.selectedIndex,
      this.#gameLayout.clock.currentDuration
    ];
  }

  get pauseGame(){
    this.#isGameStarted=false;
  }

  loadFromMemory(){
    const data = loadGame();
    if(data===false){
      return;
    }
    this.#selectorDifficulty.value=data["size"];
    this.#selectorNonograms.selectedIndex=data["nonogramIndex"];

    this.#initBlocks(data["difficulty"],data["size"]);

    this.#gameLayout.clock.stopClock();
    this.#gameLayout.clock.gameDuration= data["currentDuration"];
    this.#nonogram=data["nonogram"];
    this.#userInput=new Set(data["userInput"]);
    this.#isGameStarted=false;

    this.#gameLayout.loadState(data["userInput"],this.#currentSize);
  }

}