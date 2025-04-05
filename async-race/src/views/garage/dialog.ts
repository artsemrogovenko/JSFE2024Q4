import { Container } from '../../modules/block';
import type { Car } from '../../modules/types';

const dialog = new Container('dialog');
const dialogBackdrop = new Container('backdrop');
dialogBackdrop.addBlock(dialog);
dialogBackdrop.addListener('click', closeDialog);
document.addEventListener('keyup', closeDialog);

export function showInfo(message: string = '', carColor?: boolean): void {
  dialog.setText(message);
  if (!carColor) {
    dialog.getNode().removeAttribute('style');
  }
  openWindow();
}

function closeWindow(): void {
  const node = dialogBackdrop.getNode();
  if (node && document.body.contains(node)) {
    document.body.removeChild(node);
  }
  document.body.classList.remove('no-scroll');
}
function openWindow(): void {
  document.body.classList.add('no-scroll');
  document.body.appendChild(dialogBackdrop.getNode());
}

function closeDialog(event: Event): void {
  const target = event.target;
  if (target instanceof HTMLElement && event.type === 'click') {
    if (
      target.className.includes('dialog') ||
      target.className.includes('backdrop')
    ) {
      closeWindow();
      return;
    }
  }
  if (event instanceof KeyboardEvent) {
    const key = event.key;
    if (key === 'Escape') {
      closeWindow();
    }
  }
}

export function carFormatter(data: Car, time: number, color?: string): void {
  const str = `№${data.id} ${data.name} won! ${time} seconds`;
  if (color) {
    dialog.setStyle().textDecoration = `underline ${color}`;
    dialog.setStyle().textDecorationThickness = ` 0.5em`;
  }
  showInfo(str, true);
}
