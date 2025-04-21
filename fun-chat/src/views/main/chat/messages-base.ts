import {
  isNotifyMsg,
  isMsgEdit,
  isMsgDelivered,
  isMsgDelete,
  isMsgRead,
} from '../../../api/types-verify';
import { MessagePayload } from '../../../modules/types';
import { Chat } from '../chat';
import { UserList } from './users-block';
import { saveToDbMessage, updateMessageUI } from './utils';

export default class MessagesDB {
  /**Храню ник собеседника и цепочку id сообщений с ним*/
  private static messagesChain = new Map<string, string[]>();
  private static messages = new Map<string, MessagePayload>();
  /** id сообщения , name собеседника */
  private static msgOwner = new Map<string, string>();

  public static clear(): void {
    this.messages.clear();
    this.messagesChain.clear();
    this.msgOwner.clear();
  }

  public static updateStatus(_uuid: string, payload: object): void {
    if (isNotifyMsg(payload)) {
      const messageId = payload.message.id;
      const status = payload.message.status;
      const message = this.messages.get(messageId);
      if (message) {
        const userName = this.msgOwner.get(messageId);
        if (isMsgEdit(status)) {
          message.status.isEdited = true;
        }
        if (isMsgDelivered(status)) {
          message.status.isDelivered = true;
        }
        if (isMsgDelete(status)) {
          if (userName) {
            UserList.decreaseUnreadCount(userName, messageId);
            this.messages.delete(messageId);
            Chat.history.checkHistory();
          }
        }
        if (isMsgRead(status)) {
          if (userName) UserList.decreaseUnreadCount(userName, messageId);
          message.status.isReaded = true;
        }
        updateMessageUI(messageId, status);
      }
    }
  }
  public static has(id: string): boolean {
    return this.messages.has(id);
  }

  public static saveMessage(
    id: string,
    message: MessagePayload,
    partner: string,
  ): void {
    if (!this.messages.has(id)) {
      if (!this.messagesChain.has(partner)) {
        this.messagesChain.set(partner, [id]);
      } else {
        let chain = this.messagesChain.get(partner);
        if (Array.isArray(chain)) {
          chain.push(id);
          this.messagesChain.set(partner, chain);
        }
      }

      this.messages.set(id, message);
      Chat.appendHistory(message);
      this.msgOwner.set(id, partner);
    }
  }

  public static addHistory(data: MessagePayload[]): void {
    data.forEach((payload) => {
      saveToDbMessage(payload);
    });
  }

  public static getChainMessages(
    partner: string,
  ): MessagePayload[] | undefined {
    const messagesId = this.messagesChain.get(partner);
    if (Array.isArray(messagesId)) {
      let result: MessagePayload[] = [];
      messagesId.forEach((id) => {
        const message = this.messages.get(id);
        if (message !== undefined) result.push(message);
      });
      return result;
    }
    return;
  }
}
