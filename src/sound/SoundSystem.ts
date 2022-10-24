import { Howl, Howler } from 'howler';

export type SoundItem = Record<string, Howl>;

export default class SoundSystem {
  protected soundPool: SoundItem = {};

  constructor() {
    // For autoplay
    Howler.autoUnlock = true;
    Howler.html5PoolSize = 100;
  }

  public addSound(name: string, source: string, loop = false): void {
    if (this.soundPool[name]) return;
    this.soundPool[name] = new Howl({
      src: [source],
      html5: true,
      loop,
    });
  }

  public removeSound(name: string): void {
    if (!this.soundPool[name]) return;
    this.soundPool[name].unload();
    delete this.soundPool[name];
  }

  public playSound(name: string, force = false): void {
    const sound = this.soundPool[name];
    if (!sound) return;
    if (!force) {
      if (sound.playing()) return;
    }
    if (this.soundPool[name]) this.soundPool[name].play();
  }

  public pauseSound(name: string): void {
    if (this.soundPool[name]) this.soundPool[name].pause();
  }

  public isPlaying(name: string): boolean {
    const sound = this.soundPool[name];
    if (!sound) return false;
    return sound.playing();
  }

  public mute(mute: boolean, name?: string): void {
    if (name) {
      if (this.soundPool[name]) this.soundPool[name].mute(mute);
      return;
    }
    Object.keys(this.soundPool).forEach((soundName) => {
      this.soundPool[soundName].mute(mute);
    });
  }
}
