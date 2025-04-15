import Block from '../../modules/block';
import { Button } from '../../modules/buttons';
import { Form } from '../../modules/form';
import { InputText, Search } from '../../modules/inputs';
import Messages from '../../modules/messages';
import SelectedUser from '../../modules/selected-user';

export default class Chat extends Block<'section'> {
  private history = new History();
  private users = new Users();
  constructor() {
    super('section', 'chat');
    this.addBlocks([this.users, this.history]);
  }
}

class Users extends Block<'aside'> {
  private search = new Search('user-search');
  constructor() {
    super('aside', 'users');
    this.search.setAttribute('placeholder', 'Найти пользователя');
    this.addBlock(this.search);
  }
}

class History extends Block<'article'> {
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
  }
}
