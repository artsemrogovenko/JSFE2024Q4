import type OptionsView from '../list/options-view';
import type { Button } from './buttons';
import { ButtonsCreator } from './buttons';

export default class OptionsUtils {
  private dialog: HTMLDialogElement;
  private view: OptionsView;
  private textArea = document.createElement('textarea');
  private buttonOk: Button;
  private buttonCancel: Button;
  private filePicker = document.createElement('input');

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
      const target = event.target as HTMLInputElement;
      if (target) {
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
    this.view.getOptionData(lines);
  }

  public loadFile() {
    this.filePicker.click();
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

    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result !== 'string') {
          throw new Error('File content is not a string');
        }
        const jsonData = JSON.parse(result);
        console.log(jsonData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };

    reader.onerror = () => {
      console.error('Error reading the file');
    };

    reader.readAsText(jsonFile);
  }
}
