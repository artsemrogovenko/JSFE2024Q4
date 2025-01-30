import { nonograms } from '../src/nonograms.js';

export default class Template {
  #templates = { easy: [], medium: [], hard: [] };
  #currentTemplate;
  constructor() {
    this.#templates.easy = nonograms['easy'];
    this.#templates.medium = nonograms['medium'];
    this.#templates.hard = nonograms['hard'];
  }

  getTemplate() {
    return this.#currentTemplate;
  }

  selectTemplate(difficulty = 'easy', position = null) {
    if (position === null) {
      let index = Math.floor(
        Math.random() * this.#templates[difficulty].length,
      );
      this.#currentTemplate = this.#templates[difficulty][index];
    } else {
      this.#currentTemplate = this.#templates[difficulty][position];
    }
  }

  showTemplates(difficulty) {
    // console.log(this.#templates);
    return this.#templates[difficulty];
  }
  setRandom() {
    let indexD = Math.floor(Math.random() * 3);
    let difficulty = Object.keys(this.#templates)[indexD];
    let indexT = Math.floor(Math.random() * this.#templates[difficulty].length);
    // this.#currentTemplate=this.#templates[difficulty][indexT];
    return [indexD, indexT];
  }

  calculateWinnerCombination(comparable, reference) {
    for (let i = 0; i < comparable.length; i++) {
      if (!reference.some((ref) => ref === comparable[i])) {
        return false;
      }
    }
    return true;
  }

  calculateDigitForTip(size) {
    const template = Object.values(this.#currentTemplate)[0];
    const winCombination = [];
    const countsTop = [];
    const countsLeft = [];
    let counterTop;
    let counterLeft;
    for (let j = 0; j < size; j++) {
      let currentTop = [];
      let currentLeft = [];
      counterTop = 0;
      counterLeft = 0;
      for (let i = size - 1; i >= 0; i -= 1) {
        if (template[i][j] === 1) {
          winCombination.push(`${i},${j}`);
          counterTop += 1;
        } else {
          if (counterTop > 0) {
            currentTop.push(counterTop);
          }
          counterTop = 0;
        }

        if (template[j][i] === 1) {
          // winCombination.push(`${j},${i}`);
          counterLeft += 1;
        } else {
          if (counterLeft > 0) {
            currentLeft.push(counterLeft);
          }
          counterLeft = 0;
        }
      }

      if (counterTop > 0) {
        currentTop.push(counterTop);
      }
      if (counterLeft > 0) {
        currentLeft.push(counterLeft);
      }
      countsTop.push(currentTop);
      countsLeft.push(currentLeft);
    }
    return [countsLeft, countsTop, winCombination];
  }
}
