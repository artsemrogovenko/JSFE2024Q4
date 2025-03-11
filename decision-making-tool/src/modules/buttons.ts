import Block from './block';

export class Button extends Block<'button'> {
  constructor(classN: string = '', text: string = '') {
    super('button', classN, text);
  }
}

export class ButtonsCreator {
  /**
   *
   * @param count count of buttons
   * @param param1 list of buttons text
   * @param param2 list of buttons classnames
   * @returns
   */
  public static createButtons(
    count: number = 1,
    ...[buttonsText, buttonsClasses]: string[][]
  ): Button[] {
    const prefix = '_uiBtn';
    let buttons: Button[] = [];
    const counts = Math.max(
      buttonsText?.length ?? 0,
      buttonsClasses?.length ?? 0,
      count,
    );
    for (let index = 0; index < counts; index++) {
      const text = buttonsText[index] ?? '';
      const button = new Button('', text);

      if (buttonsClasses) {
        console.log('classes not empty');
        try {
          button.getNode().className = `${prefix} ${buttonsClasses[index]}`;
        } catch (error) {
          button.getNode().className = prefix;
        }
      } else {
        button.getNode().className =
          prefix + ' _' + text.toLowerCase().replaceAll(' ', '_');
      }

      buttons.push(button);
    }
    return buttons;
  }
}
