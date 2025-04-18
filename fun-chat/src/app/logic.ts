import { appState } from '..';
import {
  auth,
  gettingActive,
  gettingInactive,
  handleMessage,
  isAuthStorage,
  isUserStatus,
  isUserStatusArray,
  messageHistory,
  saveToStorage,
} from '../api/functions';
import type { UserStatus } from '../modules/types';
import { pushState } from './router';

export class AppLogic {
  private socket: WebSocket | undefined;
  private uuid: string = '';
  private logined: boolean = false;
  private localUser = { login: '', password: '' };
  private users = new Map<string, object>();

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
    if (
      this.socket === undefined ||
      this.socket.readyState === WebSocket.CLOSING
    ) {
      this.uuid = self.crypto.randomUUID();
      this.localUser.login = name;
      this.localUser.password = password;
      this.initSocket();
    }
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
      // this.getListUsers();
      this.logined = value;
    }
    saveToStorage(this.uuid, this.logined, this.localUser);
    this.meLogined();
  }

  public logout(): void {
    const request = auth(this.uuid, 'USER_LOGOUT', this.localUser);
    if (this.socket) {
      this.socket.send(request);
    }
  }

  public meLogined(): void {
    if (this.logined) {
      pushState('main');
      this.getListUsers();
    } else {
      if (this.socket) {
        this.socket.close();
        this.socket = undefined;
        appState.setValue('localuser', '');
      }
      pushState('login');
    }
  }

  public saveAllUsers(data: object): void {
    if ('users' in data && Array.isArray(data.users)) {
      const usersArray = data.users;
      usersArray.forEach((user) => {
        if (isUserStatus(user)) {
          this.users.set(user.login, user);
        }
      });
      // this.users.push(...usersArray);
    }
  }

  public getListUsers(): void {
    try {
      console.log('getListUsers');
      if (this.socket) {
        this.socket.send(gettingActive(this.uuid));
        this.socket.send(gettingInactive(this.uuid));
        const event = new Event('List_received');
        const delay = 200;
        setTimeout(() => {
          document.dispatchEvent(event);
        }, delay);
      }
    } catch (error) {
      console.log(error);
    }
  }

  public getList(): UserStatus[] | [] {
    console.log('getList');
    let array = [...this.users.values()];
    console.log(array);
    return isUserStatusArray(array) ? array : [];
    // return Array.from(this.users);
  }

  public fetchHistory(from: string): void {
    if (this.socket && this.socket.OPEN) {
      this.socket.send(messageHistory(this.uuid, from));
    }
  }

  private login(): void {
    const request = auth(this.uuid, 'USER_LOGIN', this.localUser);
    console.log(request);
    if (this.socket) {
      this.socket.send(request);
    }
  }

  private initSocket(): void {
    this.socket = new WebSocket('ws://localhost:4000');
    this.socket.addEventListener('open', () => this.login());
    this.socket.addEventListener('message', (message) =>
      handleMessage(this.uuid, message),
    );
  }
}
