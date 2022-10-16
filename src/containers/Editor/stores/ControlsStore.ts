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
    /**
     * FullScreen API отличается для SAFARI и всего остального
     * В частности в том что SAFARI - не возвращает Promise
     */
    const requestFn = document.body.requestFullscreen ?? (document.body as any).webkitRequestFullscreen;
    const requestFullScreen = requestFn.bind(document.body);
    const exitFunc = document.exitFullscreen ?? (document as any).webkitExitFullscreen;
    const exitFullScreen = exitFunc.bind(document);
    if (this.fullScreenMode) {
      this.setFullScreenMode(false);
      return exitFullScreen();
    }
    this.setFullScreenMode(true);
    return requestFullScreen();
  }

  public onSoundChange = (): void => {
    this.setSoundIsDisabled(!this.soundDisabled);
    this.eventEmitter.emit('soundChange');
  };

  public onTakeScreenShot(): void {
    this.eventEmitter.emit('takeScreenShot');
  }
}
