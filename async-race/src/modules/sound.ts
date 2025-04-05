import type State from '../application/state';
import { appState } from '../application/state';
const base = import.meta.env.VITE_BASE;

export class Sound {
  public static children: Sound[] = [];
  public volume: GainNode;
  public soundEffects: Record<
    string,
    {
      gainNode?: GainNode;
      buffer?: AudioBuffer;
      sources: AudioBufferSourceNode[];
    }
  > = {};
  public context: AudioContext = new AudioContext();
  protected loudGain: number;
  protected IsMuted = false;
  private state: State;

  constructor() {
    this.volume = this.context.createGain();
    this.volume.gain.value = 1;
    this.state = appState;
    this.loudGain = 0.5;
    this.init();
    this.volume.connect(this.context.destination);
    Sound.children.push(this);
  }
  public static toggleVolume(): boolean {
    const currentState = appState.getValue('sound');
    const value = !JSON.parse(currentState);
    if (Sound.children.length > 0) {
      Sound.children.forEach((child) => {
        child.setVolume(Number(value));
      });
    } else {
      appState.setValue('sound', JSON.stringify(value));
    }
    return value;
  }

  public static stopAllSounds(): void {
    for (const instance of Sound.children) {
      for (const key in instance.soundEffects) {
        instance.stopSound(key);
      }
    }
    Sound.children = [];
  }

  public getSoundState(): boolean {
    return JSON.parse(this.state.getValue('sound'));
  }

  public mute(): void {
    this.volume.gain.value = 0;
    this.state.setValue('sound', 'false');
  }

  public unMute(): void {
    this.volume.gain.value = 1;
    this.state.setValue('sound', 'true');
  }

  public playSound(
    key: string,
    options: { loop?: boolean; playbackRate?: number } = {},
  ): void {
    if (this.soundEffects[key].buffer) {
      const source = this.context.createBufferSource();
      source.buffer = this.soundEffects[key].buffer!;
      source.loop = options.loop || false;
      source.playbackRate.value = options.playbackRate || 1.0;
      source.connect(this.volume);
      source.start();
      this.soundEffects[key].sources.push(source);
    }
  }
  public setVolume(value: number): void {
    this.volume.gain.value = value;
    appState.setValue('sound', value > 0 ? 'true' : 'false');
  }
  protected async loadAudio(url: string): Promise<AudioBuffer> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await this.context.decodeAudioData(arrayBuffer);
  }

  protected async preloader(soundFiles: Record<string, string>): Promise<void> {
    await Promise.all(
      Object.entries(soundFiles).map(async ([key, path]) => {
        try {
          this.soundEffects[key] = {
            buffer: await this.loadAudio(path),
            sources: [],
          };
        } catch (error) {}
      }),
    );
  }

  protected stopSound(key: string): void {
    if (!this.soundEffects[key]) return;
    this.soundEffects[key].sources.forEach((source) => source.stop());
    this.soundEffects[key].sources = [];
  }

  private init(): void {
    const value = this.state.getValue('sound');
    if (value === '') {
      this.state.setValue('sound', JSON.stringify(true));
    } else {
      JSON.parse(value) ? this.unMute() : this.mute();
    }
  }
}
export class ParticipantSound extends Sound {
  constructor() {
    super();
    this.soundEffects = {
      rave: { sources: [] },
      starter: { sources: [] },
      stop: { sources: [] },
      engine: { sources: [] },
    };

    this.preloader({
      rave: base + '/assets/sound/car-winner.mp3',
      starter: base + '/assets/sound/starter.mp3',
      stop: base + '/assets/sound/car-stop.mp3',
      engine: base + '/assets/sound/truck2.mp3',
    });
  }
  public destroy(): void {
    this.stopAll();
    this.context.close();
    const index = Sound.children.indexOf(this);
    if (index >= 0) Sound.children.splice(index, 1);
  }
  public stopAll(): void {
    for (const key in this.soundEffects) {
      this.stopSound(key);
    }
  }
  public starter(): void {
    this.playSound('starter');
  }

  public stopStarter(): void {
    this.stopSound('starter');
  }

  public broken(): void {
    this.playSound('stop');
  }

  public stopEngine(): void {
    this.stopSound('engine');
  }
  public rave(): void {
    this.playSound('rave');
  }

  public noiseEngine(pitch: number): void {
    const playbackRate = calculatePitch(pitch);
    this.stopEngine();
    if (!this.soundEffects.engine.buffer) return;
    const source = this.context.createBufferSource();
    source.buffer = this.soundEffects.engine.buffer;
    source.loop = true;
    source.playbackRate.value = playbackRate;

    if (!this.soundEffects.engine.gainNode) {
      this.soundEffects.engine.gainNode = this.context.createGain();
      this.soundEffects.engine.gainNode.gain.value = 1.0;
      this.soundEffects.engine.gainNode.connect(this.context.destination);
    }
    const gainNode = this.soundEffects.engine.gainNode;
    gainNode.gain.value = pitch === 1 ? this.loudGain : 1;
    source.connect(this.volume);
    source.start();

    this.soundEffects.engine.sources.push(source);
  }
}

function calculatePitch(pitchShift: number): number {
  const minVelocity = 50;
  const maxVelocity = 200;
  const minRate = 2;
  const maxRate = 10;
  if (pitchShift === 1) {
    return 1;
  }
  const normalized = (pitchShift - minVelocity) / (maxVelocity - minVelocity);
  return minRate + normalized * (maxRate - minRate);
}
