import Block from '../modules/block';
import { ButtonsCreator } from '../modules/buttons';
import { Options } from '../modules/form';
import OptionsUtils from '../modules/list-utils';

export default class OptionsView extends Block<'main'> {
  private optionList = new Options('optionsList');
  private listUtil = new OptionsUtils(this);
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
      'Paste CSV',
      'Clear List',
      'Export from json',
      'Import from json',
      'Start',
    ];
    const buttons = ButtonsCreator.createButtons(6, buttonsText);
    buttons[0].addListener('click', () => this.optionList.addOption());
    buttons[2].addListener('click', () => this.optionList.clearList());
    buttons[1].addListener('click', () => this.listUtil.parseCSV());
    buttons[4].addListener('click', () => this.listUtil.loadFile());
    this.addBlocks(buttons);
  }
  public getOptionData(lines: string[][]) {
    //TODO
    console.log('todo');
  }
}
