import Controller from '../../api/controller';
import type { WinnersQuery } from '../../modules/types';
import { Limits, PageMode } from '../../modules/types';
import { pagesLogic } from '../pages-logic';
import { View } from '../view';
import {
  isRowData,
  isSortWinners,
  isWinner,
  isWinnersResponse,
  prepareData,
} from './functions';
import Table from '../../modules/table';
import { sortTable } from './sort';

export default class WinnersView extends View {
  private table = new Table('winners-table');
  constructor() {
    super('winners');
    const headlines = this.headlines(PageMode.winners);
    this.addBlocks([headlines, this.table]);
    this.initTable();
    this.table.addListener('sort-changed', (event) => this.beginSort(event));
    this.addListener('page-changed', () => {
      this.table.clearRows();
      this.initTable();
    });
  }

  private async initTable(sortParam?: WinnersQuery): Promise<void> {
    const limit = Limits.winners;
    const page = pagesLogic.getPage;
    let param: WinnersQuery;
    if (sortParam === undefined) {
      const sotData = sortTable.sortParams;
      this.table.setHeaderClass(sotData);
      const { sort, order } = sotData;
      param = { _page: page, _limit: limit, _sort: sort, _order: order };
    } else {
      param = sortParam;
    }
    const winners = await Controller.winnersList(param);
    if (isWinnersResponse(winners) && Array.isArray(winners.body)) {
      if (
        winners.body.every((data) => isWinner(data)) &&
        winners.count !== null
      ) {
        const total = parseInt(winners.count);
        this.updateTitles(total);
        winners.body.forEach(async (winner) => {
          const data = await prepareData(winner);
          if (typeof data !== 'undefined' && isRowData(data)) {
            this.table.addRow(data);
          }
        });
      }
    }
  }

  private beginSort(event: Event): void {
    if (event instanceof CustomEvent) {
      const result = event.detail;
      if (isSortWinners(result)) {
        const limit = Limits.winners;
        const page = pagesLogic.getPage;
        const query: WinnersQuery = {
          _page: page,
          _limit: limit,
          _sort: result.sort,
          _order: result.order,
        };
        this.initTable(query);
      }
    }
  }
}
