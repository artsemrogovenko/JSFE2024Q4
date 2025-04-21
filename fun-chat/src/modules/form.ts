import Block from './block';
import type { Input, InputText } from './inputs';
import type { Indicator } from './types';

export class Label extends Block<'label'> {
  constructor(
    className: string = '',
    for_input: string = '',
    text: string = '',
  ) {
    super('label', className, text);
    this.element.setAttribute('for', for_input);
  }
}

export class Form<T extends Input> extends Block<'form'> {
  private label: Label | undefined;
  private input: Input;
  constructor(
    className: string = '',
    name: string,
    input: T,
    autocomplete: Indicator,
    required: boolean,
    label?: string,
  ) {
    super('form', className);
    this.input = input;
    this.input.setAttribute('autocomplete', autocomplete);
    if (required) {
      this.input.setAttribute('required', '');
    }
    if (label) {
      this.label = new Label(`${name}-label`, name, label);
      this.addBlock(this.label);
    }
    this.addBlock(this.input);
  }

  public get getLabel(): Label | undefined {
    return this.label;
  }
  public get getInput(): Input {
    return this.input;
  }

  public replaceChild(newChild: InputText, oldChild: InputText): void {
    this.getNode().replaceChild(newChild.getNode(), oldChild.getNode());
  }
}

export class Paragraph extends Block<'p'> {
  constructor(className: string = '', text: string = '') {
    super('p', className, text);
  }
  public getText(): string {
    return this.getNode().textContent || '';
  }
}

export class Anchor extends Block<'a'> {
  constructor(className: string) {
    super('a', className);
  }
}
