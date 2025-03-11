import { ButtonsCreator } from './buttons';

export default class OptionsUtils {
  private dialog: HTMLDialogElement;

  constructor() {
    this.dialog = document.createElement('dialog');
    this.init();
  }

  public parseCSV(): void {
    this.openWindow();
  }
  private openWindow(): void {
    document.body.appendChild(this.dialog);
  }
  private closeWindow(): void {
    document.body.removeChild(this.dialog);
  }

  private init(): void {
    this.dialog.className = 'csv_dialog';
    const [buttonCancel, buttonOk] = ButtonsCreator.createButtons(
      2,
      ['Cancel', 'OK'],
      ['_form-csv-cancel', '_form-csv-ok'],
    );

    buttonCancel.addListener('click', () => this.closeWindow());
    buttonOk.addListener('click', () => {});

    this.dialog.append(buttonCancel.getNode(), buttonOk.getNode());
  }
}
