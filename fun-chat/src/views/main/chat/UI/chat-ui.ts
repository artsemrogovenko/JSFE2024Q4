import Block from '../../../../modules/block';
import { Chat } from '../../chat';
import { selectUser } from '../utils';

export default class ChatUI extends Block<'section'> {
  constructor() {
    super('section', 'chat');
    this.addBlocks([Chat.users, Chat.history]);
    Chat.users.getList().addListener('click', selectUser);
  }
}
