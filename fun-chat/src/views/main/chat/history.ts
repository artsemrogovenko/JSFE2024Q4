import Block from '../../../modules/block';
import { Button } from '../../../modules/buttons';
import { Form } from '../../../modules/form';
import { InputText } from '../../../modules/inputs';
import Messages from '../../../modules/messages';
import type { MessagePayload } from '../../../modules/types';
import SelectedUser from './selected-user';
import type UserElement from './user-element';
import { sendMessage } from './utils';

export class History extends Block<'article'> {
  private selectedUser = new SelectedUser();
  private messages = new Messages();
  private send = new Form(
    'send-message',
    'send',
    new InputText('new-message'),
    'off',
    false,
  );
  constructor() {
    super('article', 'history');
    this.addBlocks([this.selectedUser, this.messages, this.send]);
    const sendButton = new Button('send', 'Отправить');
    this.send.getInput.setAttribute('placeholder', 'Сообщение...');
    this.send.addBlock(sendButton);
    this.send.addListener('submit', (event) => {
      sendMessage(event, this.getSelected());
    });
  }
  public getSelected(): string {
    return this.selectedUser.getName;
  }
  public clearSelected(): void {
    this.selectedUser.name = '';
  }

  public setUser(user: UserElement): void {
    this.selectedUser.name = user.name;
    this.selectedUser.status = user.status;
  }

  public newData(data: MessagePayload[] | MessagePayload): void {
    if (Array.isArray(data)) {
      this.messages.addMessages(data);
    } else {
      this.messages.addMessage(data);
    }
  }
  public clearText(): void {
    this.send.getInput.clear();
  }
  public clearList(): void {
    this.messages.clearList();
  }
}
