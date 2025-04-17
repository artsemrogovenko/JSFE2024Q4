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
