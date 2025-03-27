import Block from './block';

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

  public getValue(): string {
    const input = this.getNode();
    if (input instanceof HTMLInputElement) {
      return input.value;
    }
    return '';
  }

  public setValue(newValue: string): void {
    const input = this.getNode();
    if (input instanceof HTMLInputElement) {
      input.value = newValue;
    }
  }
}

export class Label extends Block<'label'> {
  constructor(classN: string = '', for_input: string = '', text: string = '') {
    super('label', classN, text);
    this.element.setAttribute('for', for_input);
  }
}
