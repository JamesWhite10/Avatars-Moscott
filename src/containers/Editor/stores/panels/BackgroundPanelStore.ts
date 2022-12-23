import { makeAutoObservable } from 'mobx';
import { EmitterInterface } from '../../../../stores/EmitterInterface';
import EventEmitter from 'eventemitter3';
import { BackgroundPart } from '../../../../types/index';

export type BackgroundPanelId = 'background';

export type BackgroundPanelEventsType = {
  backgroundChange: (background: BackgroundPart) => void;
  backgroundSelectionClosed: () => void;
};

export default class BackgroundPanelStore implements EmitterInterface<BackgroundPanelEventsType> {
  public readonly panelId: BackgroundPanelId = 'background';

  public activeBackground?: string = 'background_one';

  public activeBackgroundFilter?: string = undefined;

  public _backgrounds: BackgroundPart[] = [];

  public showBackgroundSelection = false;

  public controlElement: HTMLButtonElement | null = null;

  public eventEmitter!: EventEmitter<BackgroundPanelEventsType>;

  public isLoadingBackground = false;

  constructor() {
    this.eventEmitter = new EventEmitter();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get backgrounds(): BackgroundPart[] {
    return this._backgrounds;
  }

  public setActiveBackground(backgrounds?: string): void {
    this.activeBackground = backgrounds;
  }

  public setBackgrounds(backgrounds: BackgroundPart[]): void {
    this._backgrounds = backgrounds;
  }

  public setShowBackgroundSelection(show: boolean): void {
    this.showBackgroundSelection = show;
    if (!show) this.eventEmitter.emit('backgroundSelectionClosed');
  }

  public setControlElement(el: HTMLButtonElement | null): void {
    this.controlElement = el;
  }

  public onBackgroundChange(background: BackgroundPart): void {
    if (background.id !== this.activeBackground) {
      this.activeBackground = background.id;
      this.eventEmitter.emit('backgroundChange', background);
    }
  }

  public setLoadingBackground(loading: boolean): void {
    this.isLoadingBackground = loading;
  }

  public off(event: keyof BackgroundPanelEventsType): void {
    this.eventEmitter.off(event);
  }

  public subscribe<E extends keyof BackgroundPanelEventsType>(event: E, handler: BackgroundPanelEventsType[E]): void {
    this.eventEmitter.on(event, handler as (...args: any) => void);
  }

  public setActiveBackgroundFilter(prefix: string): void {
    this.activeBackgroundFilter = prefix;
  }
}
