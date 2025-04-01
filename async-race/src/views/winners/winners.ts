import Controller from '../../api/controller';
import { Limits, PageMode } from '../../modules/types';
import type Pages from '../pages-logic';
import { pagesLogic } from '../pages-logic';
import { View } from '../view';
import {
  isRowData,
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
  }

  private async initTable(wishPage?: number): Promise<void> {
    const limit = Limits.winners;
    const page = wishPage ?? this.pageLogic.getPage;
    const param = { _page: page, _limit: limit };
    const winners = await Controller.winnersList(param);
    if (isWinnersResponse(winners) && Array.isArray(winners.body)) {
      if (
        winners.body.every((data) => isWinner(data)) &&
        typeof winners.count !== 'undefined'
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
}
