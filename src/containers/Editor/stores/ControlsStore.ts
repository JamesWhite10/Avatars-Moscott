import { makeAutoObservable } from 'mobx';
import EventEmitter from 'eventemitter3';
import { MaskottStyle } from '../../../types/maskott';

export type ControlsEventType = {
  soundChange: () => void;
  takeScreenShot: () => void;
  styleChange: (id: string) => void;
};

const mockStyles: MaskottStyle[] = [
  {
    id: 'style_one',
    name: 'Style One',
    videoUrl: '/avatars/mira_style1.MP4',
  },
  {
    id: 'style_two',
    name: 'Style Two',
    videoUrl: '/avatars/mira_style2.MP4',
  },
  {
    id: 'style_three',
    name: 'Style Three',
    videoUrl: '/avatars/mira_style1.MP4',
  },
  {
    id: 'style_four',
    name: 'Style Four',
    videoUrl: '/avatars/mira_style2.MP4',
  },
];

export type AvatarPropertyType = 'style' | 'accessories' | 'character';

export default class ControlsStore {
  public fullScreenMode: boolean = false;

  public soundDisabled: boolean = false;

  /**
   * TODO подумать, возможно должно будет уехать в подстор
   */
  public activeProperty?: AvatarPropertyType = undefined;

  public activeStyle?: string = 'style_one';

  public styles: MaskottStyle[] = mockStyles;

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
  }

  public setActiveStyle(style?: string): void {
    this.activeStyle = style;
  }

  public setStyles(styles: MaskottStyle[]): void {
    this.styles = styles;
  }

  public onStyleChange(id: string): void {
    this.activeStyle = id;
    this.eventEmitter.emit('styleChange', id);
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
