import { appLogic } from '..';
import type Block from './block';
import { MessageStatuses } from './types';

export function disableClick(
  element: Block<keyof HTMLElementTagNameMap>,
): void {
  element.getNode().classList.add('inactive');
  element.addListener('click', preventDefault, true);
  element.addListener('keydown', preventDefault, true);
}
export function enableClick(element: Block<keyof HTMLElementTagNameMap>): void {
  element.getNode().classList.remove('inactive');
  element.removeListener('click', preventDefault, true);
  element.removeListener('keydown', preventDefault, true);
}

function preventDefault(event: Event): void {
  event.preventDefault();
  event.stopImmediatePropagation();
}

export function messageLogic(
  event: Event,
  messageId: string,
  owner: boolean,
  status: MessageStatuses,
): void {
  if (owner === false && !status.isReaded) {
    appLogic.readMessage(messageId);
  }
}
