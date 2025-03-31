import { pushState } from '../application/router';
import { Container } from '../modules/block';
import type { Button } from '../modules/buttons';
import { ButtonsCreator } from '../modules/buttons';
import { Limits, PageMode } from '../modules/types';

export default class Pages {
  private viewSelect = new Container('view-select');
  private pagination = new Container('pagination');

  private mode: PageMode;
  private garage: Button;
  private winners: Button;
  private prev: Button;
  private next: Button;

  private pageState = { garage: 1, winners: 1, 404: 0 };
  private maxPage: number;

  constructor() {
    this.mode = PageMode.garage;
    const buttonsTitles = ['to garage', 'to winners', 'prev', 'next'];
    [this.garage, this.winners, this.prev, this.next] =
      ButtonsCreator.createButtons(buttonsTitles.length, buttonsTitles);
    this.viewSelect.addBlocks([this.garage, this.winners]);
    this.pagination.addBlocks([this.prev, this.next]);

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

  public updateTitles(count: number): void {
    if (this.mode !== PageMode.not_found) {
      this.maxPage = Math.ceil(count / Limits[this.mode]);
    }
  }

  public setMode(mode: PageMode): void {
    this.mode = mode;
  }
  public getMode(): PageMode {
    return this.mode;
  }
  public getPageState(): Record<string, number> {
    return this.pageState;
  }

  public setNotFound(): void {
    this.mode = PageMode.not_found;
  }

  private buttonLogic(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLButtonElement) {
      const buttonText = target.textContent;
      switch (buttonText) {
        case 'prev':
        case 'next':
          const page = this.calcPage(buttonText);
          if (page !== undefined) {
            const pageEvent = new CustomEvent('page-changed', {
              detail: { page: page },
            });
            document.dispatchEvent(pageEvent);
          }
          break;
        case 'to garage':
        case 'to winners':
          this.viewHandler(buttonText);
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

  private viewHandler(buttonText: string): void {
    switch (buttonText) {
      case 'to garage':
        if (this.mode === PageMode.garage) {
          return;
        }
        this.mode = PageMode.garage;
        pushState('/garage');
        break;
      case 'to winners':
        if (this.mode === PageMode.winners) {
          return;
        }
        this.mode = PageMode.winners;
        pushState('/winners');
        break;
      default:
        break;
    }
  }
}

export const pagesLogic = new Pages();
