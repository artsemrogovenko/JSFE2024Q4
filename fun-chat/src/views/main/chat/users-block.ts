import { appLogic } from '../../..';
import Block from '../../../modules/block';
import { Search } from '../../../modules/inputs';
import type { UserStatus } from '../../../modules/types';
import UserElement from './user-element';

export class Users extends Block<'aside'> {
  private search = new Search('user-search');
  private list = new UserListUI('user-list');
  constructor() {
    super('aside', 'users');
    this.search.setAttribute('placeholder', 'Найти пользователя');
    this.addBlocks([this.search, this.list]);
    document.addEventListener('List_received', () => this.addUsers());
  }
  public getList(): UserListUI {
    return this.list;
  }
  public addUsers(): void {
    const array = UserList.getUsers();
    if (array.length !== 0) {
      this.list.addBlocks(UserList.getUsers());
    }
  }
}

export class UserListUI extends Block<'ul'> {
  constructor(className: string) {
    super('ul', className);
  }
}

export class UserList {
  private static dictionary = new Map<string, UserElement>();

  public static addUser(user: UserElement): void {
    UserList.dictionary.set(user.name, user);
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
      if (!this.dictionary.has(value.login)) {
        const user = new UserElement(
          `${value.login}`,
          Boolean(value.isLogined),
        );
        UserList.addUser(user);
      } else {
        this.updateUserElement(value);
      }
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

  private static fetchHistory(): void {
    const names = this.dictionary.keys();
    [...names].forEach((name) => {
      appLogic.fetchHistory(name);
    });
  }

  private static updateUserElement(value: UserStatus): void {
    const element = this.getUser(value.login);
    if (element) {
      element.setStatus(value.isLogined);
    }
  }
}
