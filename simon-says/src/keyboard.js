function keyboardLogic() {
const body = document.querySelector("body");

body.addEventListener("keydown",e=>{
  let symbol = String.fromCharCode(e.keyCode).toLowerCase();
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
}

export {keyboardLogic};