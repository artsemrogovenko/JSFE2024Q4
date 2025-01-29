export default class Clock{
  #startTime;
  #minutesValue;
  #secondsValue;
  #interval;
  #minutesBlock;
  #secondsBlock;
  #differenceMs;
  #loadedMs;

  constructor(minutes,seconds){
    this.#startTime= new Date();
    this.#minutesBlock=minutes;
    this.#secondsBlock=seconds;
    this.#interval={};
    this.#loadedMs=0;
    this.#differenceMs=0;
  }

  startClock(){
    this.#startTime=Date.now();
    this.#interval.time=setInterval(this.#counting.bind(this),1000);
  }

  stopClock(){
    this.#loadedMs=this.#differenceMs;
    clearInterval(this.#interval.time);
  }

  resetClock(){
    this.#minutesBlock.getNode().innerText="0".padStart(2,"0");
    this.#secondsBlock.getNode().innerText="0".padStart(2,"0");
    this.#differenceMs=0;
    this.#loadedMs=0;
  }

  getValue(){
   return[this.#minutesValue,this.#secondsValue];
  }

  #counting(){
    this.#differenceMs= (Date.now() + this.#loadedMs) - this.#startTime;
    this.#minutesValue= new Date(this.#differenceMs).getMinutes().toString().padStart(2,"0");
    this.#secondsValue= new Date(this.#differenceMs).getSeconds().toString().padStart(2,"0");

    this.#minutesBlock.getNode().innerText=this.#minutesValue;
    this.#secondsBlock.getNode().innerText=this.#secondsValue;
  }

  get currentDuration(){
    return this.#differenceMs;
  }

  set gameDuration(ms){
    this.#loadedMs=ms;
    this.#minutesBlock.getNode().innerText=new Date(ms).getMinutes().toString().padStart(2,"0");
    this.#secondsBlock.getNode().innerText=new Date(ms).getSeconds().toString().padStart(2,"0");
  }
}
