import type { MessagePayload } from '../../modules/types';
import ChatHistory from './chat/history';
import UserElement from './chat/user-element';
import { Users } from './chat/users-block';

export class Chat {
  public static history = new ChatHistory();
  public static users = new Users();

  public static appendHistory(history: MessagePayload): void {
    this.history.newData(history);
  }
  public static addHistory(
    history: MessagePayload[],
    fromDB: boolean = false,
  ): void {
    this.history.addHistory(history, fromDB);
  }

  public static getSelected(): string {
    return this.history.getSelected();
  }

  public static clearText(): void {
    this.history.clearInputText();
  }

  public static clearList(): void {
    this.history.clearMessageList();
    this.history.clearInputText();
  }
  public static setUser(user: UserElement): void {
    this.history.setUser(user);
  }
  public static resetUser(): void {
    this.history.resetUser();
  }
  public static addUser(user: UserElement): void {
    this.users.addUser(user);
  }
  public static updateSelectedStatus(isLogined: boolean): void {
    this.history.updateSelected(isLogined);
  }
  public static removeLine(login: string): void {
    this.history.removeLine(login);
  }

  public static editMode(messageId: string, text: string): void {
    this.history.setEditMode(messageId, text);
  }
  public static regularMode(): void {
    this.history.setRegularMode();
  }
}
