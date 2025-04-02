import Controller from '../../api/controller';
import type {
  RowData,
  SortWinners,
  Winner,
  WinnersResponse,
} from '../../modules/types';
import { isResponseData, isCar } from '../garage/functions';

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
export function isRowData(data: object): data is RowData {
  const obj = Object.assign({}, data);
  return (
    obj.hasOwnProperty('id') &&
    obj.hasOwnProperty('color') &&
    obj.hasOwnProperty('name') &&
    obj.hasOwnProperty('wins') &&
    obj.hasOwnProperty('time')
  );
}

export function isSortWinners(data: object): data is SortWinners {
  const obj = Object.assign({}, data);
  return obj.hasOwnProperty('sort') && obj.hasOwnProperty('order');
}

export async function prepareData(data: Winner): Promise<RowData | undefined> {
  const rowData = await Controller.getCarById(data.id);
  if (isResponseData(rowData) && isCar(rowData.body)) {
    return {
      id: `${data.id}`,
      color: rowData.body.color,
      name: rowData.body.name,
      wins: data.wins,
      time: data.time,
    };
  }
}
