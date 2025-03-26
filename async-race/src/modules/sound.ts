import type State from '../application/state';

export class Sound {
  private state: State;
  private volume: number;
  constructor(state: State) {
    this.volume = 0;
    this.state = state;
    this.init();
  }

  public getSoundState(): boolean {
    return JSON.parse(this.state.getValue('sound'));
  }

  public mute(): void {
    this.volume = 0;
    this.state.setValue('sound', 'false');
  }

  public unMute(): void {
    this.volume = 1;
    this.state.setValue('sound', 'true');
  }

  private init(): void {
    const value = this.state.getValue('sound');
    if (value === '') {
      this.state.setValue('sound', JSON.stringify(true));
    } else {
      JSON.parse(value) ? (this.volume = 1) : (this.volume = 0);
    }
  }
}
