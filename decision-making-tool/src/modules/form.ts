import State from '../application/state';
import Block from './block';
import { Button } from './buttons';
import { ModeImportOptions, type DataList, type OptionData } from './types';

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
  private listData: Record<string, object> = {};
  private lastId;
  private state: State | undefined;
  constructor(classN: string = '') {
    super('ul', classN, '');
    this.lastId = 0;
  }
  public addOption(args: OptionData | null): void {
    const option = new Option(this, args);
    const idTag = option.getTagId;
    this.listData[idTag] = option.getData();
    this.lastId = Option.currentId();
    option.getNode().addEventListener('updated', () => {
      this.getValues(option);
      this.saveState();
    });
    this.addBlock(option);
    this.saveState();
  }
  public deleteOption(option: Option): void {
    const index = this.deleteBlock(option);
    const optionTag = option.getTagId;
    delete this.listData[optionTag];
    this.components.splice(index, 1);
    this.checkEmpty();
  }
  public clearList(): void {
    this.lastId = 0;
    this.deleteAllBlocks();
    this.checkEmpty();
  }

  public getList(): object {
    const arrayValues = Object.values(this.listData);
    const result = { list: arrayValues, last: this.lastId };
    return result;
  }

  public importData(object: DataList, mode: ModeImportOptions): void {
    // console.log(object);
    const dataValues = object.list;
    if (mode === ModeImportOptions.JSON) {
      this.clearList();
      Option.resetCounter();
    } else {
      Option.setLastId(this.lastId + 1);
    }
    dataValues.forEach((value) => {
      const id =
        mode === ModeImportOptions.JSON ? value.id : `${Option.currentId()}`;
      const title = value.title;
      const weight = value.weight;
      this.addOption({ id, title, weight });
    });
    if (mode === ModeImportOptions.JSON) {
      this.lastId = object.last;
      Option.setLastId(object.last);
    }
    this.saveState();
  }
  public setState(state: State): void {
    this.state = state;
    if (state.getValue('listData')) {
      const oldState = JSON.parse(state.getValue('listData'));
      this.importData(oldState, ModeImportOptions.JSON);
    }
  }
  public saveState(): void {
    if (this.state instanceof State) {
      const value = JSON.stringify(this.getList());
      this.state.setValue('listData', value);
    }
  }
  private checkEmpty(): void {
    // console.log(this.components);
    if (this.components.length === 0) {
      Option.resetCounter();
      this.listData = {};
    }
    this.saveState();
  }
  private getValues(option: Option): void {
    const element = option.getData();
    const id = element.id;
    this.listData[id] = element;
  }
}

export class Option extends Block<'li'> {
  private static uid: number = 0;
  private parentContainer: Options;
  private titleInput: Input;
  private weightInput: Input;
  private optionData: Record<string, string> = {
    id: '',
    title: '',
    weight: '',
  };
  private idTag: string;

  constructor(container: Options, args: OptionData | null) {
    super('li', 'option');
    if (args !== null) {
      Option.uid = Number(args.id.replace('#', ''));
      this.optionData.title = args.title;
      this.optionData.weight = args.weight;
    } else {
      Option.uid += 1;
    }

    const idName = `option_${Option.uid}`;
    const labelText = `#${Option.uid}`;
    const idLabel = new Label('option_id', idName, labelText);
    this.titleInput = new Input(
      'option_title',
      'text',
      args?.title ?? '',
      idName,
      'title',
      'title',
    );
    this.weightInput = new Input(
      'option_weight',
      'number',
      args?.weight ?? '',
      '',
      'weight',
      'weight',
    );
    const button = new Button('deleteOption', 'delete');
    button.addListener('click', () => {
      this.parentContainer.deleteOption(this);
    });

    this.addBlocks([idLabel, this.titleInput, this.weightInput, button]);
    this.parentContainer = container;
    this.optionData['id'] = labelText;
    this.idTag = labelText;

    this.titleInput.addListener('change', (e) => this.updateData(e));
    this.weightInput.addListener('change', (e) => this.updateData(e));
    this.weightInput.getNode().ariaValueMin = '0';
  }
  public get getTagId(): string {
    return this.idTag;
  }
  public static currentId(): number {
    return Option.uid;
  }
  public static setLastId(value: number): void {
    Option.uid = value;
  }
  public static resetCounter(): void {
    Option.uid = 0;
  }
  public getData(): Record<string, string> {
    return this.optionData;
  }

  private updateData(event: Event): void {
    const element = event.target;
    if (element instanceof HTMLInputElement) {
      const value: string = element.value;
      const name: string = element.name;
      this.optionData[name] = value;
      element.dispatchEvent(
        new Event('updated', { bubbles: true, cancelable: false }),
      );
    }
  }
}
