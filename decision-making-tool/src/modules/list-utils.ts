import type OptionsView from '../list/options-view';
import type { Button } from './buttons';
import { ButtonsCreator } from './buttons';
import type { DataList } from './types';

export default class OptionsUtils {
  private dialog: HTMLDialogElement;
  private view: OptionsView;
  private textArea = document.createElement('textarea');
  private buttonOk: Button;
  private buttonCancel: Button;
  private filePicker = document.createElement('input');
  private saveLink = document.createElement('a');

  constructor(member: OptionsView) {
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
    this.init();
    this.view = member;
  }

  public parseCSV(): void {
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
  private openWindow(): void {
    document.body.appendChild(this.dialog);
  }
  private closeWindow(): void {
    this.clearArea();
    document.body.removeChild(this.dialog);
  }

  private clearArea(): void {
    this.textArea.value = '';
  }

  private init(): void {
    this.dialog.className = 'csv_dialog';

    this.buttonCancel.addListener('click', () => this.closeWindow());
    this.buttonOk.addListener('click', () => {
      this.getText();
      this.closeWindow();
    });

    const placeholder =
      'Insert new options data as text in a CSV-like format\nExample: title,weight';
    this.textArea.placeholder = placeholder;
    this.textArea.rows = 12;
    this.textArea.autocomplete = 'off';
    this.textArea.spellcheck = false;

    this.dialog.append(
      this.textArea,
      this.buttonCancel.getNode(),
      this.buttonOk.getNode(),
    );

    this.filePicker.addEventListener('change', (event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement) {
        this.parseJsonData(target.files);
      }
    });
  }

  private getText(): void {
    const values = this.textArea.value.split(/\n/);
    console.log(values);
    const lines = values
      .filter((line) => line.includes(','))
      .map((line) => {
        const lastComma = line.lastIndexOf(',');
        return [
          line.slice(0, lastComma),
          line.slice(lastComma + 1, line.length),
        ];
      });
    console.log(lines);
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
        title: title,
        weight: weight,
      };
    });
    const object: DataList = { list: listData, last: length };
    console.log(object);
    this.view.getOptionData(object);
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
        this.view.getOptionData(jsonData);
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
