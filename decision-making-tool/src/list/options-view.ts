import type State from '../application/state';
import Block, { Container } from '../modules/block';
import { ButtonsCreator } from '../modules/buttons';
import { Options } from '../modules/form';
import OptionsUtils from '../modules/list-utils';
import type { DataList, ModeImportOptions } from '../modules/types';
import { correctAmount } from '../modules/list-utils';
import { pushState } from '../application/router';

export default class OptionsView extends Block<'main'> {
  private optionList = new Options('optionsList');
  private listUtil = new OptionsUtils(this);
  private state: State;
  constructor(state: State) {
    super('main', 'mainOptions');
    this.optionList.setState(state);
    this.state = state;
    this.addContent();
  }
  public getUtils(): OptionsUtils {
    return this.listUtil;
  }
  public getOptionData(data: DataList, mode: ModeImportOptions): void {
    this.optionList.importData(data, mode);
  }

  private addContent(): void {
    const storageData = this.state.storageData();
    const obj = Object.assign({}, storageData);
    if (
      Object.keys(obj).length === 0 &&
      this.state.getValue('listData') === ''
    ) {
      this.optionList.addOption(null);
    }
    // console.log(Object.get storageData instanceof Object);
    // const title = document.createElement('h1');
    // title.textContent = 'Decision Making Tool';
    // this.getNode().append(title);
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
      if (correctAmount(this.state)) {
        pushState('/picker');
      } else {
        this.listUtil.showError();
      }
    });

    const buttonsContainer = new Container('btn-container');
    buttonsContainer.addBlocks([add, csv, clear, save, load, start]);
    this.addBlock(buttonsContainer);
  }
}
