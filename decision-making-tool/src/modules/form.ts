import Block from './block';

export class Input extends Block<'input'> {
  constructor(
    classN: string = '',
    type: string = '',
    value: string = '',
    id: string,
    name: string = '',
  ) {
    super('input', classN, '');
    const input = this.element;
    input.type = type;
    input.value = value;
    input.id = id;
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
}

export class Option extends Block<'li'> {
  constructor(classN: string = '') {
    super('li', classN, '');
  }
}
