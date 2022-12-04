import { makeAutoObservable } from 'mobx';

export type AnimationsPanelId = 'animations';

export default class AnimationsPanelStore {
  public readonly panelId: AnimationsPanelId = 'animations';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
