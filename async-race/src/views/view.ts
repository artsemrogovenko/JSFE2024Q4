import Block, { Container } from '../modules/block';
import type { RaceState } from '../modules/types';
import { PageMode } from '../modules/types';
import { pagesLogic } from './pages-logic';

type HeadingType = 'h2' | 'h4';
class Heading extends Block<HeadingType> {
  constructor(type: HeadingType, className: string) {
    super(type, className);
  }
}

export class View extends Block<'main'> {
  protected raceState: RaceState | undefined;
  private mode = pagesLogic.getMode();
  private pageState = pagesLogic.getPageState();
  private infoBox = new Container('cars-and-page');
  private countTitle = new Heading('h2', 'title-database');
  private pageTitle = new Heading('h4', 'title-page');

  constructor(className: string) {
    super('main', className);
    this.infoBox.addBlocks([this.countTitle, this.pageTitle]);
  }

  public get getRaceState(): RaceState | undefined {
    return this.raceState;
  }

  public updateTitles(count: number): void {
    if (this.mode !== PageMode.not_found) {
      pagesLogic.updateTitles(count);
      this.pageTitle.setText(`Page #${this.pageState[this.mode]}`);
      this.countTitle.setText(`${this.mode} (${count})`);
    }
  }

  public headlines(mode: PageMode): Container {
    pagesLogic.setMode(mode, this);
    return this.infoBox;
  }
}
