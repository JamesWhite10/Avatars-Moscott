import { makeAutoObservable } from 'mobx';
import { AvatarPart } from '../../../../types/index';
import { EmitterInterface } from '../../../../stores/EmitterInterface';
import EventEmitter from 'eventemitter3';

export type ShoesPanelId = 'shoes';

export type ShoesPanelEventsType = {
  shoesChange: (head: AvatarPart) => void;
  shoesSelectionClosed: () => void;
};

export default class ShoesPanelStore implements EmitterInterface<ShoesPanelEventsType> {
  public readonly panelId: ShoesPanelId = 'shoes';

  public activeShoes?: string = 'shoes_one';

  public activeShoesFilter?: string = undefined;

  public _shoes: AvatarPart[] = [];

  public showShoesSelection = false;

  public controlElement: HTMLButtonElement | null = null;

  public eventEmitter!: EventEmitter<ShoesPanelEventsType>;

  public isLoadingShoes = false;

  constructor() {
    this.eventEmitter = new EventEmitter();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get shoes(): AvatarPart[] {
    return this._shoes;
  }

  public setActiveShoes(shoes?: string): void {
    this.activeShoes = shoes;
  }

  public setShoes(shoes: AvatarPart[]): void {
    this._shoes = shoes;
  }

  public setShowShoesSelection(show: boolean): void {
    this.showShoesSelection = show;
    if (!show) this.eventEmitter.emit('shoesSelectionClosed');
  }

  public setControlElement(el: HTMLButtonElement | null): void {
    this.controlElement = el;
  }

  public onShoesChange(shoe: AvatarPart): void {
    if (shoe.id !== this.activeShoes) {
      this.activeShoes = shoe.id;
      this.eventEmitter.emit('shoesChange', shoe);
    }
  }

  public setLoadingShoes(loading: boolean): void {
    this.isLoadingShoes = loading;
  }

  public off(event: keyof ShoesPanelEventsType): void {
    this.eventEmitter.off(event);
  }

  public subscribe<E extends keyof ShoesPanelEventsType>(event: E, handler: ShoesPanelEventsType[E]): void {
    this.eventEmitter.on(event, handler as (...args: any) => void);
  }

  public setActiveShoesFilter(prefix: string): void {
    this.activeShoesFilter = prefix;
  }
}
