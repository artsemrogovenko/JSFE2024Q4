import Block from './element.js';
import Clock from './clock.js';
import PopUp from './popups.js';
import { saveGame, loadGame } from './storage.js';
import {
  playCross,
  playRevert,
  playDark,
  playWhite,
  toggleAudio,
} from './audio.js';
import { rootStyle } from './game.js';

export default class Layout {
  #mainContainer = new Block('div', 'main_container');
  #mainBlock = new Block('div', 'main');
  #imageBlock = new Block('div', 'image');
  #menuBlock = new Block('div', 'menu');
  #topTips = new Block('div', 'top_tips');
  #leftTips = new Block('div', 'left_tips');
  #cells = new Block('div', 'cell_container');

  #reset = new Block('button', 'reset_game', 'Reset Game');
  #solution = new Block('button', 'solution', 'Solution');
  #random = new Block('button', 'random', 'Random Game');
  #form = new Block('form', 'form');

  #secondMenuBlock = new Block('div', 'menu second');

  #time = new Block('div', 'time');
  #timeDelimiter = new Block('div', 'delimiter', ':');
  #minutes = new Block('div', 'minutes', '00');
  #seconds = new Block('div', 'seconds', '00');

  #saveGame = new Block('button', 'save', 'Save game');
  #loadGame = new Block('button', 'load', 'Continue last game');
  #score = new Block('button', 'score', 'Score');
  #soundBtn = new Block('div', 'sound');
  #themeBtn = new Block('div', 'theme');
  #themesProperties;

