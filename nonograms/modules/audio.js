const tick =new Audio('../nonograms/assets/sounds/tik.mp3');
const tock =new Audio('../nonograms/assets/sounds/tak.mp3');
const fanfare =new Audio('../nonograms/assets/sounds/fanfare.mp3');

tick.volume = 0.1;
tock.volume = 0.1;
let turnSound = true;
const sounds = [tick,tock,fanfare];
let tickinterval ;
let tockinterval ;

export function startTicking() {
  stopTicking();
  tickinterval= setInterval(playTick, 1000);
  tockinterval= setInterval(playTock, 2000);
}
export function stopTicking() {
  clearInterval(tickinterval);
  clearInterval(tockinterval);
}

export function playTick(){
  if(turnSound)
  tick.play();
}

function playTock(){
  if(turnSound)
  tock.play();
}

export function playWhite(){
  if(turnSound){
  const clear =new Audio('../nonograms/assets/sounds/clear.mp3');
  clear.play();}
}
export function playDark(){
  if(turnSound){
  const spray =new Audio('../nonograms/assets/sounds/spray.mp3');
  spray.volume=0.3;
  spray.play();}
}
export function playCross(){
  if(turnSound){
  const cross =new Audio('../nonograms/assets/sounds/cross.mp3');
  cross.play();}
}
export function playRevert(){
  if(turnSound){
  const put =new Audio('../nonograms/assets/sounds/put.mp3');
  put.play();}
}
export function playWin(){
  if(turnSound)
  fanfare.play();
}

export function toggleAudio(){
  turnSound=!turnSound;
}