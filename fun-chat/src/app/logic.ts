import { auth, handleMessage } from '../api/functions';
import { pushState } from './router';

export class AppLogic {
  private socket: WebSocket | undefined;
  private uuid: string = '';
  private logined: boolean = false;
  private localUser = { login: '', password: '' };

  public get isLogined(): boolean {
    return this.logined;
  }

  public createSocket(name: string, password: string): void {
    this.uuid = self.crypto.randomUUID();
    this.localUser.login = name;
    this.localUser.password = password;
    // if (!(this.socket instanceof WebSocket)) {
    //   this.socket = new WebSocket('ws://localhost:4000');
    //   this.socket.addEventListener('open', () => this.login());
    //   this.socket.addEventListener('message', (message) =>
    //     handleMessage(this.uuid, message),
    //   );
    // }
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
    this.meLogined();
  }

  public meLogined(): void {
    if (this.logined) {
      pushState('main');
    } else {
      if (this.socket) {
        this.socket.close();
      }
      pushState('login');
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
