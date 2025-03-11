import Block from './block';

export class Button extends Block<'button'> {
  constructor(classN: string = '', text: string = '') {
    super('button', classN, text);
  }
}

export class ButtonsCreator {
  public createButtons(count: number = 1, buttonsText: string[]): Button[] {
    let buttons: Button[] = [];
    const counts = buttonsText.length ?? count;
    for (let index = 0; index < counts; index++) {
      const text = buttonsText[index] ?? '';
      const button = new Button('', text);
      if (text === '') {
        button.getNode().className = '_uiBtn';
      } else {
        button.getNode().className =
          '_uiBtn _' + text.toLowerCase().replaceAll(' ', '_');
      }
      buttons.push(button);
    }
    return buttons;
  }
}
