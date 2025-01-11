import { initGame } from './src/keyboard.js';
import {Game} from './src/game.js';

initGame();

let game = new Game();
game.start();
console.log(game.required);