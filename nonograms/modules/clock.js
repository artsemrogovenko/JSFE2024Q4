import { startTicking, stopTicking } from './audio.js';

export default class Clock {
  #startTime;
  #minutesValue;
  #secondsValue;
  #interval;
  #minutesBlock;
  #secondsBlock;
  #differenceMs;
  #loadedMs;

  constructor(minutes, seconds) {
    this.#startTime = new Date();
    this.#minutesBlock = minutes;
    this.#secondsBlock = seconds;
    this.#interval = {};
    this.#loadedMs = 0;
    this.#differenceMs = 0;
  }

  startClock() {
    this.#startTime = Date.now();
    this.#interval.time = setInterval(this.#counting.bind(this), 1000);
    startTicking();
  }

  stopClock() {
    this.#loadedMs = this.#differenceMs;
    clearInterval(this.#interval.time);
    stopTicking();
  }

  resetClock() {
    this.#minutesBlock.getNode().innerText = '0'.padStart(2, '0');
    this.#secondsBlock.getNode().innerText = '0'.padStart(2, '0');
    this.#differenceMs = 0;
    this.#loadedMs = 0;
  }

  getValue() {
    return [this.#minutesValue, this.#secondsValue];
  }

  #counting() {
    this.#differenceMs = Date.now() + this.#loadedMs - this.#startTime;
    this.#updateFields(this.#differenceMs);
  }

  get currentDuration() {
    return this.#differenceMs;
  }

  set gameDuration(ms) {
    this.#loadedMs = ms;
    this.#updateFields(ms);
  }

  #updateFields(ms){
    this.#minutesValue = new Date(ms)
      .getMinutes()
      .toString()
      .padStart(2, '0');
    this.#secondsValue = new Date(ms)
      .getSeconds()
      .toString()
      .padStart(2, '0');

    this.#minutesBlock.getNode().innerText = this.#minutesValue;
    this.#secondsBlock.getNode().innerText = this.#secondsValue;
  }
}
