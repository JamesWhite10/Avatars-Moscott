import { makeAutoObservable } from 'mobx';
import { MaskottStyle } from '../../../types/maskott';
import { EmitterInterface } from '../../../stores/EmitterInterface';
import EventEmitter from 'eventemitter3';

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

export type StyleStoreEventsType = {
  styleChange: (id: string) => void;
  styleSelectionClosed: () => void;
};

export default class StyleStore implements EmitterInterface<StyleStoreEventsType> {
  public activeStyle?: string = 'style_one';

  public styles: MaskottStyle[] = mockStyles;

  public showStyleSelection = false;

  public controlElement: HTMLButtonElement | null = null;

  public eventEmitter!: EventEmitter<StyleStoreEventsType>;

  constructor() {
    this.eventEmitter = new EventEmitter();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public setActiveStyle(style?: string): void {
    this.activeStyle = style;
  }

  public setStyles(styles: MaskottStyle[]): void {
    this.styles = styles;
  }

  public setShowStyleSelection(show: boolean): void {
    this.showStyleSelection = show;
    if (!show) this.eventEmitter.emit('styleSelectionClosed');
  }

  public setControlElement(el: HTMLButtonElement | null): void {
    this.controlElement = el;
  }

  public onStyleChange(id: string): void {
    this.activeStyle = id;
    this.eventEmitter.emit('styleChange', id);
  }

  public off(event: keyof StyleStoreEventsType): void {
    this.eventEmitter.off(event);
  }

  public subscribe<E extends keyof StyleStoreEventsType>(event: E, handler: StyleStoreEventsType[E]): void {
    this.eventEmitter.on(event, handler as (...args: any) => void);
  }
}
