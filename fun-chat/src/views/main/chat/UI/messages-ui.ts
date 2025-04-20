import { Container } from '../../../../modules/block';
import type { MessagePayload } from '../../../../modules/types';
import { Chat } from '../../chat';
import Message from '../message';
import { UserList } from '../users-block';
import { updateMessageUI } from '../utils';
import { UnreadLine } from './uread-line';

export default class MessagesUI extends Container {
  public static dictionary = new Map<string, Message>();
  private delimeter: UnreadLine | null = null;
  constructor() {
    super('messages-list');
  }

  public static get(messageId: string): Message | undefined {
    return MessagesUI.dictionary.get(messageId);
  }
  public static clear(): void {
    return MessagesUI.dictionary.clear();
  }
  public addMessage(data: MessagePayload, fromDB?: boolean): void {
    const message = new Message(data);
    MessagesUI.dictionary.set(data.id, message);
    const selectedUser = Chat.getSelected();
    if (data.from === selectedUser || data.to === selectedUser) {
      if (
        !data.status.isReaded &&
        typeof fromDB === 'boolean' &&
        fromDB === true &&
        this.delimeter === null
      ) {
        if (data.to !== selectedUser) {
          this.delimeter = new UnreadLine();
          this.addBlock(this.delimeter);
        }
      }

      this.addBlock(message);

      if (this.delimeter === null) {
        this.element.scrollTop = this.element.scrollHeight;
        updateMessageUI(data.id, data.status);
        // message.readed();
      }
      if (data.to === selectedUser) {
        Chat.clearText();
      }
    } else {
      if (!data.status.isReaded)
        UserList.increaseUnreadCount(data.from, data.id);
    }
  }

  public appendMessages(data: MessagePayload[], fromDB: boolean): void {
    data.forEach((message) => this.addMessage(message, fromDB));
  }

  public clearList(): void {
    this.deleteAllBlocks();
  }

  public removeLine(login: string): void {
    if (login === Chat.getSelected()) {
      if (this.delimeter) {
        this.deleteBlock(this.delimeter);
        this.delimeter = null;
      }
    }
  }
}
