import Controller from '../../api/controller';
import type Block from '../../modules/block';
import type { EngineResponse, Car, CarInfo } from '../../modules/types';
import { carFormatter } from './dialog';
import { Participant } from './participant';

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
