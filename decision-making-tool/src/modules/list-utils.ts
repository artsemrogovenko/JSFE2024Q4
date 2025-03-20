import type State from '../application/state';
import OptionsView from '../list/options-view';
import type PickerView from '../picker/picker-view';
import { Container } from './block';
import type { Button } from './buttons';
import { ButtonsCreator } from './buttons';
import { ModeImportOptions, type DataList } from './types';

export default class OptionsUtils {
  private dialog: HTMLDialogElement;
  private dialogBackdrop: Container;
  private view: OptionsView | PickerView;
  private textArea = document.createElement('textarea');
  private buttonOk: Button;
  private buttonCancel: Button;
  private filePicker = document.createElement('input');
  private saveLink = document.createElement('a');
  constructor(member: OptionsView | PickerView) {
    this.filePicker.type = 'file';
    this.filePicker.accept = '.json';
    this.dialog = document.createElement('dialog');
    const buttons = ButtonsCreator.createButtons(
      2,
      ['Cancel', 'OK'],
      ['_form-csv-cancel', '_form-csv-ok'],
    );
    this.buttonCancel = buttons[0];
    this.buttonOk = buttons[1];
    this.dialogBackdrop = new Container('backdrop');
    this.init();
    this.view = member;
  }

  public parseCSV(): void {
    this.csvDialog();
    this.openWindow();
  }
  public loadFile(): void {
    this.filePicker.click();
  }

  public saveJson(data: object): void {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    this.saveLink.href = url;
    this.saveLink.download = 'decision-list.json';
    this.saveLink.click();
    URL.revokeObjectURL(url);
  }

  public showError(message: string = ''): void {
    this.dialog.className = 'error_dialog';
    const placeholder =
      message !== ''
        ? message
        : `A minimum of 2 completed options are required.\nEach option must have a title and weight > 0`;
    this.textArea.placeholder = placeholder;
    this.textArea.rows = 4;
    this.buttonCancel.setText('OK');
    this.textArea.setAttribute('disabled', 'disabled');
    this.dialog.replaceChildren();
    this.dialog.append(this.textArea, this.buttonCancel.getNode());

    this.openWindow();
  }
  public applyCSV(): void {
    this.getText();
  }

  public closeWindow(): void {
    this.clearArea();
    const node = this.dialogBackdrop.getNode();
    if (node && document.body.contains(node)) {
      document.body.removeChild(node);
    }
    document.body.classList.remove('no-scroll');
  }
  private openWindow(): void {
    document.body.classList.add('no-scroll');
    document.addEventListener('keyup', (e) => closeDialog(e, this));
    document.body.appendChild(this.dialogBackdrop.getNode());
  }

  private clearArea(): void {
    this.textArea.value = '';
  }

  private csvDialog(): void {
    this.dialog.className = 'dialog csv_dialog';
    const placeholder =
      'Insert new options data as text in a CSV-like format\nExample: title,weight';
    this.textArea.placeholder = placeholder;
    this.textArea.rows = 12;
    this.buttonCancel.setText('Cancel');
    this.textArea.removeAttribute('disabled');
    this.dialog.replaceChildren();
    this.dialog.append(
      this.textArea,
      this.buttonCancel.getNode(),
      this.buttonOk.getNode(),
    );
  }

  private init(): void {
    this.dialogBackdrop.getNode().appendChild(this.dialog);
    this.dialogBackdrop.addListener('click', (e) => closeDialog(e, this));

    this.textArea.autocomplete = 'off';
    this.textArea.spellcheck = false;
    this.textArea.className = 'dialog-textarea';
    this.buttonCancel.addListener('click', (e) => closeDialog(e, this));
    this.buttonOk.addListener('click', (e) => closeDialog(e, this));
    this.dialog.addEventListener('click', (e) => closeDialog(e, this));

    this.filePicker.addEventListener('change', (event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement) {
        this.parseJsonData(target.files);
      }
    });
  }

  private getText(): void {
    const values = this.textArea.value.split(/\n/);
    // console.log(values);
    const lines = values
      .filter((line) => line.includes(','))
      .map((line) => {
        const lastComma = line.lastIndexOf(',');
        return [
          line.slice(0, lastComma),
          line.slice(lastComma + 1, line.length),
        ];
      });
    // console.log(lines);
    if (lines.length > 0) {
      this.formatData(lines);
    }
    return;
  }

  private formatData(array: string[][]): void {
    const length = array.length;
    const listData = array.map((line, index) => {
      const [title, weight] = line;
      return {
        id: `#${index + 1}`,
        title: title.trim(),
        weight: weight.trim(),
      };
    });
    const object: DataList = { list: listData, last: length };
    // console.log(object);
    if (this.view instanceof OptionsView) {
      this.view.getOptionData(object, ModeImportOptions.CSV);
    }
  }

  private parseJsonData(files: FileList | null): void {
    if (!files || files.length === 0) {
      console.error('No file selected');
      return;
    }

    const jsonFile = files.item(0);
    if (!jsonFile) {
      console.error('Invalid file');
      return;
    }

    const reader = new FileReader();

    reader.onload = (event): void => {
      try {
        const result = event.target?.result;
        if (typeof result !== 'string') {
          throw new Error('File content is not a string');
        }
        const jsonData = JSON.parse(result);
        if (this.view instanceof OptionsView) {
          this.view.getOptionData(jsonData, ModeImportOptions.JSON);
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };

    reader.onerror = (): void => {
      console.error('Error reading the file');
    };

    reader.readAsText(jsonFile);
  }
}

export function correctAmount(state: State): boolean {
  try {
    const dataList: DataList = JSON.parse(state.getValue('listData'));
    const options = dataList.list;
    let count = 0;
    if (options) {
      for (let i = 0; i < options.length; i += 1) {
        const option = options[i];
        if (
          option.title !== '' &&
          option.weight !== '' &&
          Number(option.weight) > 0
        ) {
          count += 1;
        }
        if (count >= 2) {
          return true;
        }
      }
    }
  } catch (error) {
    return false;
  }
  return false;
}

export function closeDialog(event: Event, cls: OptionsUtils): void {
  const target = event.target;
  if (target instanceof HTMLElement && event.type === 'click') {
    if (target.className.includes('_form-csv-ok')) {
      cls.applyCSV();
      cls.closeWindow();
      return;
    }
    if (
      target.className.includes('_form-csv-cancel') ||
      target.className.includes('backdrop')
    ) {
      cls.closeWindow();
      return;
    }
  }
  if (event instanceof KeyboardEvent) {
    const key = event.key;
    if (key === 'Escape') {
      cls.closeWindow();
    }
  }
}
