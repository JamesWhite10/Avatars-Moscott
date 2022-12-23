import { makeAutoObservable } from 'mobx';
import { EmitterInterface } from '../../../../stores/EmitterInterface';
import EventEmitter from 'eventemitter3';
import { AvatarPart } from '../../../../types/index';

export type HeadPanelId = 'head';

export type HeadPanelEventsType = {
  headChange: (head: AvatarPart) => void;
  headSelectionClosed: () => void;
};

export default class HeadPanelStore implements EmitterInterface<HeadPanelEventsType> {
  public readonly panelId: HeadPanelId = 'head';

  public activeHead?: string = 'head_one';

  public activeHeadFilter?: string = undefined;

  public _heads: AvatarPart[] = [];

  public showHeadSelection = false;

  public controlElement: HTMLButtonElement | null = null;

  public eventEmitter!: EventEmitter<HeadPanelEventsType>;

  public isLoadingHead = false;

  constructor() {
    this.eventEmitter = new EventEmitter();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get heads(): AvatarPart[] {
    return this._heads;
  }

  public setActiveHead(head?: string): void {
    this.activeHead = head;
  }

  public setHeads(heads: AvatarPart[]): void {
    this._heads = heads;
  }

  public setShowHeadSelection(show: boolean): void {
    this.showHeadSelection = show;
    if (!show) this.eventEmitter.emit('headSelectionClosed');
  }

  public setControlElement(el: HTMLButtonElement | null): void {
    this.controlElement = el;
  }

  public onHeadChange(head: AvatarPart): void {
    if (head.id !== this.activeHead) {
      this.activeHead = head.id;
      this.eventEmitter.emit('headChange', head);
    }
  }

  public setLoadingHead(loading: boolean): void {
    this.isLoadingHead = loading;
  }

  public off(event: keyof HeadPanelEventsType): void {
    this.eventEmitter.off(event);
  }

  public subscribe<E extends keyof HeadPanelEventsType>(event: E, handler: HeadPanelEventsType[E]): void {
    this.eventEmitter.on(event, handler as (...args: any) => void);
  }

  public setActiveHeadFilter(prefix: string): void {
    this.activeHeadFilter = prefix;
  }
}
