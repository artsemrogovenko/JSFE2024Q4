import Block from '../../../modules/block';

export default class UserElement extends Block<'li'> {
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
