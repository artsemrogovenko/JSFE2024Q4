import Controller from '../../api/controller';
import Block, { Container } from '../../modules/block';
import { Limits, PageMode } from '../../modules/types';
import type Pages from '../pages-logic';
import { pagesLogic } from '../pages-logic';
import { isWinner, isWinnersResponse } from './functions';

export default class WinnersView extends Block<'main'> {
  private pageLogic: Pages = pagesLogic;
  private table = new Container('table-container');
  constructor() {
    super('main', 'winners');
    this.addBlocks([this.pageLogic.headlines(PageMode.winners), this.table]);
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
        this.pageLogic.updateTitles(total);
      }
    }
  }
}
