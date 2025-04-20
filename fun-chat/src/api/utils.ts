import { appLogic, appState } from '..';
import type { ApiResponse, UserStatus } from '../modules/types';
import MessagesDB from '../views/main/chat/messages-base';
import { UserList } from '../views/main/chat/users-block';
import { saveToDbMessage } from '../views/main/chat/utils';
import {
  isResponse,
  isUserStatus,
  isUser,
  isThirdPartyUser,
  isMessage,
  isMessageHistory,
} from './types-verify';

export function handleMessage(uuid: string, message: MessageEvent): void {
  const data: ApiResponse = JSON.parse(message.data);
  if (isResponse(data)) {
    switch (data.type) {
      case 'MSG_FROM_USER':
      case 'MSG_SEND':
        getMessages(data);
        break;
      case 'MSG_DELIVER':
      case 'MSG_READ':
      case 'MSG_DELETE':
      case 'MSG_EDIT':
        MessagesDB.updateStatus(uuid, data.payload);
        break;
      case 'ERROR':
        throw new Error(message.data);
      case 'USER_EXTERNAL_LOGIN':
      case 'USER_EXTERNAL_LOGOUT':
        handleUser(data);
        break;
      default:
        handleListsAndAuth(uuid, data);
        break;
    }
  }
}

function handleListsAndAuth(uuid: string, data: ApiResponse): void {
  switch (data.type) {
    case 'USER_LOGOUT':
    case 'USER_LOGIN':
      localUserStatus(uuid, data);
      break;
    case 'USER_ACTIVE':
    case 'USER_INACTIVE':
      appLogic.saveAllUsers(data.payload);
      if (data.type === 'USER_INACTIVE') {
        UserList.writeBase();
      }
      break;
    default:
      break;
  }
}

function getMessages(object: ApiResponse): void {
  if (isMessageHistory(object.payload)) {
    MessagesDB.addHistory(object.payload.messages);
  }
  if (isMessage(object.payload)) {
    saveToDbMessage(object.payload.message);
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

export function verifyUser(params: object): UserStatus | undefined {
  if (isUser(params)) {
    return params.user;
  }
  return;
}

export function saveToStorage(
  uuid: string,
  logined: boolean,
  user: object,
): void {
  const data = { uuid: uuid, logined: logined, localUser: user };
  appState.setValue('localuser', JSON.stringify(data));
}

export function clearStorage(): void {
  appState.setValue('localuser', '');
}

function handleUser(data: ApiResponse): void {
  const payload = data.payload;
  if (isThirdPartyUser(payload)) {
    appLogic.setLogined(payload.user.login, payload.user.isLogined);
  }
}
