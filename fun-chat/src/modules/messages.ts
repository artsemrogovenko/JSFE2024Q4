import { appLogic } from '..';
import Chat from '../views/main/chat';
import { UserList } from '../views/main/chat/users-block';
import { Container } from './block';
import { Label } from './form';
import type { MessagePayload, MessageStatuses } from './types';

export default class Messages extends Container {
  private messages = new Map<string, Message>();
  constructor() {
    super('messages-list');
  }

  public addMessage(data: MessagePayload): void {
    let message = new Message(data);
    this.messages.set(data.id, message);
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
}

class Message extends Container {
  private from = new Label('message-from');
  private timestamp = new Label('message-date');
  private text = new Label('message');
  private status = new Label('message-status');
  constructor(data: MessagePayload) {
    super('wrapper-message');
    this.addBlocks([this.from, this.timestamp, this.text, this.status]);
    this.text.setText(data.text);
    const timestamp = new Date(data.datetime);
    const format: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    this.timestamp.setText(timestamp.toLocaleDateString('ru-RU', format));
    const forMe = appLogic.currentName === data.to;
    if (!forMe) {
      this.addClass('you');
    }
    this.setProperties(data.status, forMe);
  }

  public delivered(forMe: boolean): void {
    !forMe ? this.status.setText('доставлено') : this.status.setText('ᅟ');
  }
  public readed(forMe: boolean): void {
    !forMe ? this.status.setText('прочитано') : this.status.setText('ᅟ');
  }
  public edited(): void {
    this.status.addClass('edited');
  }

  private setProperties(data: MessageStatuses, forMe: boolean): void {
    if (!data.isDelivered && !data.isReaded) {
      this.status.setText('отправлено');
    }
    if (data.isDelivered && !data.isReaded) {
      this.delivered(forMe);
    }
    if (data.isReaded) {
      this.readed(forMe);
    }
    if (data.isEdited) {
      this.edited();
    }
  }
}
