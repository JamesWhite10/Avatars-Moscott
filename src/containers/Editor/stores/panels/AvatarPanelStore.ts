import { makeAutoObservable } from 'mobx';

export type AvatarPanelId = 'avatar';

export default class AvatarPanelStore {
  public readonly panelId: AvatarPanelId = 'avatar';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
