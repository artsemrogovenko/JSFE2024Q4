import {
  isMsgDelete,
  isMsgEdit,
  isMsgRead,
  isNotifyMsg,
} from '../../../api/utils';
import Message from './message';

export default class MessagesDB {
  public static messages = new Map<string, Message>();

  public static updateStatus(uuid: string, payload: object): void {
    if (isNotifyMsg(payload)) {
      const messageId = payload.message.id;
      const status = payload.message.status;
      const message = this.messages.get(messageId);
      if (message) {
        if (isMsgEdit(status)) {
          message.edited();
        }
        if (isMsgDelete(status)) {
          message.deleted();
        }
        if (isMsgRead(status)) {
          message.readed();
        }
      }
    }
  }
}
