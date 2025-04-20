import { appState } from '..';
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
import { isAuthStorage } from '../api/types-verify';
import { handleMessage, saveToStorage, clearStorage } from '../api/utils';
import type { UserStatus } from '../modules/types';
import { Chat } from '../views/main/chat';
import { UserList } from '../views/main/chat/users-block';
import { pushState } from './router';

export class AppLogic {
  private socket: WebSocket | undefined;
  private uuid: string = '';
  private logined: boolean = false;
  private localUser = { login: '', password: '' };
  private users = new Map<string, UserStatus>();

  constructor() {
    const user = appState.getValue('localuser');
    if (user !== '') {
      const data = JSON.parse(user);
      if (isAuthStorage(data)) {
        if (data.uuid !== '') {
          this.localUser = data.localUser;
          this.logined = data.logined;
          this.uuid = data.uuid;
          this.initSocket();
        }
      }
    }
  }
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
    saveToStorage(this.uuid, this.logined, this.localUser);
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
        this.clearUserLogin();
      }
      pushState('login');
    }
  }

  public saveAllUsers(data: object): void {
    if ('users' in data && Array.isArray(data.users)) {
      const usersArray = data.users;
      usersArray.forEach((user: UserStatus) =>
        this.users.set(user.login, user),
      );
    }
  }

  public getListUsers(): void {
    if (this.socket && this.socket.OPEN) {
      this.socket.send(gettingActive(this.uuid));
      this.socket.send(gettingInactive(this.uuid));
    }
  }

  public getList(): UserStatus[] {
    return [...this.users.values()];
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

  public setLogined(login: string, isLogined: boolean): void {
    if (this.users.has(login)) {
      const user = this.users.get(login);
      if (user) {
        user.isLogined = isLogined;
        UserList.updateUserElement(user);
      }
    } else {
      const newUser = { login: login, isLogined: isLogined };
      UserList.createNewUser(newUser);
      this.fetchHistory(login);
    }
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

  private clearUserLogin(): void {
    this.localUser = { login: '', password: '' };
    this.logined = false;
    clearStorage();
  }
}
