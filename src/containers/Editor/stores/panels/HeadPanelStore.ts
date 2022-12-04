import { makeAutoObservable } from 'mobx';

export type HeadPanelId = 'head';

export default class HeadPanelStore {
  public readonly panelId: HeadPanelId = 'head';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
