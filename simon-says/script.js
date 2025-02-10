import { initGame } from './src/markup.js';
import { Game } from './src/game.js';
import { keyboardLogic } from './src/keyboard.js';

initGame();
keyboardLogic();

let game = new Game();
const body = document.querySelector('body');

body.addEventListener('click', (e) => {
  if (['hard', 'medium', 'easy'].includes(e.target.id)) {
    game.setMode = e.target.id;
  } else {
    game.validateInput = e.target.id;
  }
});

body.addEventListener('mousedown', (e) => {
  let button = document.getElementById(e.target.id);
  if (button) {
    if (game.inputIsAvailable) {
      button.classList.add('pressed');
    }
    const rmMouse = () => removeFn(button, 'mouseup', rmMouse);
    document.addEventListener('mouseup', rmMouse);
  }
});

function removeFn(obj, event, operation) {
  obj.classList.remove('pressed');
  document.removeEventListener(event, operation);
}

export { game };
