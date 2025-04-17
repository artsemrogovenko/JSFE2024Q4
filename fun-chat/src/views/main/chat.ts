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
    this.users
      .getList()
      .addListener('click', (event) => this.selectUser(event));
  }
  private selectUser(event: Event): void {
    const user = pickUser(event);
    if (user !== undefined) {
      this.history.setUser(user);
      UserList.selectedUser(user);
    }
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
  public static getUser(userName: string): UserElement | undefined {
    return this.dictionary.get(userName);
  }
  public static selectedUser(user: UserElement): void {
    console.log(user.name);
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
  public getList(): UserList {
    return this.list;
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
  private isOnline: boolean;
  constructor(text: string, isOnline: boolean) {
    super('li', 'user', text);
    this.login = text;
    this.isOnline = isOnline;
    if (isOnline) {
      this.addClass('online');
    }
  }
  public get name(): string {
    return this.login;
  }
  public get status(): boolean {
    return this.isOnline;
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

  public setUser(user: UserElement): void {
    this.selectedUser.name = user.name;
    this.selectedUser.status = user.status;
  }
}

function pickUser(event: Event): UserElement | undefined {
  const target = event.target;
  if (target instanceof HTMLElement) {
    const element = target.closest('li');
    if (element !== null) {
      const text = element.textContent;
      if (text !== null) {
        return UserList.getUser(text);
      }
    }
  }
}
