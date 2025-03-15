import Block, { Container } from '../modules/block';
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

    const [add, csv, clear, save, load, start] = ButtonsCreator.createButtons(
      6,
      buttonsText,
    );

    add.addListener('click', () => this.optionList.addOption(null));
    clear.addListener('click', () => this.optionList.clearList());
    csv.addListener('click', () => this.listUtil.parseCSV());
    load.addListener('click', () => this.listUtil.loadFile());
    save.addListener('click', () => {
      const data = this.optionList.getList();
      this.listUtil.saveJson(data);
    });
    start.addListener('click', () => {
      window.history.pushState({}, '', '/picker');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    const buttonsContainer = new Container('btn-container');
    buttonsContainer.addBlocks([add, csv, clear, save, load, start]);
    this.addBlock(buttonsContainer);
  }
}
