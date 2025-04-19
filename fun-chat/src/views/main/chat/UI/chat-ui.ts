import { appLogic } from '../../../..';
import Block from '../../../../modules/block';
import { Chat } from '../../chat';
import { pickUser } from '../utils';

export default class ChatUI extends Block<'section'> {
  private selectedUser: string = '';
  constructor() {
    super('section', 'chat');
    this.addBlocks([Chat.users, Chat.history]);
    Chat.users
      .getList()
      .addListener('click', (event) => this.selectUser(event));
  }

  private selectUser(event: Event): void {
    const user = pickUser(event);
    if (user !== undefined) {
      Chat.history.clearList();
      Chat.history.setUser(user);
      appLogic.fetchHistory(user.name);
      this.selectedUser = user.name;
    }
  }
}
