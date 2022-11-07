import { makeAutoObservable } from 'mobx';
import { SendFormResultStatus } from '../containers/About/config';
import MiraImage from '@app/config/aboutIcon/MiraAbout.png';
import YukiImage from '@app/config/aboutIcon/YukiAbout.png';

export default class AboutStore {
  public characterImage = '';

  public sendFormResultStatus?: string | undefined = undefined as unknown as SendFormResultStatus;

  public aboutModalIsOpen: boolean = false;

  public mobileFormIsOpen: boolean = false;

  public formResultModalIsOpen: boolean = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setSendFormResultStatus(sendFormResultStatus: string | undefined) {
    this.sendFormResultStatus = sendFormResultStatus;
  }

  setCharacterImage(characterName: string) {
    if (characterName === 'Mira') this.characterImage = MiraImage.src;
    if (characterName === 'Yuki') this.characterImage = YukiImage.src;
  }

  public setMobileFormIsOpen(enable: boolean): void {
    this.mobileFormIsOpen = enable;
  }

  public setFormResultModalIsOpen(enable: boolean): void {
    this.formResultModalIsOpen = enable;
  }

  public async sendForm() {
    try {
      this.setSendFormResultStatus('success');
    } catch (error) {
      console.log(error);
      this.setSendFormResultStatus('errorRetry');
    } finally {
      this.setSendFormResultStatus('errorReload');
    }
  }
}
