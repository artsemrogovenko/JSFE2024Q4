export type Indicator = 'off' | 'on';

export type Structure = {
  id: string | null;
  type: string;
  payload: object;
};

type MessageType =
  | 'MSG_EDIT'
  | 'MSG_DELETE'
  | 'MSG_READ'
  | 'MSG_DELIVER'
  | 'MSG_FROM_USER'
  | 'MSG_SEND';

export type MessageResponse = {
  id: string;
  type: MessageType;
  payload: object;
};

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
