import { makeAutoObservable } from 'mobx';
import EventEmitter from 'eventemitter3';

export type ControlsEventType = {
  soundChange: () => void;
  takeScreenShot: () => void;
};

export default class ControlsStore {
  public fullScreenMode: boolean = false;

  public soundDisabled: boolean = false;

  public eventEmitter!: EventEmitter<ControlsEventType>;

  constructor() {
    this.eventEmitter = new EventEmitter<ControlsEventType>();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public subscribe<T extends keyof ControlsEventType>(event: T, handler: ControlsEventType[T]): void {
    this.eventEmitter.on(event, handler);
  }

  public off(event: keyof ControlsEventType): void {
    this.eventEmitter.off(event);
  }

  public setFullScreenMode(enable: boolean): void {
    this.fullScreenMode = enable;
  }

  public setSoundIsDisabled(enable: boolean): void {
    this.soundDisabled = enable;
  }

  public onFullScreenChange(): Promise<void> {
    if (this.fullScreenMode) return document.exitFullscreen().then(() => this.setFullScreenMode(false));
    return document.body.requestFullscreen()
      .then(() => this.setFullScreenMode(true));
  }

  public onSoundChange = (): void => {
    this.setSoundIsDisabled(!this.soundDisabled);
    this.eventEmitter.emit('soundChange');
  };

  public onTakeScreenShot(): void {
    this.eventEmitter.emit('takeScreenShot');
  }
}
