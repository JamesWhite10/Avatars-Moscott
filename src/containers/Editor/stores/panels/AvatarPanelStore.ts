import { makeAutoObservable } from 'mobx';
import { EmitterInterface } from '../../../../stores/EmitterInterface';
import EventEmitter from 'eventemitter3';
import { Avatar } from '../../../../types/index';

export type AvatarPanelId = 'avatar';

export type AvatarPanelEventsType = {
  characterChange: (id: string) => void;
  characterSelectionClosed: () => void;
};

export default class AvatarPanelStore implements EmitterInterface<AvatarPanelEventsType> {
  public readonly panelId: AvatarPanelId = 'avatar';

  public eventEmitter!: EventEmitter<AvatarPanelEventsType>;

  public isPrepared = false;

  public characters: Avatar[] = [];

  public character?: Avatar = undefined;

  public characterIsChanging = false;

  public showCharacterSelection = false;

  public controlElement: HTMLButtonElement | null = null;

  constructor() {
    this.eventEmitter = new EventEmitter();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public setUp(characters: Avatar[]): Avatar | void {
    if (this.isPrepared) return;
    this.characters = characters;
    this.isPrepared = true;
    const character = characters[Math.floor((Math.random() * this.characters.length) + 1) - 1];
    this.character = character;
    return character;
  }

  public subscribe<T extends keyof AvatarPanelEventsType>(
    event: T,
    handler: AvatarPanelEventsType[T],
  ): void {
    // TODO небольшой хак, нужно разобраться с типами
    this.eventEmitter.on(event, handler as (...args: any) => void);
  }

  public setControlElement(el: HTMLButtonElement | null): void {
    this.controlElement = el;
  }

  public off(event: keyof AvatarPanelEventsType): void {
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
    if (!characterCandidate || characterCandidate.name === this.character?.name) return;
    this.setShowCharacterSelection(false);
    this.character = characterCandidate;
    this.eventEmitter.emit('characterChange', id);
  }

  public setCharacter(avatarName: string): void {
    this.character = this.characters.find((character) => character.name === avatarName);
  }
}
