import { Container } from '../../../../modules/block';
import type { MessagePayload } from '../../../../modules/types';
import { Chat } from '../../chat';
import Message from '../message';
import MessagesDB from '../messages-base';
import { UserList } from '../users-block';

export default class MessagesUI extends Container {
  constructor() {
    super('messages-list');
  }
  public addMessage(data: MessagePayload): void {
    const message = new Message(data);
    MessagesDB.messages.set(data.id, message);
    const selectedUser = Chat.getSelected();
    if (data.from === selectedUser || data.to === selectedUser) {
      this.addBlock(message);
      this.element.scrollTop = this.element.scrollHeight;
      if (data.to === selectedUser) {
        Chat.clearText();
      }
    } else {
      UserList.increaseUnreadCount(data.from, 1);
    }
  }

  public addMessages(data: MessagePayload[]): void {
    data.forEach((message) => this.addMessage(message));
  }
  public clearList(): void {
    this.deleteAllBlocks();
  }
}
