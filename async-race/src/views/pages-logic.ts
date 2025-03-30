import { Container } from '../modules/block';
import type { Button } from '../modules/buttons';
import { ButtonsCreator } from '../modules/buttons';
import { Limits, PageMode } from '../modules/types';

export default class Pages {
  private viewSelect = new Container('view-select');
  private infoBox = new Container('cars-and-page');
  private pagination = new Container('pagination');

  private countTitle = document.createElement('h2');
  private pageTitle = document.createElement('h4');

  private mode: PageMode;
  private garage: Button;
  private winners: Button;
  private prev: Button;
  private next: Button;

  private pageState = { garage: 1, winners: 1 };

  private maxPage: number;
  constructor() {
    this.mode = PageMode.garage;
    const buttonsTitles = ['to garage', 'to winners', 'prev', 'next'];
    [this.garage, this.winners, this.prev, this.next] =
      ButtonsCreator.createButtons(buttonsTitles.length, buttonsTitles);
    this.viewSelect.addBlocks([this.garage, this.winners]);
    this.pagination.addBlocks([this.prev, this.next]);
    this.countTitle.className = 'title-database';
    this.pageTitle.className = 'title-page';
    this.infoBox.getNode().append(this.countTitle, this.pageTitle);

    this.viewSelect.addListener('click', (event) => this.buttonLogic(event));
    this.pagination.addListener('click', (event) => this.buttonLogic(event));
    this.maxPage = 1;
  }

  public get getPage(): number {
    return this.pageState[this.mode];
  }

  public get selectPages(): Container {
    return this.pagination;
  }

  public get selectorView(): Container {
    return this.viewSelect;
  }

  public headlines(mode: PageMode): Container {
    this.mode = mode;
    return this.infoBox;
  }

  public updateTitles(count: number): void {
    this.maxPage = Math.ceil(count / Limits[this.mode]);
    this.pageTitle.textContent = `Page #${this.pageState[this.mode]}`;
    this.countTitle.textContent = `${this.mode} (${count})`;
  }

  private buttonLogic(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLButtonElement) {
      const buttonText = target.textContent;
      switch (buttonText) {
        case 'prev':
        case 'next':
          const page = this.calcPage(buttonText);
          console.log(this.pageState[this.mode]);
          if (page !== undefined) {
            const pageEvent = new CustomEvent('page-changed', {
              detail: { page: page },
            });
            document.dispatchEvent(pageEvent);
          }
          break;
        default:
          break;
      }
    }
  }

  private calcPage(direction: string): number | undefined {
    switch (direction) {
      case 'next':
        if (this.pageState[this.mode] === this.maxPage) {
          return;
        } else {
          this.pageState[this.mode] += 1;
          return this.pageState[this.mode];
        }
      case 'prev':
        if (this.pageState[this.mode] === 1) {
          return;
        } else {
          this.pageState[this.mode] -= 1;
          return this.pageState[this.mode];
        }
      default:
        break;
    }
    return;
  }
}
