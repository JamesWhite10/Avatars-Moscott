import { makeAutoObservable } from 'mobx';
import { EmitterInterface } from '../../../stores/EmitterInterface';
import EventEmitter from 'eventemitter3';
import { AnimationsType } from '../../../types/index';

export type AnimationEventsType = {
  animation_select: (id: string) => void;
  selection_closed: () => void;
  pause: (paused: boolean) => void;
  stop: () => void;
};

export default class AnimationStore implements EmitterInterface<AnimationEventsType> {
  public showAnimationSelection = false;

  public animations: AnimationsType[] = [];

  public activeAnimationId?: string = undefined;

  public isPaused: boolean = false;

  public progress = 0;

  public controlElement: HTMLButtonElement | null = null;

  public isLoadAnimation: boolean = false;

  eventEmitter!: EventEmitter<AnimationEventsType>;

  constructor() {
    this.eventEmitter = new EventEmitter<AnimationEventsType>();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  off(event: keyof AnimationEventsType): void {
    this.eventEmitter.off(event);
  }

  subscribe<E extends keyof AnimationEventsType>(event: E, handler: AnimationEventsType[E]): void {
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
    this.controlElement = el;
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
