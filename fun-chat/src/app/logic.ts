import {
  auth,
  gettingActive,
  gettingInactive,
  messageDeletion,
  messageHistory,
  messageReadStatusChange,
  messageTextEditing,
  sendingMessagetoUser,
} from '../api/requests';
import { handleMessage } from '../api/utils';
import type { UserStatus } from '../modules/types';
import { Chat } from '../views/main/chat';
import { pushState } from './router';

export class AppLogic {
  private socket: WebSocket | undefined;
  private uuid: string = '';
  private logined: boolean = false;
  private localUser = { login: '', password: '' };
  private users: UserStatus[] = [];

  public get currentName(): string {
    return this.localUser.login;
  }

  public get isLogined(): boolean {
    return this.logined;
  }

  public createSocket(name: string, password: string): void {
    this.uuid = self.crypto.randomUUID();
    this.localUser.login = name;
    this.localUser.password = password;
    this.initSocket();
  }

  public closeConnection(): void {
    if (this.socket) {
      this.socket.close();
      this.socket.removeEventListener('open', () => this.login());
      this.socket.removeEventListener('message', (message) =>
        handleMessage(this.uuid, message),
      );
    }
  }

  public setStatus(value: boolean): void {
    if (!this.logined === value) {
      this.logined = value;
    }
    this.meLogined();
  }

  public logout(): void {
    const request = auth(this.uuid, 'USER_LOGOUT', this.localUser);
    this.sendRequest(request);
  }

  public meLogined(): void {
    if (this.logined) {
      pushState('main');
      this.getListUsers();
    } else {
      if (this.socket) {
        this.socket.close();
        Chat.resetSelected();
      }
      pushState('login');
    }
  }

  public saveAllUsers(data: object): void {
    if ('users' in data && Array.isArray(data.users)) {
      const usersArray = data.users;
      this.users.push(...usersArray);
    }
  }

  public getListUsers(): void {
    if (this.socket && this.socket.OPEN) {
      this.socket.send(gettingActive(this.uuid));
      this.socket.send(gettingInactive(this.uuid));
      //   const event = new Event('List_received');
      //   const delay = 200;
      //   setTimeout(() => {
      //     document.dispatchEvent(event);
      //   }, delay);
    }
  }

  public getList(): UserStatus[] {
    return this.users;
  }

  public fetchHistory(from: string): void {
    if (this.socket && this.socket.OPEN) {
      this.socket.send(messageHistory(this.uuid, from));
    }
  }

  public sendMessage(to: string, message: string): void {
    if (message.trim() !== '') {
      const request = sendingMessagetoUser(this.uuid, to, message);
      this.sendRequest(request);
    }
  }

  public readMessage(messageId: string): void {
    const request = messageReadStatusChange(this.uuid, messageId);
    this.sendRequest(request);
  }

  public deleteMessage(messageId: string): void {
    const request = messageDeletion(this.uuid, messageId);
    this.sendRequest(request);
  }
  public editMessage(messageId: string, newText: string): void {
    const request = messageTextEditing(this.uuid, messageId, newText);
    this.sendRequest(request);
  }

  private login(): void {
    const request = auth(this.uuid, 'USER_LOGIN', this.localUser);
    this.sendRequest(request);
  }

  private initSocket(): void {
    this.socket = new WebSocket('ws://localhost:4000');
    this.socket.addEventListener('open', () => this.login());
    this.socket.addEventListener('message', (message) =>
      handleMessage(this.uuid, message),
    );
  }

  private sendRequest(request: string): void {
    if (this.socket) {
      this.socket.send(request);
    }
  }
}
