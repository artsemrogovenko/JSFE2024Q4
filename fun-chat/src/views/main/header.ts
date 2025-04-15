import Block, { Container } from '../../modules/block';
import { Button } from '../../modules/buttons';

export default class Header extends Block<'section'> {
  private currentUser = new Container('header-user');
  private appTitle = new Container('title-app');
  private about = new Button('about', 'about');
  private logout = new Button('logout', 'logout');
  constructor() {
    super('section', 'header');
    this.appTitle.setText('Fun chat');
    this.addBlocks([this.currentUser, this.appTitle, this.about, this.logout]);
  }

  public set userName(name: string) {
    this.currentUser.setText(name);
  }
}
