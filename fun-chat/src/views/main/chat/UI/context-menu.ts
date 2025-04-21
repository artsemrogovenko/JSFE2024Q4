import { appLogic } from '../../../..';
import { Container } from '../../../../modules/block';
import { Button } from '../../../../modules/buttons';
import { Chat } from '../../chat';

export default class MessageMenu extends Container {
  private edit = new Button('context-edit');
  private delete = new Button('context-delete');

  constructor(messageId: string, text: string) {
    super('msg-menu');
    this.edit.setText('Edit');
    this.delete.setText('Delete');
    this.addBlocks([this.edit, this.delete]);
    this.delete.addListener('click', () => {
      appLogic.deleteMessage(messageId);
    });
    this.edit.addListener('click', () => {
      Chat.editMode(messageId, text);
    });
  }
}
