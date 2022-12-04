import { makeAutoObservable } from 'mobx';

export type EyePanelId = 'eye';

export default class EyePanelStore {
  public readonly panelId: EyePanelId = 'eye';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
