import Block from '../../../modules/block';
import { Chat } from '../chat';

export default class UserElement extends Block<'li'> {
  private login: string;
  private isOnline: boolean;
  private counter = new Set<string>();
  private unreadCount = document.createElement('p');
  constructor(text: string, isOnline: boolean) {
    super('li', 'user', text);
    this.login = text;
    this.isOnline = isOnline;
    if (isOnline) {
      this.addClass('online');
    }
    this.unreadCount.classList.add('unread-counter', 'none');
    this.getNode().appendChild(this.unreadCount);
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
  public increaseCount(messageId: string): void {
    this.counter.add(messageId);
    this.toggleValues();
  }
  public decreaseCount(messageId: string): void {
    this.counter.delete(messageId);
    this.toggleValues();
  }
  private toggleValues(): void {
    if (this.counter.size === 0) {
      this.unreadCount.classList.add('none');
      this.unreadCount.textContent = '';
      Chat.removeLine(this.login);
    }
    if (this.counter.size > 0) {
      this.unreadCount.classList.remove('none');
      this.unreadCount.textContent = `${this.counter.size}`;
    }
  }
}
