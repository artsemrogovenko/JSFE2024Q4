import { appLogic } from '../../..';
import Block from '../../../modules/block';
import { Search } from '../../../modules/inputs';
import type { UserStatus } from '../../../modules/types';
import UserElement from './user-element';

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
  public static selectedUser(user: UserElement): void {}
}
