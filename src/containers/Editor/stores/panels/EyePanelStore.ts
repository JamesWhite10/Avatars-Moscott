import { makeAutoObservable } from 'mobx';
import { AvatarPart } from '../../../../types/index';
import { EmitterInterface } from '../../../../stores/EmitterInterface';
import EventEmitter from 'eventemitter3';

export type EyePanelId = 'eye';

export type EyePanelEventsType = {
  eyeChange: (eye: string) => void;
  eyeSelectionClosed: () => void;
};

export default class EyePanelStore implements EmitterInterface<EyePanelEventsType> {
  public readonly panelId: EyePanelId = 'eye';

  public activeEye?: string = 'eye_one';

  public activeEyeFilter?: string = undefined;

  public _eyes: AvatarPart[] = [];

  public showEyeSelection = false;

  public controlElement: HTMLButtonElement | null = null;

  public eventEmitter!: EventEmitter<EyePanelEventsType>;

  public isLoadingEye = false;

  constructor() {
    this.eventEmitter = new EventEmitter();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get eyes(): AvatarPart[] {
    return this._eyes;
  }

  public setActiveEye(eye?: string): void {
    this.activeEye = eye;
  }

  public setEyes(eyes: AvatarPart[]): void {
    this._eyes = eyes;
  }

  public setShowEyeSelection(show: boolean): void {
    this.showEyeSelection = show;
    if (!show) this.eventEmitter.emit('eyeSelectionClosed');
  }

  public setControlElement(el: HTMLButtonElement | null): void {
    this.controlElement = el;
  }

  public onEyeChange(eye: string): void {
    if (eye !== this.activeEye) {
      this.activeEye = eye;
      this.eventEmitter.emit('eyeChange', eye);
    }
  }

  public setLoadingEye(loading: boolean): void {
    this.isLoadingEye = loading;
  }

  public off(event: keyof EyePanelEventsType): void {
    this.eventEmitter.off(event);
  }

  public subscribe<E extends keyof EyePanelEventsType>(event: E, handler: EyePanelEventsType[E]): void {
    this.eventEmitter.on(event, handler as (...args: any) => void);
  }

  public setActiveEyeFilter(prefix: string): void {
    this.activeEyeFilter = prefix;
  }
}
