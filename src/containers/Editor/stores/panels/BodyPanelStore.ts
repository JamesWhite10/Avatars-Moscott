import { makeAutoObservable } from 'mobx';

export type BodyPanelId = 'body';

export default class BodyPanelStore {
  public readonly panelId: BodyPanelId = 'body';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
