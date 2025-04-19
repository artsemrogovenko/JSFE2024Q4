import { Container } from '../../../../modules/block';
import type { MessagePayload } from '../../../../modules/types';
import { Chat } from '../../chat';
import Message from '../message';
import { UserList } from '../users-block';

export default class MessagesUI extends Container {
  public static dictionary = new Map<string, Message>();
  constructor() {
    super('messages-list');
  }

  public addMessage(data: MessagePayload): void {
    const message = new Message(data);
    MessagesUI.dictionary.set(data.id, message);
    const selectedUser = Chat.getSelected();
    if (data.from === selectedUser || data.to === selectedUser) {
      this.addBlock(message);
      this.element.scrollTop = this.element.scrollHeight;
      if (data.to === selectedUser) {
        Chat.clearText();
      }
    } else {
      if (!data.status.isReaded)
        UserList.increaseUnreadCount(data.from, data.id);
    }
  }

  public appendMessages(data: MessagePayload[]): void {
    data.forEach((message) => this.addMessage(message));
  }

  public clearList(): void {
    this.deleteAllBlocks();
  }
}
