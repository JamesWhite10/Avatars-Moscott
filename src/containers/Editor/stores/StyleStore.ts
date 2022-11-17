import { makeAutoObservable } from 'mobx';
import { Style } from '@app/types';
import { EmitterInterface } from '../../../stores/EmitterInterface';
import EventEmitter from 'eventemitter3';

export type StyleStoreEventsType = {
  styleChange: (id: string) => void;
  styleSelectionClosed: () => void;
};

export default class StyleStore implements EmitterInterface<StyleStoreEventsType> {
  public activeStyle?: string = 'style_one';

  public activeStyleFilter?: string = undefined;

  public _styles: Style[] = [];

  public showStyleSelection = false;

  public controlElement: HTMLButtonElement | null = null;

  public eventEmitter!: EventEmitter<StyleStoreEventsType>;

  public isLoadingStyle = false;

  constructor() {
    this.eventEmitter = new EventEmitter();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get styles(): Style[] {
    if (!this.activeStyleFilter) return this._styles;
    return this._styles.filter((style) => {
      return style.id.split('_')[0] === (this.activeStyleFilter || '').toLowerCase();
    });
  }

  public setActiveStyle(style?: string): void {
    this.activeStyle = style;
  }

  public setStyles(styles: Style[]): void {
    this._styles = styles;
  }

  public setShowStyleSelection(show: boolean): void {
    this.showStyleSelection = show;
    if (!show) this.eventEmitter.emit('styleSelectionClosed');
  }

  public setControlElement(el: HTMLButtonElement | null): void {
    this.controlElement = el;
  }

  public onStyleChange(id: string): void {
    if (id !== this.activeStyle) {
      this.activeStyle = id;
      this.eventEmitter.emit('styleChange', id);
    }
  }

  public setLoadingStyle(loading: boolean): void {
    this.isLoadingStyle = loading;
  }

  public off(event: keyof StyleStoreEventsType): void {
    this.eventEmitter.off(event);
  }

  public subscribe<E extends keyof StyleStoreEventsType>(event: E, handler: StyleStoreEventsType[E]): void {
    this.eventEmitter.on(event, handler as (...args: any) => void);
  }

  public setActiveStyleFilter(prefix: string): void {
    this.activeStyleFilter = prefix;
  }
}
