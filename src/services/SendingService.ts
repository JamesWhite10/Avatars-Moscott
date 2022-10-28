import instance from '../../pages/api/api';
import { UserData } from '../containers/Editor/containers/About/Form';

export default class SendingService {
  static async send(name: string, phone: string, email: string, comments: string): Promise<UserData> {
    return instance.post('/', { name, phone, email, comments });
  }
}
