import { makeAutoObservable } from 'mobx';

export type ShoesPanelId = 'shoes';

export default class ShoesPanelStore {
  public readonly panelId: ShoesPanelId = 'shoes';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
