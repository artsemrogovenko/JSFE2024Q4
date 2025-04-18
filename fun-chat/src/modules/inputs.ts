import Block from './block';

export class Input extends Block<'input'> {
  constructor(
    classN: string = '',
    type: string = '',
    value: string = '',
    placeholder: string,
    id: string,
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

  public disable(): void {
    this.element.disabled = true;
  }

  public enable(): void {
    this.element.disabled = false;
  }

  public clear(): void {
    this.element.value = '';
  }
}

export class InputText extends Input {
  constructor(className: string) {
    super(className, 'text', '', '', '');
    this.element.autocomplete = 'off';
  }
}

export class InputPassword extends Input {
  constructor(className: string) {
    super(className, 'password', '', '', '');
    this.element.autocomplete = 'off';
    this.element.required = true;
  }
}

export class Search extends Input {
  constructor(className: string) {
    super(className, 'search', '', '', '');
    this.element.autocomplete = 'off';
  }
}
