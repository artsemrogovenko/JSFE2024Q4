import { pushState } from '../application/router';
import { Container } from '../modules/block';
import { Button } from '../modules/buttons';
import { ButtonsCreator } from '../modules/buttons';
import { Sound } from '../modules/sound';
import { Limits, PageMode, RaceState } from '../modules/types';
import { disableClick, enableClick } from './garage/functions';
import GarageView from './garage/garage';
import { View } from './view';

export default class Pages {
  private viewSelect = new Container('view-select');
  private pagination = new Container('pagination');
  private view: View | undefined;
  private soundButton = new Button('sound');

  private mode: PageMode;
  private garage: Button;
  private winners: Button;
  private prev: Button;
  private next: Button;

  private pageState = { garage: 1, winners: 1, 404: 1 };
  private maxPage: number;
  private middleUpdated: boolean = false;

  constructor() {
    this.view = undefined;
    this.mode = PageMode.garage;
    const buttonsTitles = ['to garage', 'to winners', 'prev', 'next'];
    [this.garage, this.winners, this.prev, this.next] =
      ButtonsCreator.createButtons(buttonsTitles.length, buttonsTitles);
    this.viewSelect.addBlocks([this.garage, this.winners]);
    this.pagination.addBlocks([this.prev, this.next]);

    this.viewSelect.addListener('click', (event) => this.buttonLogic(event));
    this.pagination.addListener('click', (event) => this.buttonLogic(event));
    this.maxPage = 1;
    this.soundButton.addListener('click', () => {
      const buttonState = Sound.toggleVolume();
      if (buttonState) {
        this.soundButton.removeClass('muted');
      } else {
        this.soundButton.addClass('muted');
      }
    });
  }
  public get getSoundButton(): Button {
    return this.soundButton;
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
      this.togglePagination();
    }
  }

  public setMode(mode: PageMode, view: View): void {
    this.view = view;
    this.mode = mode;
    this.togglePagination();
    this.toggleViews();
  }
  public getMode(): PageMode {
    return this.mode;
  }
  public getPageState(): Record<string, number> {
    return this.pageState;
  }

  public setNotFound(): void {
    this.mode = PageMode.not_found;
    this.togglePagination();
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
            this.togglePagination();
            const pageEvent = new CustomEvent('page-changed', {
              detail: { page: page },
            });
            if (this.view instanceof View)
              this.view.getNode().dispatchEvent(pageEvent);
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
        if (this.view?.getRaceState === RaceState.RACING) {
          return;
        }
        if (this.view instanceof GarageView) {
          this.view.clearRace();
        }
        this.mode = PageMode.winners;
        pushState('/winners');
        break;
      default:
        break;
    }
  }

  private toggleViews(): void {
    switch (this.mode) {
      case PageMode.winners:
        enableClick(this.garage);
        disableClick(this.winners);
        break;
      case PageMode.garage:
        disableClick(this.garage);
        enableClick(this.winners);
        break;
    }
  }

  private togglePagination(): void {
    if (this.pageState[this.mode] === 1 && this.maxPage === 1) {
      disableClick(this.next);
      disableClick(this.prev);
      this.middleUpdated = false;
      return;
    }
    if (this.pageState[this.mode] === this.maxPage) {
      disableClick(this.next);
      enableClick(this.prev);
      this.middleUpdated = false;
      return;
    }
    if (this.pageState[this.mode] === 1) {
      enableClick(this.next);
      disableClick(this.prev);
      this.middleUpdated = false;
      return;
    }
    if (!this.middleUpdated) {
      enableClick(this.next);
      enableClick(this.prev);
      this.middleUpdated = true;
    }
  }
}

export const pagesLogic = new Pages();
