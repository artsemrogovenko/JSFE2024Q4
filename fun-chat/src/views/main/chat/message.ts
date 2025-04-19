import { appLogic } from '../../..';
import { Container } from '../../../modules/block';
import { Label } from '../../../modules/form';
import { messageLogic } from '../../../modules/functions';
import type { MessagePayload, MessageStatuses } from '../../../modules/types';

export default class Message extends Container {
  private from = new Label('message-from');
  private timestamp = new Label('message-date');
  private text = new Label('message');
  private statusTag = new Label('message-status');
  private id: string = '';
  private owner: boolean;
  private status = {
    isDelivered: false,
    isReaded: false,
    isEdited: false,
  };
  constructor(data: MessagePayload) {
    super('wrapper-message');
    this.addBlocks([this.from, this.timestamp, this.text, this.statusTag]);
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
      messageLogic(event, this.id, this.owner, this.status),
    );
    this.status = data.status;
  }

  public delivered(forMe?: boolean): void {
    if (forMe !== undefined) {
      !forMe
        ? this.statusTag.setText('доставлено')
        : this.statusTag.setText('ᅟ');
    } else {
      this.statusTag.setText('доставлено');
    }
  }

  public readed(forMe?: boolean): void {
    debugger;
    if (forMe !== undefined) {
      !forMe
        ? this.statusTag.setText('прочитано')
        : this.statusTag.setText('ᅟ');
    } else {
      this.statusTag.setText('прочитано');
    }
  }
  public edited(): void {
    this.statusTag.setText('изменено');
  }
  public deleted(): void {
    this.deleteBlock(this.text);
    this.statusTag.setText('удалено');
  }

  private setProperties(data: MessageStatuses, forMe: boolean): void {
    if (!data.isDelivered && !data.isReaded) {
      this.statusTag.setText('отправлено');
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
