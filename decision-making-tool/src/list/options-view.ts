import Block from '../modules/block';
import { ButtonsCreator } from '../modules/buttons';
import { Options } from '../modules/form';
import OptionsUtils from '../modules/list-utils';
import type { DataList } from '../modules/types';

export default class OptionsView extends Block<'main'> {
  private optionList = new Options('optionsList');
  private listUtil = new OptionsUtils(this);
  constructor() {
    super('main', 'mainOptions');
    this.addContent();
  }

  public getOptionData(data: DataList): void {
    this.optionList.importData(data);
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
    buttons[0].addListener('click', () => this.optionList.addOption(null));
    buttons[2].addListener('click', () => this.optionList.clearList());
    buttons[1].addListener('click', () => this.listUtil.parseCSV());
    buttons[4].addListener('click', () => this.listUtil.loadFile());
    buttons[3].addListener('click', () => {
      const data = this.optionList.getList();
      this.listUtil.saveJson(data);
    });
    this.addBlocks(buttons);
  }
}
