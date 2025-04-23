import { appLogic } from '../../..';
import Block from '../../../modules/block';
import { Search } from '../../../modules/inputs';
import type { UserStatus } from '../../../modules/types';
import { Chat } from '../chat';
import UserElement from './user-element';
import { filter } from './utils';

export class Users extends Block<'aside'> {
  private search = new Search('user-search');
  private list = new UserListUI('user-list');
  constructor() {
    super('aside', 'users');
    this.search.setAttribute('placeholder', 'Найти пользователя');
    this.search.addListener('input', (event) => filter(event, this.search));
    this.search.addListener('search', (event) => filter(event, this.search));
    this.addBlocks([this.search, this.list]);
    this.setId('userlist');
  }

  public getList(): UserListUI {
    return this.list;
  }
  public addUser(user: UserElement): void {
    if (appLogic.currentName !== user.name) {
      this.list.addBlock(user);
    }
  }
  public cleanListUsers(): void {
    this.list.deleteAllBlocks();
  }
}

export class UserListUI extends Block<'ul'> {
  constructor(className: string) {
    super('ul', className);
  }
}

export class UserList {
  private static dictionary = new Map<string, UserElement>();

  public static clear(): void {
    this.dictionary.clear();
  }

  public static getUser(userName: string): UserElement | undefined {
    return this.dictionary.get(userName);
  }

  public static increaseUnreadCount(userName: string, messageid: string): void {
    const user = this.getUser(userName);
    if (user) {
      user.increaseCount(messageid);
    }
  }
  public static decreaseUnreadCount(userName: string, messageid: string): void {
    const user = this.getUser(userName);
    if (user) {
      user.decreaseCount(messageid);
    }
  }

  public static writeBase(): void {
    const users: UserStatus[] = appLogic.getList();
    users.forEach((value) => {
      UserList.createNewUser(value);
    });
    this.dictionary.delete(appLogic.currentName);
    this.fetchHistory();
    const event = new Event('List_received');
    const delay = 300;
    setTimeout(() => {
      document.dispatchEvent(event);
    }, delay);
  }

  public static getUsers(): UserElement[] {
    const currentName = appLogic.currentName;
    return [...this.dictionary.values()].filter(
      (value) => value.name !== currentName,
    );
  }

  public static createNewUser(value: UserStatus): void {
    if (!UserList.dictionary.has(value.login)) {
      const user = new UserElement(`${value.login}`, Boolean(value.isLogined));
      UserList.addUser(user);
    } else {
      UserList.updateUserElement(value);
    }
  }

  public static updateUserElement(value: UserStatus): void {
    // debugger;
    console.log(this.dictionary);
    const element = this.getUser(value.login);
    if (element) {
      element.setStatus(value.isLogined);
      this.dictionary.set(value.login, element);
      if (Chat.getSelected() === value.login) {
        Chat.updateSelectedStatus(value.isLogined);
      }
    }
    console.log(this.dictionary);
  }

  private static fetchHistory(): void {
    const names = this.dictionary.keys();
    [...names].forEach((name) => {
      appLogic.fetchHistory(name);
    });
  }

  private static addUser(user: UserElement): void {
    UserList.dictionary.set(user.name, user);
    Chat.addUser(user);
  }
}
