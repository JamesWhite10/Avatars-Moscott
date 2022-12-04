import { makeAutoObservable } from 'mobx';

export type StylePanelId = 'style';

export default class StylePanelStore {
  public readonly panelId: StylePanelId = 'style';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
