import type State from '../application/state';
import pathFile from '../assets/win.mp3';
const winnerAudio = new Audio(pathFile);

export class Sound {
  private state: State;
  private fanfare = winnerAudio;
  constructor(state: State) {
    this.state = state;
    this.init();
  }

  public getSoundState(): boolean {
    return JSON.parse(this.state.getValue('sound'));
  }

  public playFanfare(): void {
    this.fanfare.play();
  }

  public mute(): void {
    this.fanfare.volume = 0;
  }

  public unMute(): void {
    this.fanfare.volume = 1;
  }
  private init(): void {
    const value = this.state.getValue('sound');
    if (value === '') {
      this.state.setValue('sound', JSON.stringify(true));
      this.fanfare.volume = 1;
    } else {
      value ? (this.fanfare.volume = 1) : (this.fanfare.volume = 0);
    }
  }
}
