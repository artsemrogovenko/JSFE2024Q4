import Block from '../modules/block';
import { ButtonsCreator } from '../modules/buttons';
import { Option, Options } from '../modules/form';

export default class OptionsView extends Block<'main'> {
  private optionList = new Options();
  constructor() {
    super('main', 'mainOptions');
    this.addContent();
  }
  private addContent(): void {
    const title = document.createElement('h1');
    title.textContent = 'Decision Making Tool';
    this.getNode().append(title);

    this.addBlock(this.optionList);

    this.addButtons();
  }

  private addButtons(): void {
    const buttonsText = [
      'Add Option',
      'Paste csv',
      'Clear List',
      'Export from json',
      'Import from json',
      'Start',
    ];
    const buttons = new ButtonsCreator().createButtons(6, buttonsText);
    buttons[0].addListener('click', () =>
      this.optionList.addOption(new Option())
    );
    this.addBlocks(buttons);
  }
}
