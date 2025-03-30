import Controller from '../../api/controller';
import type Block from '../../modules/block';
import type {
  EngineResponse,
  Car,
  CarInfo,
  ResponseData,
} from '../../modules/types';
import { addHundredCars } from './cars-generate';
import { carFormatter, showInfo } from './dialog';
import { Participant } from './participant';

export function isResponseData(data: object): data is ResponseData {
  const obj = Object.assign({}, data);
  return obj.hasOwnProperty('code') && obj.hasOwnProperty('body');
}
export function isEngineResponse(obj: object): obj is EngineResponse {
  return obj.hasOwnProperty('velocity') && obj.hasOwnProperty('distance');
}
export function isCarResponse(obj: object): obj is Car {
  return (
    obj.hasOwnProperty('name') &&
    obj.hasOwnProperty('color') &&
    obj.hasOwnProperty('id')
  );
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
            if (isCarResponse(winner.body)) {
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
