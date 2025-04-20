import type {
  User,
  UserStatus,
  ApiResponse,
  MessageHistory,
  Message,
  MessagePayload,
  MessageStatuses,
  MsgEdit,
  MsgDelivered,
  MsgDelete,
  MsgRead,
  NotifyMsg,
  AuthStorage,
  ThirdPartyUser,
  ApiError,
} from '../modules/types';

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

export function isMessageHistory(data: object): data is MessageHistory {
  const obj = Object.assign({}, data);
  return 'messages' in obj && Array.isArray(obj.messages);
}

export function isMessage(data: object): data is Message {
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

export function isMsgEdit(obj: object): obj is MsgEdit {
  return obj !== null && 'isEdited' in obj && typeof obj.isEdited === 'boolean';
}
export function isMsgDelivered(obj: object): obj is MsgDelivered {
  return (
    obj !== null && 'isDelivered' in obj && typeof obj.isDelivered === 'boolean'
  );
}

export function isMsgDelete(obj: object): obj is MsgDelete {
  return (
    obj !== null && 'isDeleted' in obj && typeof obj.isDeleted === 'boolean'
  );
}

export function isMsgRead(obj: object): obj is MsgRead {
  return obj !== null && 'isReaded' in obj && typeof obj.isReaded === 'boolean';
}

export function isNotifyStatus(
  obj: any,
): obj is MsgEdit | MsgDelete | MsgRead | MsgDelivered {
  return (
    isMsgEdit(obj) || isMsgDelete(obj) || isMsgRead(obj) || isMsgDelivered(obj)
  );
}

export function isNotifyMsg(obj: object): obj is NotifyMsg {
  return (
    'message' in obj &&
    typeof obj.message === 'object' &&
    obj.message !== null &&
    'id' in obj.message &&
    typeof obj.message.id === 'string' &&
    'status' in obj.message &&
    isNotifyStatus(obj.message.status)
  );
}

export function isAuthStorage(data: object | null): data is AuthStorage {
  const obj = Object.assign({}, data);
  return (
    obj.hasOwnProperty('uuid') &&
    obj.hasOwnProperty('logined') &&
    obj.hasOwnProperty('localUser')
  );
}

export function isThirdPartyUser(obj: object): obj is ThirdPartyUser {
  return (
    'user' in obj &&
    typeof obj.user === 'object' &&
    obj.user !== null &&
    'login' in obj.user &&
    'isLogined' in obj.user &&
    typeof obj.user.login === 'string' &&
    typeof obj.user.isLogined === 'boolean'
  );
}

export function isError(obj: object): obj is ApiError {
  return obj !== null && 'error' in obj && typeof obj.error === 'string';
}
