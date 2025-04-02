import Controller from '../../api/controller';
import type { WinnersQuery } from '../../modules/types';
import { Limits, PageMode } from '../../modules/types';
import type Pages from '../pages-logic';
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

export default class WinnersView extends View {
  private pageLogic: Pages = pagesLogic;
  private table = new Table('winners-table');
  constructor() {
    super('winners');
    const headlines = this.headlines(PageMode.winners);
    this.addBlocks([headlines, this.table]);
    this.initTable();
    this.table.addListener('sort-changed', (event) => this.sortTable(event));
    this.addListener('page-changed', (event) => {
      this.table.clearRows();
      this.initTable();
    });
  }

  private async initTable(sortParam?: WinnersQuery): Promise<void> {
    const limit = Limits.winners;
    const page = this.pageLogic.getPage;
    const param = sortParam || { _page: page, _limit: limit };
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

  private sortTable(event: Event): void {
    if (event instanceof CustomEvent) {
      const result = event.detail;
      if (isSortWinners(result)) {
        const limit = Limits.winners;
        const page = this.pageLogic.getPage;
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
