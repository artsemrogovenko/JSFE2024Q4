import { initGame } from './src/keyboard.js';
import {Game} from './src/game.js';

initGame();

let game = new Game();
const body = document.querySelector("body");

body.addEventListener("click",e=>{
  if(e.target.id==="start"){
  game.start();
  }
  if( ["hard","medium","easy"].includes(e.target.id)){
  game.setMode=e.target.id;
  }
  if(game.gaming){
    game.validateInput=e.target.id;
  }
});

body.addEventListener("mousedown",e=>{
  let button = document.getElementById(e.target.id);
  if(button){
  button.classList.add("pressed");
  const rmMouse=()=>removeFn(button, "mouseup", rmMouse);
  document.addEventListener("mouseup", rmMouse);
  }
});



body.addEventListener("keydown",e=>{
  let symbol = String.fromCharCode(e.code).toLowerCase();
  let button = document.getElementById(symbol);

  if(button){
    button.classList.add("pressed");
    const rmMouse=()=>removeFn(button, "keyup", rmMouse);
    document.addEventListener("keyup", rmMouse);
  }
});

function removeFn(obj,event,operation) {
  obj.classList.remove("pressed");
  document.removeEventListener(event, operation);
};

document.getElementById("repeat")
.addEventListener("click",e=>game.validateInput=e.target.id);