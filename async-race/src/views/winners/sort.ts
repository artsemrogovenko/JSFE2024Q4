import type Block from '../../modules/block';
import Table from '../../modules/table';
import type { Order, Sort, SortWinners, Winner } from '../../modules/types';

class SortTable {
  private sort: Sort = 'id';
  private order: Order = 'ASC';

  public get sortParams(): SortWinners {
    return { sort: this.sort, order: this.order };
  }

  public sortListener(
    event: Event,
    parent: Block<keyof HTMLElementTagNameMap>,
  ): void {
    const target = event.target;
    if (target instanceof HTMLTableCellElement) {
      switch (target.textContent) {
        case 'number':
          this.toggleOrder('id', target, parent);
          break;
        case 'wins':
          this.toggleOrder('wins', target, parent);
          break;
        case 'best time':
          this.toggleOrder('time', target, parent);
          break;
      }
    }
  }

  private createEvent(parent: Block<keyof HTMLElementTagNameMap>): void {
    const pageEvent = new CustomEvent('sort-changed', {
      detail: { sort: this.sort, order: this.order },
    });
    parent.getNode().dispatchEvent(pageEvent);
  }

  private toggleOrder(
    key: keyof Winner,
    element: HTMLTableCellElement,
    parent: Block<keyof HTMLElementTagNameMap>,
  ): void {
    if (parent instanceof Table) {
      parent.resetClasses();
      parent.clearRows();
    }
    this.sort = key;
    if (this.order === 'ASC') {
      this.order = 'DESC';
      element.className = 'desc';
    } else {
      this.order = 'ASC';
      element.className = 'asc';
    }

    this.createEvent(parent);
  }
}

export const sortTable = new SortTable();
