import { appLogic } from '../../..';
import type UserElement from './user-element';
import { UserList } from './users-block';

export function pickUser(event: Event): UserElement | undefined {
  const target = event.target;
  if (target instanceof HTMLElement) {
    const element = target.closest('li');
    if (element !== null) {
      const text = element.textContent;
      if (text !== null) {
        return UserList.getUser(text);
      }
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
