import type { AuthLocal, LocalUser } from '../modules/types';

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

export function messageHistory(uuid: string, nickName: string): string {
  return JSON.stringify({
    id: uuid,
    type: 'MSG_FROM_USER',
    payload: {
      user: {
        login: nickName,
      },
    },
  });
}

export function sendingMessagetoUser(
  uuid: string,
  to: string,
  message: string,
): string {
  return JSON.stringify({
    id: uuid,
    type: 'MSG_SEND',
    payload: {
      message: {
        to: to,
        text: message,
      },
    },
  });
}
//#region notifications from client
export function messageReadStatusChange(
  uuid: string,
  messageId: string,
): string {
  return JSON.stringify({
    id: uuid,
    type: 'MSG_READ',
    payload: {
      message: {
        id: messageId,
      },
    },
  });
}

export function messageDeletion(uuid: string, messageId: string): string {
  return JSON.stringify({
    id: uuid,
    type: 'MSG_DELETE',
    payload: {
      message: {
        id: messageId,
      },
    },
  });
}

export function messageTextEditing(
  uuid: string,
  messageId: string,
  text: string,
): string {
  return JSON.stringify({
    id: uuid,
    type: 'MSG_EDIT',
    payload: {
      message: {
        id: messageId,
        text: text,
      },
    },
  });
}
