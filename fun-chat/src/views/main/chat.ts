import { appLogic } from '../..';
import Block from '../../modules/block';
import { Button } from '../../modules/buttons';
import { Form } from '../../modules/form';
import { InputText, Search } from '../../modules/inputs';
import Messages from '../../modules/messages';
import SelectedUser from '../../modules/selected-user';
import type { UserStatus } from '../../modules/types';

export default class Chat extends Block<'section'> {
  private history = new History();
  private users = new Users();
  constructor() {
    super('section', 'chat');
    this.addBlocks([this.users, this.history]);
  }
}

export class UserList extends Block<'ul'> {
  private static dictionary = new Map<string, UserElement>();
  constructor(className: string) {
    super('ul', className);
  }
  public static addUser(user: UserElement): void {
    UserList.dictionary.set(user.name, user);
  }
}

export class Users extends Block<'aside'> {
  private search = new Search('user-search');
  private list = new UserList('user-list');
  constructor() {
    super('aside', 'users');
    this.search.setAttribute('placeholder', 'Найти пользователя');
    this.addBlocks([this.search, this.list]);
    document.addEventListener('List_received', () => this.addUsers());
  }

  public addUsers(): void {
    const users: UserStatus[] = appLogic.getList();
    const currentName = appLogic.currentName;
    users.forEach((value) => {
      if (value.login !== currentName) {
        const user = new UserElement(
          `${value.login}`,
          Boolean(value.isLogined),
        );
        this.list.addBlock(user);
        UserList.addUser(user);
      }
    });
  }
}

class UserElement extends Block<'li'> {
  private login: string;
  constructor(text: string, isOnline: boolean) {
    super('li', 'user', text);
    this.login = text;
    if (isOnline) {
      this.addClass('online');
    }
  }
  public get name(): string {
    return this.login;
  }
  public setStatus(status: boolean): void {
    status === true ? this.setClass('user online') : this.setClass('user');
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
