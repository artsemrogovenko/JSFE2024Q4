import type { MessagePayload } from '../../modules/types';
import ChatHistory from './chat/history';
import { Users } from './chat/users-block';

export class Chat {
  public static history = new ChatHistory();
  public static users = new Users();

  public static appendHistory(history: MessagePayload): void {
    Chat.history.newData(history);
  }
  public static addHistory(history: MessagePayload[]): void {
    Chat.history.addHistory(history);
  }

  public static getSelected(): string {
    return Chat.history.getSelected();
  }
  public static resetSelected(): void {
    Chat.history.clearSelected();
  }

  public static clearText(): void {
    this.history.clearText();
  }
}
