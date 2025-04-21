import { appLogic } from '../..';
import { pushState } from '../../app/router';
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
    this.logout.addListener('click', () => appLogic.logout());
    const myName = appLogic.currentName;
    this.setName(myName);
    this.about.addListener('click', () => pushState('about'));
  }

  private setName(name: string): void {
    this.currentUser.setText(name);
  }
}
