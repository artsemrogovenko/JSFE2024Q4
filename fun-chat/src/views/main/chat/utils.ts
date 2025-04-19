import { appLogic } from '../../..';
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
