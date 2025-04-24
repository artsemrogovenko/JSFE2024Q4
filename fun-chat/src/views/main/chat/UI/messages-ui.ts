import { appLogic } from '../../../..';
import { Container } from '../../../../modules/block';
import { Paragraph } from '../../../../modules/form';
import { preventDefault } from '../../../../modules/functions';
import type { MessagePayload } from '../../../../modules/types';
import { Chat } from '../../chat';
import Message from '../message';
import { UserList } from '../users-block';
import { readMessages } from '../utils';
import { UnreadLine } from './uread-line';

export default class MessagesUI extends Container {
  public static dictionary = new Map<string, Message>();
  private notify = new Paragraph('notify');
  private delimeter: UnreadLine | null = null;
  constructor() {
    super('messages-list');
    this.addBlock(this.notify);
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
    if (!data.status.isReaded && data.to === appLogic.currentName) {
      UserList.increaseUnreadCount(data.from, data.id);
    }
    if (data.from === selectedUser || data.to === selectedUser) {
      this.setNotify('');
      this.addBlock(message);
      if (
        !data.status.isReaded &&
        typeof fromDB === 'boolean' &&
        fromDB === true &&
        this.delimeter === null &&
        data.to === appLogic.currentName
      ) {
        this.addLine(message);
      }

      if (this.delimeter !== null && data.to === selectedUser) {
        this.removeLine(selectedUser);
        readMessages(selectedUser);
      }
      if (this.delimeter === null) {
        this.element.scrollTop = this.element.scrollHeight;
        message.hover();
      }
      if (data.to === selectedUser) Chat.clearText();
    }
  }

  public appendMessages(data: MessagePayload[], fromDB: boolean): void {
    data.forEach((message) => this.addMessage(message, fromDB));
  }

  public delete(messageId: string): void {
    const block = MessagesUI.get(messageId);
    if (block) {
      const index = this.deleteBlock(block);
      this.getComponents().splice(index, 1);
      MessagesUI.dictionary.delete(messageId);
    }
  }

  public clearList(): void {
    if (this.length > 1) {
      this.deleteAllBlocks();
      this.getComponents().length = 0;
      this.notify = new Paragraph('notify');
      this.addBlock(this.notify);
      this.delimeter = null;
    }
    this.removeListeners();
  }

  public removeLine(login: string): void {
    if (login === Chat.getSelected()) {
      if (this.delimeter) {
        this.removeListeners();
        this.deleteBlock(this.delimeter);
        this.delimeter = null;
      }
    }
  }
  public setNotify(value: string): void {
    if (this.notify) this.notify.setText(value);
  }

  private addLine(message: Message): void {
    if (this.delimeter === null) {
      this.delimeter = new UnreadLine();
      this.addBlock(this.delimeter);
      this.getNode().insertBefore(this.delimeter.getNode(), message.getNode());
      if (this.getNode().scrollHeight > this.getNode().clientHeight) {
        message.getNode().scrollIntoView({ block: 'end' });
      }
      this.addListener('scroll', this.readAndRemove.bind(this));
      this.addListener('click', this.readAndRemove.bind(this));
    }
  }

  private readAndRemove(event: Event): void {
    preventDefault(event);
    const target = event.target;
    if (target instanceof HTMLElement) {
      switch (event.type) {
        case 'scroll':
          if (
            target.scrollHeight - target.scrollTop <=
            target.clientHeight + 1
          ) {
            readMessages(Chat.getSelected());
          }
          break;
        case 'click':
          if (event instanceof PointerEvent) {
            if (this.delimeter) {
              this.getNode().scrollTo({
                top: this.getNode().scrollHeight,
                behavior: 'smooth',
              });
              readMessages(Chat.getSelected());
            }
          }
          break;
      }
    }
  }
  private removeListeners(): void {
    this.removeListener('scroll', this.readAndRemove.bind(this));
    this.removeListener('click', this.readAndRemove.bind(this));
  }
}
