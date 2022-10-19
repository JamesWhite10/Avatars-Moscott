import EventEmitter, { ValidEventTypes } from 'eventemitter3';

export interface EmitterInterface<T extends ValidEventTypes> {
  eventEmitter: EventEmitter<T>;

  subscribe<E extends keyof T >(
    event: E,
    handler: T[E],
  ): void;

  off(event: keyof T): void;
}
