import Block from './block';

export class Button extends Block<'button'> {
  constructor(classN: string = '', text: string = '') {
    super('button', `ui-button ${classN}`, text);
  }
}
