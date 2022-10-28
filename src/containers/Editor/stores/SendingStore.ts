import { UserData } from '../containers/About/Form';
import { makeAutoObservable } from 'mobx';
import SendingService from '../../../services/SendingService';
import { EStatus } from '../containers/About/config';

export default class SendingStore {
  sendData = {} as UserData;

  isSend = '';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setSend(bool: string) {
    this.isSend = bool;
  }

  setSendData(data: UserData) {
    this.sendData = data;
  }

  public async send(name: string, phone: string, email: string, comments: string) {
    try {
      const response = await SendingService.send(name, phone, email, comments);
      this.setSend(EStatus.errorReload);
      this.setSendData(response);
    } catch (error) {
      console.log(error);
      this.setSend(EStatus.errorRetry);
    } finally {
      this.setSend(EStatus.success);
    }
  }
}
