import type State from '../application/state';
import { isCarParam } from '../views/garage/functions';
import type GarageView from '../views/garage/garage';
import Block, { Container } from './block';
import { Button } from './buttons';
import type { CarParam, FormType } from './types';

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

export default class Form extends Container {
  private state: State;
  private nameInput: Input;
  private colorInput: Input;
  private button: Button;
  private values: CarParam = { name: '', color: '' };
  private submitAction: string;
  constructor(className: string, submitClass: string, view: GarageView) {
    super(className);
    this.state = view.getState;
    this.submitAction = submitClass;
    this.nameInput = new Input('input-name', 'text', '', '', 'Car name', '');
    this.colorInput = new Input('pick-color', 'color', 'color', '', '');
    this.button = new Button(submitClass, submitClass);
    this.addBlocks([this.nameInput, this.colorInput, this.button]);
    this.button.addListener('click', () => this.submitForm(view));
    this.colorInput.addListener('change', this.updateValues.bind(this));
    this.nameInput.addListener('change', this.updateValues.bind(this));
    this.loadState();
  }

  public get getButton(): Button {
    return this.button;
  }

  public get params(): FormType {
    return this.values;
  }

  public setValues(data: CarParam): void {
    if (this.colorInput.getNode() instanceof HTMLInputElement) {
      this.colorInput.setValue(data.color);
    }
    if (this.nameInput.getNode() instanceof HTMLInputElement) {
      this.nameInput.setValue(data.name);
    }
  }
  public resetInput(): void {
    this.nameInput.setValue('');
    this.values.name = '';
    this.saveState();
  }

  private updateValues(): void {
    if (this.colorInput.getNode() instanceof HTMLInputElement) {
      this.values.color = this.colorInput.getValue();
    }
    if (this.nameInput.getNode() instanceof HTMLInputElement) {
      this.values.name = this.nameInput.getValue();
    }
    this.saveState();
  }

  private submitForm(view: GarageView): void {
    const className = this.getNode().className;
    view.getForm(className, this.values);
  }

  private loadState(): void {
    const rawData = this.state.getValue(this.submitAction);
    if (rawData) {
      const data = JSON.parse(rawData);
      if (isCarParam(data)) {
        this.nameInput.setValue(data.name);
        this.colorInput.setValue(data.color);
        this.updateValues();
      }
    } else {
      this.saveState();
    }
  }

  private saveState(): void {
    this.state.setValue(this.submitAction, JSON.stringify(this.values));
  }
}
