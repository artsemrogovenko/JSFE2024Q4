export default class Clock{
  #startTime;
  #minutesValue;
  #secondsValue;
  #interval;
  #minutesBlock;
  #secondsBlock;

  constructor(minutes,seconds){
    this.#startTime= new Date();
    this.#minutesBlock=minutes;
    this.#secondsBlock=seconds;
    this.#interval={};
  }

  startClock(){
    this.#startTime=Date.now();
    this.#interval.time=setInterval(this.#counting.bind(this),1000);
  }

  stopClock(){
    clearInterval(this.#interval.time);
  }

  resetClock(){
    this.#minutesBlock.getNode().innerText="0".padStart(2,"0");
    this.#secondsBlock.getNode().innerText="0".padStart(2,"0");
  }

  getValue(){
   return[this.#minutesValue,this.#secondsValue];
  }

  #counting(){
    const differenceMs= Date.now() - this.#startTime;
    this.#minutesValue= new Date(differenceMs).getMinutes().toString().padStart(2,"0");
    this.#secondsValue= new Date(differenceMs).getSeconds().toString().padStart(2,"0");

    this.#minutesBlock.getNode().innerText=this.#minutesValue;
    this.#secondsBlock.getNode().innerText=this.#secondsValue;
  }
}
