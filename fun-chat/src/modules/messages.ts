import { appLogic } from '..';
import { isMsgDelete, isMsgEdit, isMsgRead, isNotifyMsg } from '../api/utils';
import Chat from '../views/main/chat';
import { UserList } from '../views/main/chat/users-block';
import { Container } from './block';
import { Label } from './form';
import { messageLogic } from './functions';
import type { MessagePayload, MessageStatuses } from './types';

export default class Messages extends Container {
  private static messages = new Map<string, Message>();
  constructor() {
    super('messages-list');
  }

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

  public addMessage(data: MessagePayload): void {
    const message = new Message(data);
    Messages.messages.set(data.id, message);
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

class Message extends Container {
  private from = new Label('message-from');
  private timestamp = new Label('message-date');
  private text = new Label('message');
  private status = new Label('message-status');
  private id: string = '';
  private owner: boolean;
  constructor(data: MessagePayload) {
    super('wrapper-message');
    this.addBlocks([this.from, this.timestamp, this.text, this.status]);
    this.id = data.id;
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
    this.owner = !forMe;
    if (!forMe) {
      this.addClass('you');
    }
    this.setProperties(data.status, forMe);
    this.getNode().addEventListener('pointerenter', (event) =>
      messageLogic(event, this.id, this.owner),
    );
  }

  public delivered(forMe?: boolean): void {
    if (forMe !== undefined) {
      !forMe ? this.status.setText('доставлено') : this.status.setText('ᅟ');
    } else {
      this.status.setText('доставлено');
    }
  }

  public readed(forMe?: boolean): void {
    if (forMe !== undefined) {
      !forMe ? this.status.setText('прочитано') : this.status.setText('ᅟ');
    } else {
      this.status.setText('прочитано');
    }
  }
  public edited(): void {
    this.status.setText('изменено');
    // this.status.addClass('edited');
  }
  public deleted(): void {
    this.deleteBlock(this.text);
    this.status.setText('удалено');
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