  #generatedCol = new CustomEvent('filled', { detail: true });
  #changeState = new CustomEvent('cellState', {
    detail: { idCell: '', valueCell: '' },
  });

  constructor(gameLogic) {
    this.#mainBlock.addBlock(this.#imageBlock);
    this.#mainBlock.addBlock(this.#topTips);
    this.#mainBlock.addBlock(this.#leftTips);
    this.#mainBlock.addBlock(this.#cells);

    this.#solution.setId('solution');
    this.#reset.setId('reset');
    this.#random.setId('random');
    this.#generateForm();

    this.#menuBlock.addBlock(this.#reset);
    this.#menuBlock.addBlock(this.#solution);
    this.#menuBlock.addBlock(this.#form);
    this.#menuBlock.addBlock(this.#random);

    this.#time.addBlock(this.#minutes);
    this.#time.addBlock(this.#timeDelimiter);
    this.#time.addBlock(this.#seconds);
    this.clock = new Clock(this.#minutes, this.#seconds);
    this.popUps = new PopUp();

    this.#secondMenuBlock.addBlock(this.#time);
    this.#secondMenuBlock.addBlock(this.#saveGame);
    this.#secondMenuBlock.addBlock(this.#loadGame);
    this.#secondMenuBlock.addBlock(this.#score);
    this.#secondMenuBlock.addBlock(this.#soundBtn);
    this.#secondMenuBlock.addBlock(this.#themeBtn);
    this.#initStyles();
    const darkBg = new Block('div', 'tablePanel_background');

    this.#mainContainer.addBlock(this.#mainBlock);

    document.body.append(this.#menuBlock.getNode());
    document.body.append(this.#secondMenuBlock.getNode());
    document.body.append(this.#mainContainer.getNode());
    document.body.append(darkBg.getNode());
    document.body.append(
      this.popUps.getMsgWindow(),
      this.popUps.getScoreBlock(),
    );
    document.body.addEventListener('contextmenu', function noContext(event) {
      event.preventDefault();
    });
    this.#score.addListener('click', () => this.popUps.showScore(darkBg));
    darkBg.addListener('click', () => this.popUps.hideScore(darkBg));

    this.#saveGame.addListener('click', () => {
      saveGame(gameLogic.resources);
      this.clock.stopClock();
      gameLogic.pauseGame;
      this.checkSavedGame();
    });
    this.#loadGame.addListener('click', () =>
      loadGame(gameLogic.loadFromMemory()),
    );

    this.#soundBtn.addListener('click', () => this.#toggleSound());
    this.#themeBtn.addListener('click', () => this.#changeTheme());

    this.checkSavedGame();
  }

  createRowsAndColumns(size) {
    this.#leftTips.deleteAllBlocks();
    this.#topTips.deleteAllBlocks();
    this.#cells.deleteAllBlocks();

    this.#createRow(size);
    this.#createCol(size);
    this.#createCells(size);
  }

  #createRow(size) {
    for (let index = 0; index < size; index++) {
      const element = new Block('div', 'left_tip');
      if ((index + 1) % 5 === 0 && index !== size - 1) {
        element.getNode().classList.add('horizontal_bold_line');
      }
      element.setId(`row${index}`);
      this.#leftTips.addBlock(element);
    }
  }

  #createCol(size) {
    for (let index = 0; index < size; index++) {
      const element = new Block('div', 'top_tip');
      if ((index + 1) % 5 === 0 && index !== size - 1) {
        element.getNode().classList.add('vertical_bold_line');
      }
      element.setId(`col${index}`);
      this.#topTips.addBlock(element);
    }
    this.#mainBlock.getNode().dispatchEvent(this.#generatedCol);
  }

  #createCells(size) {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const element = new Block('div', 'cell');

        if ((j + 1) % 5 === 0 && j !== size - 1) {
          element.getNode().classList.add('vertical_bold_line');
        }

        if ((i + 1) % 5 === 0 && i !== size - 1) {
          element.getNode().classList.add('horizontal_bold_line');
        }
        element.setId(`${i},${j}`);

        element.addListener('click', () => {
          if (element.getNode().classList.value.includes('dark_cell')) {
            playWhite();
          } else {
            playDark();
          }
          this.#toggleDarkColor(element);
          this.#changeState.detail.idCell = element.getNode().id;
          this.#changeState.detail.stateCell =
            element.getNode().classList.value;
          this.#mainBlock.getNode().dispatchEvent(this.#changeState);
          this.#reset.getNode().classList.remove('disabled');
        });
        element.addListener('contextmenu', () => {
          if (element.getNode().classList.value.includes('cross_cell')) {
            playRevert();
          } else {
            playCross();
          }

          this.#toggleCrossed(element);
          this.#changeState.detail.idCell = element.getNode().id;
          this.#changeState.detail.stateCell = 'cross';
          this.#mainBlock.getNode().dispatchEvent(this.#changeState);
          this.#reset.getNode().classList.remove('disabled');
        });

        this.#cells.addBlock(element);
      }
    }
    this.#reset.getNode().classList.add('disabled');
  }

  #toDefaultColor(cell) {
    cell.getNode().classList.remove('dark_cell');
    cell.getNode().classList.remove('cross_cell');
  }

  #toggleDarkColor(cell) {
    cell.getNode().classList.toggle('dark_cell');
    cell.getNode().classList.remove('cross_cell');
  }

  #toggleCrossed(cell) {
    cell.getNode().classList.toggle('cross_cell');
    cell.getNode().classList.remove('dark_cell');
  }

  resetCells() {
    this.#cells.getComponents().forEach((e) => this.#toDefaultColor(e));
    this.#solution.getNode().classList.remove('disabled');
    this.#reset.getNode().classList.add('disabled');
    this.#cells.getNode().style = '';
    this.#saveGame.getNode().classList.remove('disabled');
  }

  destroyCells() {
    this.#cells.deleteAllBlocks();
  }

  showSolution(array) {
    this.#cells.getComponents().forEach((e) => this.#toDefaultColor(e));
    this.#cells.getComponents().forEach((component) => {
      let [row, col] = component.getNode().id.split(',');
      if (array[row][col] === 1) {
        this.#toggleDarkColor(component);
      } else {
        this.#toDefaultColor(component);
      }
    });

    this.disableCells();
  }

  fillTips(forLeft, forTop) {
    this.#leftTips.getComponents().forEach((block) => block.deleteAllBlocks());
    this.#topTips.getComponents().forEach((block) => block.deleteAllBlocks());
    let index = 0;
    for (const component of this.#leftTips.getComponents()) {
      const counts = forLeft[index].reverse();
      for (const number of counts) {
        component.addBlock(new Block('div', 'tipDigit left', number));
      }
      index += 1;
    }
    index = 0;
    for (const component of this.#topTips.getComponents()) {
      const counts = forTop[index];
      for (const number of counts) {
        component.addBlock(new Block('div', 'tipDigit top', number));
      }
      index += 1;
    }
  }

  #generateForm() {
    const label = document.createElement('label');
    const selDifficulty = new Block('select', '');
    const selNonogram = new Block('select', '');

    label.setAttribute('for', 'difficulty');
    label.textContent = 'Difficulty';
    this.#form.getNode().appendChild(label);

    selDifficulty.setId('difficulty');
    selNonogram.setId('nonogram');

    const easy = document.createElement('option');
    const medium = document.createElement('option');
    const hard = document.createElement('option');

    easy.value = 5;
    easy.selected = true;
    medium.value = 10;
    hard.value = 15;

    easy.textContent = 'easy';
    medium.textContent = 'medium';
    hard.textContent = 'hard';

    selDifficulty.getNode().appendChild(easy);
    selDifficulty.getNode().appendChild(medium);
    selDifficulty.getNode().appendChild(hard);

    for (let i = 0; i < 5; i++) {
      const option = document.createElement('option');
      option.value = `${i}`;
      selNonogram.getNode().appendChild(option);
    }

    this.#form.addBlock(selDifficulty);
    this.#form.addBlock(selNonogram);
  }

  disableCells() {
    this.#solution.getNode().classList.add('disabled');
    this.#cells.getNode().style.pointerEvents = 'none';
    this.#reset.getNode().classList.remove('disabled');
    this.#saveGame.getNode().classList.add('disabled');
  }

  loadState(dark, crosses, size) {
    const allCells = this.#cells.getComponents();
    dark.forEach((value) => {
      let [i, j] = value.split(',');
      let index = parseInt(i) * size + parseInt(j);
      this.#toggleDarkColor(allCells[index]);
    });
    crosses.forEach((value) => {
      let [i, j] = value.split(',');
      let index = parseInt(i) * size + parseInt(j);
      this.#toggleCrossed(allCells[index]);
    });
  }

  #toggleSound() {
    toggleAudio();
    this.#soundBtn.getNode().classList.toggle('muted');
  }

  #changeTheme() {
    switch (this.#themesProperties['current']) {
      case 'light':
        this.#themesProperties['current'] = 'dark';
        break;
      case 'dark':
        this.#themesProperties['current'] = 'light';
        break;
    }
    const key = this.#themesProperties['current'];
    const properties = this.#themesProperties[key];
    rootStyle.setProperty('--bgColor-main', properties[0]);
    rootStyle.setProperty('--bg-tips-container', properties[1]);
    rootStyle.setProperty('--main-bg', properties[2]);
    rootStyle.setProperty('--buttons-bg', properties[3]);
    rootStyle.setProperty('--buttons-gradient', properties[4]);
    this.#themeBtn.getNode().classList.toggle('dark');
  }

  #initStyles() {
    this.#themesProperties = {
      current: 'light',
      light: [
        '#2871b1',
        '#aed2f1',
        `#f0f8ffb5 center / cover no-repeat url('./backgrounds/light.jpg?v=2')`,
        'field',
        `linear-gradient(#efcece, #b8bceb)`,
      ],
      dark: [
        '#200f40',
        '#000000',
        `#04191cb5 center / cover no-repeat url('./backgrounds/dark.jpg?v=2')`,
        '#8692c9',
        `linear-gradient(#e66465, #9198e5)`,
      ],
    };
  }

  disableSaveBtn(){
    this.#saveGame.getNode().classList.add('disabled');
  }
  enableSaveBtn(){
    this.#saveGame.getNode().classList.remove('disabled');
  }

  checkSavedGame(){
    if(loadGame()===false){
      this.#loadGame.getNode().classList.add("disabled");
      return;
    }else{
      this.#loadGame.getNode().classList.remove("disabled");
    }
  }
}
