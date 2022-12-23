import { makeAutoObservable } from 'mobx';
import { AvatarPart } from '../../../../types/index';
import { EmitterInterface } from '../../../../stores/EmitterInterface';
import EventEmitter from 'eventemitter3';

export type BodyPanelId = 'body';

export type BodyPanelEventsType = {
  bodyChange: (body: AvatarPart) => void;
  bodySelectionClosed: () => void;
};

export default class BodyPanelStore implements EmitterInterface<BodyPanelEventsType> {
  public readonly panelId: BodyPanelId = 'body';

  public activeBody?: string = 'body_one';

  public activeBodyFilter?: string = undefined;

  public _bodies: AvatarPart[] = [];

  public showBodySelection = false;

  public controlElement: HTMLButtonElement | null = null;

  public eventEmitter!: EventEmitter<BodyPanelEventsType>;

  public isLoadingBody = false;

  constructor() {
    this.eventEmitter = new EventEmitter();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get bodies(): AvatarPart[] {
    return this._bodies;
  }

  public setActiveBody(body?: string): void {
    this.activeBody = body;
  }

  public setBodies(bodies: AvatarPart[]): void {
    this._bodies = bodies;
  }

  public setShowBodySelection(show: boolean): void {
    this.showBodySelection = show;
    if (!show) this.eventEmitter.emit('bodySelectionClosed');
  }

  public setControlElement(el: HTMLButtonElement | null): void {
    this.controlElement = el;
  }

  public onBodyChange(body: AvatarPart): void {
    if (body.id !== this.activeBody) {
      this.activeBody = body.id;
      this.eventEmitter.emit('bodyChange', body);
    }
  }

  public setLoadingBody(loading: boolean): void {
    this.isLoadingBody = loading;
  }

  public off(event: keyof BodyPanelEventsType): void {
    this.eventEmitter.off(event);
  }

  public subscribe<E extends keyof BodyPanelEventsType>(event: E, handler: BodyPanelEventsType[E]): void {
    this.eventEmitter.on(event, handler as (...args: any) => void);
  }

  public setActiveBodyFilter(prefix: string): void {
    this.activeBodyFilter = prefix;
  }
}
