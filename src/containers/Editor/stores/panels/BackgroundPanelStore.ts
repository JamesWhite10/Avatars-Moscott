import { makeAutoObservable } from 'mobx';

export type BackgroundPanelId = 'background';

export default class BackgroundPanelStore {
  public readonly panelId: BackgroundPanelId = 'background';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
