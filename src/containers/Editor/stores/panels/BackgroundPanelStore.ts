import { makeAutoObservable } from 'mobx';

export type BackgroundPanelType = 'background';

export default class BackgroundPanelStore {
  public readonly panelId: BackgroundPanelType = 'background';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
