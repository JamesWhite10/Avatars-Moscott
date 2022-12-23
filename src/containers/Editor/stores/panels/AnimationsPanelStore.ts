import { makeAutoObservable } from 'mobx';
import { EmitterInterface } from '../../../../stores/EmitterInterface';
import EventEmitter from 'eventemitter3';
import { AnimationsType } from '../../../../types/index';

export type AnimationsPanelId = 'animations';

export type AnimationsPanelEventsType = {
  animation_select: (id: string) => void;
  selection_closed: () => void;
  pause: (paused: boolean) => void;
  stop: () => void;
};

export default class AnimationsPanelStore implements EmitterInterface<AnimationsPanelEventsType> {
  public readonly panelId: AnimationsPanelId = 'animations';

  public showAnimationSelection = false;

  public animations: AnimationsType[] = [];

  public activeAnimationId?: string = undefined;

  public isPaused: boolean = false;

  public progress = 0;

  public controlElements: HTMLButtonElement[] = [];

  public isLoadAnimation: boolean = false;

  eventEmitter!: EventEmitter<AnimationsPanelEventsType>;

  constructor() {
    this.eventEmitter = new EventEmitter<AnimationsPanelEventsType>();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  off(event: keyof AnimationsPanelEventsType): void {
    this.eventEmitter.off(event);
  }

  subscribe<E extends keyof AnimationsPanelEventsType>(event: E, handler: AnimationsPanelEventsType[E]): void {
    this.eventEmitter.on(event, handler as (...args: any) => void);
  }

  public onAnimationSelect(id: string): void {
    this.activeAnimationId = id;
    this.eventEmitter.emit('animation_select', id);
  }

  public setAnimations(animations: AnimationsType[]): void {
    this.animations = animations;
  }

  public setControlElement(el: HTMLButtonElement | null): void {
    if (el) this.controlElements?.push(el);
  }

  public setAnimationLoading(value: boolean): void {
    this.isLoadAnimation = value;
  }

  public setActiveAnimationId(id?: string): void {
    this.activeAnimationId = id;
    if (id) this.eventEmitter.emit('animation_select', id);
  }

  public setIsPaused(paused: boolean): void {
    this.isPaused = paused;
    this.eventEmitter.emit('pause', paused);
  }

  public onStop(): void {
    this.setActiveAnimationId();
    this.eventEmitter.emit('stop');
  }

  public setProgress(progress: number): void {
    this.progress = progress;
  }

  public setShowAnimationSelection(show: boolean): void {
    this.showAnimationSelection = show;
    if (!show) this.eventEmitter.emit('selection_closed');
  }
}
