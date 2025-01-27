import Game from '../modules/game.js';

let nanogramGame = new Game();
const rootStyle = nanogramGame.getRootStyles();

function init(){

  const mainBlock = document.querySelector(".main");
  let mainWidth= mainBlock.getBoundingClientRect().width;

  const tips = document.querySelector(".top_tips");
  let tipsWidth=tips.childNodes[0].getBoundingClientRect().width;

  mainBlock.addEventListener('cellState',(event)=> nanogramGame.handleState(event));
  mainBlock.addEventListener('filled',(e)=> updateCellSize(tips));

  rootStyle.setProperty("--cell-size",`${tipsWidth}px`);
  rootStyle.setProperty("--ceils-x",`${mainWidth*0.3}px`);
  rootStyle.setProperty("--ceils-y",`${mainWidth*0.7}px`);

  window.onresize=()=>{

    mainWidth= mainBlock.getBoundingClientRect().width;

    tipsWidth=tips.childNodes[0].getBoundingClientRect().width;
    rootStyle.setProperty("--cell-size",`${tipsWidth}px`);
    rootStyle.setProperty("--ceils-x",`${mainWidth*0.3}px`);
    rootStyle.setProperty("--ceils-y",`${mainWidth*0.7}px`);
  }
};

init();

const resetGame = document.getElementById("reset");
const solution = document.getElementById("solution");

resetGame.addEventListener('click',()=>nanogramGame.resetCells());

function updateCellSize(tips){
  let tipsWidth=tips.childNodes[0].getBoundingClientRect().width;
  rootStyle.setProperty("--cell-size",`${tipsWidth}px`);
}

solution.addEventListener('click',()=>nanogramGame.nanogramHint());