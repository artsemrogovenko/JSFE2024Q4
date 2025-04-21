import { appLogic } from '../../..';
import {
  isMsgEdit,
  isMsgDelivered,
  isMsgDelete,
  isMsgRead,
} from '../../../api/types-verify';
import { Search } from '../../../modules/inputs';
import type {
  MessagePayload,
  MessageStatuses,
  NotifyStatus,
} from '../../../modules/types';
import { Chat } from '../chat';
import MessagesDB from './messages-base';
import MessagesUI from './UI/messages-ui';
import type UserElement from './user-element';
import { UserList } from './users-block';

export function pickUser(event: Event): UserElement | undefined {
  const target = event.target;
  if (target instanceof HTMLElement) {
    let element: HTMLElement | null = null;
    if (target.localName === 'p') {
      element = target.parentElement;
    }
    if (target.localName === 'li') {
      element = target.closest('li');
    }
    if (element !== null) {
      let text = '';
      element.childNodes.forEach((node) => {
        if (node.nodeName !== 'P') {
          text += node.textContent;
        }
      });
      return UserList.getUser(text);
    }
  }
}

export function sendMessage(event: Event, to: string): void {
  event.preventDefault();
  event.stopImmediatePropagation();
  if (event instanceof SubmitEvent) {
    const target = event.target;
    if (target instanceof HTMLFormElement) {
      const textArea = target.firstChild;
      if (textArea instanceof HTMLInputElement) {
        const message = textArea.value;
        appLogic.sendMessage(to, message);
      }
    }
  }
}

export function selectUser(event: Event): void {
  const user = pickUser(event);
  if (user !== undefined) {
    Chat.clearList();
    Chat.setUser(user);
    const messages = MessagesDB.getChainMessages(user.name);
    if (messages) {
      Chat.addHistory(messages, true);
    }
  }
}

export function saveToDbMessage(data: MessagePayload): void {
  if (data.from === appLogic.currentName) {
    MessagesDB.saveMessage(data.id, data, data.to);
  } else {
    MessagesDB.saveMessage(data.id, data, data.from);
  }
}

export function updateMessageUI(messageId: string, status: NotifyStatus): void {
  const message = MessagesUI.get(messageId);
  if (message) {
    if (isMsgEdit(status)) {
      if (status.isEdited) message.edited();
    }
    if (isMsgDelivered(status)) {
      if (status.isDelivered) message.delivered(!status.isDelivered);
    }
    if (isMsgDelete(status)) {
      if (status.isDeleted) message.deleted();
    }
    if (isMsgRead(status)) {
      if (status.isReaded) message.readed(!status.isReaded);
    }
  }
}

export function filter(event: Event, input: Search): void {
  const searchValue = input.getValue().toLowerCase();
  switch (event.type) {
    case 'input':
      if (searchValue === '') {
        UserList.getUsers().forEach((user) => user.show());
      } else {
        UserList.getUsers().forEach((user) => user.match(searchValue));
      }
      break;
    case 'search':
      if (searchValue === '') {
        UserList.getUsers().forEach((user) => user.show());
      }
      break;
  }
}
export function messageLogic(
  messageId: string,
  owner: boolean,
  status: MessageStatuses,
): void {
  if (owner === false && !status.isReaded) {
    appLogic.readMessage(messageId);
  }
}

export function readMessages(login: string): void {
  const partner = UserList.getUser(login);
  if (partner) {
    MessagesUI.get;
    partner.getUnreadMessages().forEach((id) => MessagesUI.get(id)?.hover());
  }
}
