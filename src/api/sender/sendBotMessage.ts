import { instance } from '../client';

export interface SendBotMessageRequest {
  userName: string;
  phoneNumber: string;
  email: string;
  comments: string;
}

export interface SendBotMessageResponse {
  data: {
    message: string;
    success: boolean;
  };
}

export const sendBotMessage = {
  async post(data: SendBotMessageRequest): Promise<SendBotMessageResponse> {
    return instance.post<SendBotMessageRequest, SendBotMessageResponse>('/sender/send-bot-message', data);
  },
};
