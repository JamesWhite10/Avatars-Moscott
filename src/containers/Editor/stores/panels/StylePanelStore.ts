import { makeAutoObservable } from 'mobx';
import { EmitterInterface } from '../../../../stores/EmitterInterface';
import EventEmitter from 'eventemitter3';
import { Style } from '../../../../types/index';

export type StylePanelId = 'style';

export type StylePanelEventsType = {
  styleChange: (id: string) => void;
  styleSelectionClosed: () => void;
};

export default class StylePanelStore implements EmitterInterface<StylePanelEventsType> {
  public readonly panelId: StylePanelId = 'style';

  public activeStyle?: string = 'style_one';

  public activeStyleFilter?: string = undefined;

  public _styles: Style[] = [];

  public showStyleSelection = false;

  public controlElement: HTMLButtonElement | null = null;

  public eventEmitter!: EventEmitter<StylePanelEventsType>;

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

  public off(event: keyof StylePanelEventsType): void {
    this.eventEmitter.off(event);
  }

  public subscribe<E extends keyof StylePanelEventsType>(event: E, handler: StylePanelEventsType[E]): void {
    this.eventEmitter.on(event, handler as (...args: any) => void);
  }

  public setActiveStyleFilter(prefix: string): void {
    this.activeStyleFilter = prefix;
  }
}
