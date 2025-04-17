import {
  auth,
  gettingActive,
  gettingInactive,
  handleMessage,
  messageHistory,
} from '../api/functions';
import type { UserStatus } from '../modules/types';
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
    if (this.socket) {
      this.socket.send(request);
    }
  }

  public meLogined(): void {
    if (this.logined) {
      this.getListUsers();
      pushState('main');
    } else {
      if (this.socket) {
        this.socket.close();
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
      const event = new Event('List_received');
      const delay = 200;
      setTimeout(() => {
        document.dispatchEvent(event);
      }, delay);
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

  private login(): void {
    const request = auth(this.uuid, 'USER_LOGIN', this.localUser);
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
