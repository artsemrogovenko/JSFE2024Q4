import Controller from '../../api/controller';
import type Block from '../../modules/block';
import type {
  EngineResponse,
  Car,
  CarInfo,
  ResponseData,
  CarsResponse,
} from '../../modules/types';
import { addHundredCars } from './cars-generate';
import { carFormatter, showInfo } from './dialog';
import { Participant } from './participant';

export function isResponseData(data: object): data is ResponseData {
  const obj = Object.assign({}, data);
  return obj.hasOwnProperty('code') && obj.hasOwnProperty('body');
}
export function isEngineResponse(data: object): data is EngineResponse {
  const obj = Object.assign({}, data);
  return obj.hasOwnProperty('velocity') && obj.hasOwnProperty('distance');
}
export function isCar(data: object): data is Car {
  const obj = Object.assign({}, data);
  return (
    obj.hasOwnProperty('name') &&
    obj.hasOwnProperty('color') &&
    obj.hasOwnProperty('id')
  );
}

export function isCarsResponse(data: object): data is CarsResponse {
  const obj = Object.assign({}, data);
  return obj.hasOwnProperty('code') && obj.hasOwnProperty('body');
}

export async function raceHandler(
  participants: Block<keyof HTMLElementTagNameMap>[],
  action: string,
): Promise<void> {
  if (participants.every((element) => element instanceof Participant))
    switch (action) {
      case 'race':
        let promiseArray: Promise<CarInfo>[] = [];
        if (participants.every((element) => element instanceof Participant)) {
          participants.forEach((part) => promiseArray.push(part.racing));
          try {
            const result = await Promise.any(promiseArray);
            const winner = await Controller.getCarById(result.id);
            if (isCar(winner.body)) {
              carFormatter(winner.body);
            }
          } catch (error) {}
        }
        break;

      case 'reset':
        participants.forEach((part) => part.reset);
        break;

      default:
        break;
    }
}

export async function randomCarsHandler(): Promise<boolean> {
  const result = await addHundredCars();
  const required = 100;
  if (result.length < required) {
    showInfo('Потеряна связь с сервером');
    return false;
  }
  return true;
}
