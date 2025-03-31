import type { Winner, WinnersResponse } from '../../modules/types';

export function isWinnersResponse(data: object): data is WinnersResponse {
  const obj = Object.assign({}, data);
  return obj.hasOwnProperty('code') && obj.hasOwnProperty('body');
}

export function isWinner(data: object): data is Winner {
  const obj = Object.assign({}, data);
  return (
    obj.hasOwnProperty('id') &&
    obj.hasOwnProperty('wins') &&
    obj.hasOwnProperty('time')
  );
}
