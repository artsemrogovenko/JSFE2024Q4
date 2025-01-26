import Game from '../modules/game.js';

let nanogramGame = new Game(10);

function init(){
  const rootStyle = nanogramGame.getRootStyles();

  const mainBlock = document.querySelector(".main");
  let mainWidth= mainBlock.getBoundingClientRect().width;

  const tips = document.querySelector(".top_tip");
  let tipsWidth=tips.getBoundingClientRect().width;


  rootStyle.setProperty("--cell-size",`${tipsWidth}px`);
  rootStyle.setProperty("--ceils-x",`${mainWidth*0.3}px`);
  rootStyle.setProperty("--ceils-y",`${mainWidth*0.7}px`);

  window.onresize=()=>{

    mainWidth= mainBlock.getBoundingClientRect().width;

    tipsWidth=tips.getBoundingClientRect().width;
    rootStyle.setProperty("--cell-size",`${tipsWidth}px`);
    rootStyle.setProperty("--ceils-x",`${mainWidth*0.3}px`);
    rootStyle.setProperty("--ceils-y",`${mainWidth*0.7}px`);
  }
};

init();

const resetGame = document.getElementById("reset");
const solution = document.getElementById("solution");

resetGame.addEventListener('click',()=>nanogramGame.resetCells());