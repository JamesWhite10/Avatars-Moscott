import { makeAutoObservable } from 'mobx';
import EventEmitter from 'eventemitter3';
import { Maskott } from '../../../types/maskott';
import { EmitterInterface } from '../../../stores/EmitterInterface';

export type CharacterStoreEventsType = {
  characterChange: (id: string) => void;
  characterSelectionClosed: () => void;
};

export default class CharacterStore implements EmitterInterface<CharacterStoreEventsType> {
  public eventEmitter!: EventEmitter<CharacterStoreEventsType>;

  public isPrepared = false;

  public characters: Maskott[] = [];

  public character?: Maskott = undefined;

  public characterIsChanging = false;

  public showCharacterSelection = false;

  public controlElement: HTMLButtonElement | null = null;

  constructor() {
    this.eventEmitter = new EventEmitter();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public setUp(characters: Maskott[]): Maskott | void {
    if (this.isPrepared) return;
    this.characters = characters;
    this.isPrepared = true;
    const character = characters[Math.floor((Math.random() * this.characters.length) + 1) - 1];
    this.character = character;
    return character;
  }

  public subscribe<T extends keyof CharacterStoreEventsType>(
    event: T,
    handler: CharacterStoreEventsType[T],
  ): void {
    // TODO небольшой хак, нужно разобраться с типами
    this.eventEmitter.on(event, handler as (...args: any) => void);
  }

  public setControlElement(el: HTMLButtonElement | null): void {
    this.controlElement = el;
  }

  public off(event: keyof CharacterStoreEventsType): void {
    this.eventEmitter.off(event);
  }

  public setCharacterIsChanging(isChanging: boolean): void {
    this.characterIsChanging = isChanging;
  }

  public setShowCharacterSelection(show: boolean): void {
    this.showCharacterSelection = show;
    if (!show) this.eventEmitter.emit('characterSelectionClosed');
  }

  public onCharacterChange(id: string): void {
    const characterCandidate = this.characters.find((character) => character.id === id);
    if (!characterCandidate) return;
    this.setShowCharacterSelection(false);
    this.character = characterCandidate;
    this.eventEmitter.emit('characterChange', id);
  }

  public setCharacter(maskottName: string): void {
    this.character = this.characters.find((character) => character.name === maskottName);
  }
}
