import { makeAutoObservable } from 'mobx';
import { AxiosResponse } from 'axios';
import { UserData } from '../containers/About/components/AboutComponents/Form';
import { SendFormResultStatus } from '../containers/About/config';
import instance from '../../../api/client';
import MiraImage from '@app/config/aboutIcon/MiraAbout.png';
import YukiImage from '@app/config/aboutIcon/YukiAbout.png';

export default class AboutStore {
  sendData: AxiosResponse<UserData> = {} as AxiosResponse;

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

  setSendData(data: AxiosResponse<UserData>) {
    this.sendData = data;
  }

  setCharacterImage(characterImage: string) {
    this.characterImage = characterImage;
    if (characterImage === 'Mira') {
      this.setCharacterImage(MiraImage.src);
    } if (characterImage === 'Yuki') {
      this.setCharacterImage(YukiImage.src);
    }
  }

  public setMobileFormIsOpen(enable: boolean): void {
    this.mobileFormIsOpen = enable;
  }

  public setFormResultModalIsOpen(enable: boolean): void {
    this.formResultModalIsOpen = enable;
  }

  public async sendForm(name: string, phone: string, email: string, comments: string) {
    try {
      const response = await instance.post('/', { name, phone, email, comments });
      this.setSendFormResultStatus('success');
      this.setSendData(response);
    } catch (error) {
      console.log(error);
      this.setSendFormResultStatus('errorRetry');
    } finally {
      this.setSendFormResultStatus('errorReload');
    }
  }
}
