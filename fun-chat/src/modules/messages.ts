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
    this.messages.set(data.message.id, message);
    this.addBlock(message);
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
    this.text.setText(data.message.text);
    const timestamp = new Date(data.message.datetime);
    this.timestamp.setText(timestamp.toString());
    this.setProperties(data.message.status);
  }

  public delivered(): void {
    this.status.setText('доставлено');
  }
  public readed(): void {
    this.status.setText('прочитано');
  }
  public edited(): void {
    this.status.addClass('edited');
  }

  private setProperties(data: MessageStatuses): void {
    if (!data.isDelivered && !data.isReaded) {
      this.status.setText('отправлено');
    }
    if (data.isDelivered && !data.isReaded) {
      this.delivered();
    }
    if (data.isReaded) {
      this.readed();
    }
    if (data.isEdited) {
      this.edited();
    }
  }
}
