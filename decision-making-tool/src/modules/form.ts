import Block from './block';
import { Button } from './buttons';

export class Input extends Block<'input'> {
  constructor(
    classN: string = '',
    type: string = '',
    value: string = '',
    id: string,
    placeholder: string,
    name: string = '',
  ) {
    super('input', classN, '');
    const input = this.element;
    input.type = type;
    input.value = value;
    input.placeholder = placeholder;
    if (input.id) {
      input.id = id;
    }
    if (name) {
      input.name = name;
    }
  }
}

export class Label extends Block<'label'> {
  constructor(classN: string = '', for_input: string = '', text: string = '') {
    super('label', classN, text);
    this.element.setAttribute('for', for_input);
  }
}

export class Options extends Block<'ul'> {
  constructor(classN: string = '') {
    super('ul', classN, '');
  }
  public addOption(): void {
    const option = new Option(this);
    this.addBlock(option);
  }
  public deleteOption(option: Option): void {
    const index = this.deleteBlock(option);
    this.components.splice(index, 1);
    this.checkEmpty();
  }
  public clearList(): void {
    this.deleteAllBlocks();
    this.checkEmpty();
  }
  private checkEmpty(): void {
    console.log(this.components);
    if (this.components.length === 0) {
      Option.resetCounter();
    }
  }
}

export class Option extends Block<'li'> {
  private static uid: number = 0;
  private parentContainer: Options;
  constructor(options: Options) {
    Option.uid += 1;
    const idName = `option_${Option.uid}`;
    const labelText = `#${Option.uid}`;
    const idLabel = new Label('option_id', idName, labelText);
    const titleInput = new Input(
      'option_title',
      'text',
      '',
      idName,
      'title',
      'title',
    );
    const weightInput = new Input(
      'option_weight',
      'number',
      '',
      '',
      'weight',
      'weight',
    );
    const button = new Button('deleteOption', 'delete');
    button.addListener('click', () => {
      this.parentContainer.deleteOption(this);
    });

    super('li', 'option');
    super.addBlocks([idLabel, titleInput, weightInput, button]);
    this.parentContainer = options;
  }

  // public destroy(): void {
  //   super.destroy();
  // }
  public static resetCounter(): void {
    Option.uid = 0;
  }
}
