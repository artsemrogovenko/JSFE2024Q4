import Block from '../../../modules/block';
import { Button } from '../../../modules/buttons';
import { Form } from '../../../modules/form';
import { disableClick, enableClick } from '../../../modules/functions';
import { InputText, Search } from '../../../modules/inputs';
import type { MessagePayload } from '../../../modules/types';
import SelectedUser from './selected-user';
import MessageMenu from './UI/context-menu';
import MessagesUI from './UI/messages-ui';
import type UserElement from './user-element';
import { editMessage, sendMessage } from './utils';

export default class ChatHistory extends Block<'article'> {
  public static msgMenu: MessageMenu | undefined;
  public static editedMsgId: string = '';

  private selectedUser = new SelectedUser();
  private messages = new MessagesUI();
  private send = new Form(
    'send-message',
    'send',
    new InputText('new-message'),
    'off',
    false,
  );
  private editInput = new Search('new-message');
  private regularInput = this.send.getInput;
  private editMode: boolean;
  private sendButton = new Button('send', 'Отправить');
  constructor() {
    super('article', 'history');
    this.addBlocks([this.selectedUser, this.messages, this.send]);
    this.send.getInput.setAttribute('placeholder', 'Сообщение...');
    this.send.addBlock(this.sendButton);
    this.editMode = false;
    this.editInput.setAttribute('autofocus', '');

    this.editInput.getNode().style.backgroundColor = '#faebd7';
    this.setRegularMode();
    this.send.setAttribute('autofocus', '');
    this.setId('chat');
    disableClick(this.send);
    this.messages.setNotify('Выберите пользователя');
  }

  public checkHistory(): void {
    if (this.getSelected() === '') {
      this.messages.setNotify('Выберите пользователя');
      return;
    }
    if (this.messages.length === 1) {
      this.messages.setNotify('История сообщений пуста');
    } else {
      this.messages.setNotify('');
    }
  }
  public deleteMessage(messageId: string): void {
    this.messages.delete(messageId);
  }
  public getSelected(): string {
    return this.selectedUser.getName;
  }

  public updateSelected(state: boolean): void {
    this.selectedUser.status = state;
  }
  public setUser(user: UserElement): void {
    this.selectedUser.name = user.name;
    this.selectedUser.status = user.status;
    enableClick(this.send);
    this.checkHistory();
  }

  public resetUser(): void {
    this.selectedUser.reset();
  }

  public newData(data: MessagePayload): void {
    this.messages.addMessage(data);
  }

  public addHistory(history: MessagePayload[], fromDB: boolean): void {
    this.messages.appendMessages(history, fromDB);
  }

  public clearInputText(): void {
    this.send.getInput.clear();
  }
  public clearMessageList(): void {
    this.messages.clearList();
  }
  public removeLine(user: string): void {
    this.messages.removeLine(user);
  }

  public setEditMode(messageId: string, text: string): void {
    ChatHistory.editedMsgId = messageId;
    this.editMode = true;
    this.editInput.setValue(text);
    this.send.removeListener('submit', sendMessage);
    this.send.replaceChild(this.editInput, this.regularInput);

    this.send.addListener('submit', editMessage);
  }

  public setRegularMode(): void {
    this.editInput.setValue('');

    if (this.editMode) {
      this.send.removeListener('submit', editMessage);
      this.send.replaceChild(this.regularInput, this.editInput);
    }
    this.send.addListener('submit', sendMessage);
    this.editMode = false;
  }
}
