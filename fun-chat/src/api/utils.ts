import { appLogic } from '..';
import type {
  ApiResponse,
  UserStatus,
  User,
  MessageHistory,
  Message,
  MessagePayload,
  MessageStatuses,
} from '../modules/types';
import Chat from '../views/main/chat';

export function handleMessage(uuid: string, message: MessageEvent): void {
  const data: ApiResponse = JSON.parse(message.data);
  if (isResponse(data)) {
    switch (data.type) {
      case 'MSG_FROM_USER':
      case 'MSG_SEND':
        getMessages(data);
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
      break;
    default:
      break;
  }
}

function getMessages(object: ApiResponse): void {
  if (isMessageHistory(object.payload)) {
    Chat.addHistory(object.payload.messages);
  }
  if (isMessage(object.payload)) {
    Chat.addHistory(object.payload.message);
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

export function isUser(data: object | undefined): data is User {
  const obj = Object.assign({}, data);
  if ('user' in obj) {
    return (
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

function isMessageHistory(data: object): data is MessageHistory {
  const obj = Object.assign({}, data);
  return 'messages' in obj && Array.isArray(obj.messages);
}

function isMessage(data: object): data is Message {
  const obj = Object.assign({}, data);
  return (
    'message' in obj &&
    typeof obj.message === 'object' &&
    obj.message !== null &&
    isMessagePayload(obj.message)
  );
}

export function isMessagePayload(data: object): data is MessagePayload {
  const obj = Object.assign({}, data);
  if (obj === null) return false;
  return (
    'id' in obj &&
    'from' in obj &&
    'to' in obj &&
    'text' in obj &&
    'datetime' in obj &&
    'status' in obj &&
    typeof obj.status === 'object' &&
    isMessageStatuses(obj.status)
  );
}

export function isMessageStatuses(
  data: object | null,
): data is MessageStatuses {
  const obj = Object.assign({}, data);
  return (
    obj.hasOwnProperty('isDelivered') &&
    obj.hasOwnProperty('isReaded') &&
    obj.hasOwnProperty('isEdited')
  );
}
