import { appLogic } from '../../..';
import { Container } from '../../../modules/block';
import { Paragraph } from '../../../modules/form';
import type { MessagePayload, MessageStatuses } from '../../../modules/types';
import { messageLogic, myTimer, showMessageMenu } from './utils';

export default class Message extends Container {
  private from = new Paragraph('message-from');
  private timestamp = new Paragraph('message-date');
  private text = new Paragraph('message-text');
  private statusTag = new Paragraph('message-status');
  private editedTag = new Paragraph('message-edited');
  private id: string = '';
  private iOwner: boolean;
  private status = {
    isDelivered: false,
    isReaded: false,
    isEdited: false,
  };
  constructor(data: MessagePayload) {
    super('wrapper-message');
    this.addBlocks([
      this.from,
      this.timestamp,
      this.text,
      this.editedTag,
      this.statusTag,
    ]);
    this.id = data.id;
    this.text.setText(data.text);
    this.from.setText(data.from);
    const timestamp = new Date(data.datetime);
    const format = new Intl.DateTimeFormat('ru', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(timestamp);
    this.timestamp.setText(`${format}`);
    const forMe = appLogic.currentName === data.to;
    this.iOwner = !forMe;
    if (!forMe) {
      this.addClass('you');
    }
    this.setProperties(data.status, forMe);
    this.status = data.status;
    this.addlisteners();
  }

  public delivered(forMe?: boolean): void {
    if (forMe !== undefined && this.iOwner) {
      !forMe
        ? this.statusTag.setText('доставлено')
        : this.statusTag.setText('ᅟ');
    } else {
      this.statusTag.setText('ᅟ');
      this.addClass('unread');
    }
  }

  public readed(forMe?: boolean): void {
    if (forMe !== undefined && this.iOwner) {
      !forMe
        ? this.statusTag.setText('прочитано')
        : this.statusTag.setText('ᅟ');
    } else {
      this.statusTag.setText('ᅟ');
      this.removeClass('unread');
    }
  }
  public edited(newText?: string): void {
    if (newText) {
      this.text.setText(newText);
    }
    // this.statusTag.setText('изменено');
    this.editedTag.setText('изменено');
  }
  public deleted(): void {
    this.deleteBlock(this.text);
    this.statusTag.setText('удалено');
    this.destroy();
  }

  public hover(): void {
    this.getNode().dispatchEvent(new Event('pointerenter'));
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

  private addlisteners(): void {
    this.addListener('pointerenter', () =>
      messageLogic(this.id, this.iOwner, this.status),
    );
    this.addListener('contextmenu', (event) => {
      event.preventDefault();
      if (this.iOwner) {
        showMessageMenu(this.id, this.text.getText(), event);
      }
    });
    const timeOut = 2000;
    this.addListener('touchstart', (event) => {
      myTimer.timer = setTimeout(() => {
        event.preventDefault();
      }, timeOut);
    });
    this.addListener('touchmove', () => {
      clearTimeout(myTimer.timer);
    });
    this.addListener('touchend', () => {
      clearTimeout(myTimer.timer);
    });
  }
}
