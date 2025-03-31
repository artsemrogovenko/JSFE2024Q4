import Controller from '../../api/controller';
import { Container } from '../../modules/block';
import { Limits, PageMode } from '../../modules/types';
import type Pages from '../pages-logic';
import { pagesLogic } from '../pages-logic';
import { View } from '../view';
import { isWinner, isWinnersResponse } from './functions';

export default class WinnersView extends View {
  private pageLogic: Pages = pagesLogic;
  private table = new Container('table-container');
  constructor() {
    super('winners');
    const block = this.headlines(PageMode.winners);
    this.addBlock(block);
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
      }
    }
  }
}
