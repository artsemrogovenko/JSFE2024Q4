import Game from '../modules/game.js';

let nanogramGame = new Game();
const rootStyle = nanogramGame.getRootStyles();
let mainBlock ;
let tips;

function init() {
  mainBlock = document.querySelector('.main');
  tips = document.querySelector('.top_tips');

  updateCellSize();

  mainBlock.addEventListener('cellState', (event) =>
    nanogramGame.handleState(event),
  );
  mainBlock.addEventListener('filled', () => {
    updateCellSize(tips)
  });

  window.onresize = () => {
    updateCellSize();
  };
}

init();

const resetGame = document.getElementById('reset');
const solution = document.getElementById('solution');
const randomGame = document.getElementById('random');

resetGame.addEventListener('click', () => nanogramGame.resetCells());

function updateCellSize() {
  let mainWidth = mainBlock.getBoundingClientRect().width;
  let tipsWidth = tips.childNodes[0].getBoundingClientRect().width;

  rootStyle.setProperty('--cell-size', `${tipsWidth}px`);
  rootStyle.setProperty('--ceils-x', `${mainWidth * 0.3}px`);
  rootStyle.setProperty('--ceils-y', `${mainWidth * 0.7}px`);
}

solution.addEventListener('click', () => nanogramGame.nanogramHint());
randomGame.addEventListener('click', () => nanogramGame.randomGame());
