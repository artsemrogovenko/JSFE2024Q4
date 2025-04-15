import Block from '../../modules/block';
import Chat from './chat';
import Footer from './footer';
import Header from './header';

export default class Main extends Block<'main'> {
  private header = new Header();
  private chat = new Chat();
  private footer = new Footer();
  constructor() {
    super('main', 'main');
    this.addBlocks([this.header, this.chat, this.footer]);
  }
}
