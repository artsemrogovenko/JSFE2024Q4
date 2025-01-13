import {game} from '../script.js';

function keyboardLogic() {
const body = document.querySelector("body");
let firstPressed= null;

body.addEventListener("keydown",e=>{
  let symbol = String.fromCharCode(e.keyCode).toLowerCase();
  let button = document.getElementById(symbol);

  if(button){
    if(firstPressed===null && game.inputIsAvailable){
      firstPressed=symbol;
      button.classList.add("pressed");
    }
    const rmMouse=()=>removeFn(button, "keyup", rmMouse);
    document.addEventListener("keyup", rmMouse);
  }
});

function removeFn(obj,event,operation) {
  let symbol=obj.id;
  let button = document.getElementById(symbol);

  if(button){
    if(firstPressed===symbol){
      game.validateInput=symbol;
      firstPressed=null;
    }
  obj.classList.remove("pressed");
  document.removeEventListener(event, operation);
}
}
 
}
export {keyboardLogic};