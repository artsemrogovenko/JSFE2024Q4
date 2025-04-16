import { appLogic } from '..';
import type {
  ApiResponse,
  AuthLocal,
  LocalUser,
  User,
  UserStatus,
} from '../modules/types';

export function handleMessage(uuid: string, message: MessageEvent): void {
  const data: ApiResponse = JSON.parse(message.data);
  if (isResponse(data)) {
    switch (data.type) {
      case 'USER_LOGOUT':
      case 'USER_LOGIN':
        localUserStatus(uuid, data);
        break;
      case 'USER_ACTIVE':
      case 'USER_INACTIVE':
        appLogic.saveAllUsers(data.payload);
        break;
      default:
        break;
    }
  }
}

function localUserStatus(uuid: string, data: ApiResponse): void {
  if (data.type === 'USER_LOGOUT' || data.type === 'USER_LOGIN') {
    if ('id' in data && data.id === uuid) {
      if ('payload' in data && data.payload) {
        const userData = verifyUser(data.payload);
        if (userData && isUserStatus(userData)) {
          appLogic.setStatus(userData.isLogined);
        }
      }
    }
  }
}

export function auth(
  uuid: string,
  type: AuthLocal,
  userData: LocalUser,
): string {
  const requestString = JSON.stringify({
    id: uuid,
    type: type,
    payload: {
      user: userData,
    },
  });
  return requestString;
}

export function verifyUser(params: object): UserStatus | undefined {
  if (isUser(params)) {
    return params.user;
  }
  return;
}

export function isUser(data: object | undefined): data is User {
  const obj = Object.assign({}, data);
  if ('user' in obj) {
    return (
      typeof obj.user === 'object' &&
      typeof obj.user === 'object' &&
      obj.user !== null &&
      'login' in obj.user &&
      'isLogined' in obj.user
    );
  }
  return false;
}

export function isUserStatus(data: object): data is UserStatus {
  return 'login' in data && 'isLogined' in data;
}

export function isResponse(data: object): data is ApiResponse {
  const obj = Object.assign({}, data);
  return (
    obj.hasOwnProperty('id') &&
    obj.hasOwnProperty('type') &&
    obj.hasOwnProperty('payload')
  );
}
export function gettingActive(uuid: string): string {
  return JSON.stringify({
    id: uuid,
    type: 'USER_ACTIVE',
    payload: null,
  });
}
export function gettingInactive(uuid: string): string {
  return JSON.stringify({
    id: uuid,
    type: 'USER_INACTIVE',
    payload: null,
  });
}
