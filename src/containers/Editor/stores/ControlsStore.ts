import { makeAutoObservable } from 'mobx';
import EventEmitter from 'eventemitter3';

export type ControlsEventType = {
  soundChange: (isMuted: boolean) => void;
  takeScreenShot: () => void;
  styleSelect: () => void;
  characterSelect: () => void;
  animationSelect: () => void;
};

export type AvatarPropertyType = 'style' | 'accessories' | 'character' | 'animations';

export default class ControlsStore {
  public fullScreenMode: boolean = false;

  public soundDisabled: boolean = false;

  public activeProperty?: AvatarPropertyType = undefined;

  public eventEmitter!: EventEmitter<ControlsEventType>;

  constructor() {
    this.eventEmitter = new EventEmitter<ControlsEventType>();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public subscribe<T extends keyof ControlsEventType>(
    event: T,
    handler: ControlsEventType[T],
  ): void {
    // TODO небольшой хак, нужно разобраться с типами
    this.eventEmitter.on(event, handler as (...args: any) => void);
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

  public setActiveAvatarPropertyType(property?: AvatarPropertyType): void {
    this.activeProperty = property;
    switch (property) {
      case 'character':
        this.eventEmitter.emit('characterSelect');
        break;
      case 'style':
        this.eventEmitter.emit('styleSelect');
        break;
      case 'animations':
        this.eventEmitter.emit('animationSelect');
        break;
      default:
        break;
    }
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
    this.eventEmitter.emit('soundChange', this.soundDisabled);
    this.setSoundIsDisabled(!this.soundDisabled);
  };

  public onTakeScreenShot(): void {
    this.eventEmitter.emit('takeScreenShot');
  }
}
