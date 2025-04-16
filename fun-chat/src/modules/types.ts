export type Indicator = 'off' | 'on';

export type Response = {
  id: string | null;
  type: MessageType;
  payload: object;
};

export type MessageType =
  | 'MSG_EDIT'
  | 'MSG_DELETE'
  | 'MSG_READ'
  | 'MSG_DELIVER'
  | 'MSG_FROM_USER'
  | 'MSG_SEND'
  | 'ERROR';

export type MessagePayload = {
  message: {
    id: string;
    from: string;
    to: string;
    text: string;
    datetime: number;
    status: MessageStatuses;
  };
};

export type MessageStatuses = {
  isDelivered: boolean;
  isReaded: boolean;
  isEdited: boolean;
};

export type LocalUser = {
  login: string;
  password: string;
};

export type User = {
  user: UserStatus;
};

export type UserStatus = { login: string; isLogined: boolean };

export type AuthLocal = 'USER_LOGOUT' | 'USER_LOGIN';
