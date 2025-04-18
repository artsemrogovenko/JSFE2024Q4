import Block from '../../modules/block';
import type { MessagePayload } from '../../modules/types';
import { Users, UserList } from './chat/users-block';
import { pickUser } from './chat/utils';
import { History } from './chat/history';
import { appLogic } from '../..';

export default class Chat extends Block<'section'> {
  private static history = new History();
  private static users = new Users();
  private selectedUser: string = '';
  constructor() {
    super('section', 'chat');
    this.addBlocks([Chat.users, Chat.history]);
    Chat.users
      .getList()
      .addListener('click', (event) => this.selectUser(event));
  }

  public static setHistory(history: MessagePayload[] | MessagePayload): void {
    Chat.history.newData(history);
  }

  public static getSelected(): string {
    return Chat.history.getSelected();
  }
  public static clearText(): void {
    this.history.clearText();
  }
  private selectUser(event: Event): void {
    const user = pickUser(event);
    if (user !== undefined) {
      Chat.history.setUser(user);
      appLogic.fetchHistory(user.name);
      this.selectedUser = user.name;
    }
  }
}
