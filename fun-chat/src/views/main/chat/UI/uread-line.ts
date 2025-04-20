import Block from '../../../../modules/block';

export class UnreadLine extends Block<'div'> {
  constructor() {
    super('div', 'underline');
    this.setText('Новые сообщения');
    const underline = document.createElement('hr');
    this.getNode().appendChild(underline);
  }
}
