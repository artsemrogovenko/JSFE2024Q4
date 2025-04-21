import { appLogic } from '../../..';
import {
  isMsgDelete,
  isMsgDelivered,
  isMsgEdit,
  isMsgRead,
} from '../../../api/types-verify';
import { Search } from '../../../modules/inputs';
import type {
  MessagePayload,
  MessageStatuses,
  NotifyStatus,
} from '../../../modules/types';
import { Chat } from '../chat';
import ChatHistory from './history';
import MessagesDB from './messages-base';
import MessageMenu from './UI/context-menu';
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

function getTextValue(event: Event): string | undefined {
  event.preventDefault();
  event.stopImmediatePropagation();
  if (event instanceof SubmitEvent) {
    const target = event.target;
    if (target instanceof HTMLFormElement) {
      const textArea = target.firstChild;
      if (textArea instanceof HTMLInputElement) {
        return textArea.value;
      }
    }
  }
}

export function sendMessage(event: Event): void {
  const text = getTextValue(event);
  if (text !== undefined) {
    const to = Chat.getSelected();
    appLogic.sendMessage(to, text);
  }
}

export function editMessage(event: Event): void {
  const text = getTextValue(event);
  const messageId = ChatHistory.editedMsgId;
  if (text !== undefined && messageId) {
    if (text.trim() !== '') appLogic.editMessage(messageId, text);
    Chat.regularMode();
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

export function updateMessageUI(
  messageId: string,
  status: NotifyStatus,
  text?: string,
): void {
  const message = MessagesUI.get(messageId);
  if (message) {
    if (isMsgEdit(status)) {
      if (status.isEdited) message.edited(text);
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

export function showMessageMenu(id: string, text: string, event: Event): void {
  const target = event.target;
  if (target instanceof HTMLElement) {
    const messageBlock = target.closest('div');
    if (messageBlock?.className.includes('wrapper-message')) {
      if (!ChatHistory.msgMenu?.length) {
        const menu = new MessageMenu(id, text);
        ChatHistory.msgMenu = menu;
        if (event instanceof PointerEvent) {
          menu.getNode().style.left = `${event.clientX}px`;
          menu.getNode().style.top = `${event.clientY + window.scrollY}px`;
        }
        document.body.appendChild(menu.getNode());
      }
    }
  }
}

export function closeMessageMenu(): void {
  if (ChatHistory.msgMenu) {
    ChatHistory.msgMenu.destroy();
    ChatHistory.msgMenu = undefined;
  }
}

document.addEventListener('click', (event) => {
  if (ChatHistory.msgMenu !== undefined) {
    const target = event.target;
    if (target instanceof HTMLElement) {
      if (target.className !== 'msg-menu') {
        closeMessageMenu();
      }
    }
  }
});

type mobileTimer = {
  timer: NodeJS.Timeout | undefined;
};

export const myTimer: mobileTimer = { timer: undefined };
