import { appLogic, appState } from '..';
import type { ApiResponse, LocalUser, UserStatus } from '../modules/types';
import { showInfo } from '../views/dialog';
import { Chat } from '../views/main/chat';
import MessagesDB from '../views/main/chat/messages-base';
import MessagesUI from '../views/main/chat/UI/messages-ui';
import { UserList } from '../views/main/chat/users-block';
import { saveToDbMessage } from '../views/main/chat/utils';
import {
  isResponse,
  isUserStatus,
  isUser,
  isThirdPartyUser,
  isMessage,
  isMessageHistory,
  isError,
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
        handleError(data);
        break;
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

export function checkOnError(
  event: Event,
  socket: WebSocket | undefined,
): void {
  if (event instanceof CloseEvent) {
    if (!event.wasClean) {
      showInfo('Потеря связи c сервером. Попытка подключиться');
      const delayMs = 3000;
      if (socket !== undefined) {
        setTimeout(() => {
          appLogic.initSocket();
        }, delayMs);
        {
        }
      }
    }
  }
}

export function isValidFields(data: LocalUser): boolean {
  return data.login !== '' && data.password !== '';
}

function handleError(data: ApiResponse): void {
  if (isError(data.payload)) {
    if (data.payload.error === 'a user with this login is already authorized') {
      appLogic.resetLogin();
    }
    showInfo(data.payload.error);
  }
}

export function clearMemory(): void {
  MessagesUI.clear();
  UserList.clear();
  MessagesDB.clear();
  Chat.users.cleanListUsers();
  Chat.resetUser();
}
