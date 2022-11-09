import { makeAutoObservable } from 'mobx';
import { sendBotMessage } from '../../../api/sender/index';

type SendFormResultStatusType = 'success' | 'errorRetry' | 'errorReload';

export default class AboutStore {
  public characterImage = '';

  public sendFormResultStatus?: SendFormResultStatusType = undefined;

  public aboutModalIsOpen: boolean = false;

  public mobileFormIsOpen: boolean = false;

  public formResultModalIsOpen: boolean = false;

  public formIsSending: boolean = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setCharacterImage(image: string = '') {
    this.characterImage = image;
  }

  public setMobileFormIsOpen(enable: boolean): void {
    this.mobileFormIsOpen = enable;
  }

  public setFormResultModalIsOpen(enable: boolean): void {
    this.formResultModalIsOpen = enable;
  }

  public setFormIsSending(enable: boolean): void {
    this.formIsSending = enable;
  }

  public async sendForm(userName: string, phoneNumber: string, email: string, comments: string) {
    this.setFormIsSending(true);
    await sendBotMessage.post({ userName, phoneNumber, email, comments }).then(() => {
      this.sendFormResultStatus = 'success';
      this.setFormIsSending(false);
    }).catch(() => {
      this.sendFormResultStatus = 'errorReload';
    });
  }
}
