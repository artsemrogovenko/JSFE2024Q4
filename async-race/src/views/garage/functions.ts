import Controller from '../../api/controller';
import { updateWinner } from '../../api/requests';
import type { Button } from '../../modules/buttons';
import type {
  EngineResponse,
  Car,
  ResponseData,
  CarsResponse,
  SprintResult,
} from '../../modules/types';
import { isWinner } from '../winners/functions';
import { addHundredCars } from './cars-generate';
import { carFormatter, showInfo } from './dialog';
import type { Participant } from './participant';

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
  participants: Participant[],
  action: string,
): Promise<boolean> {
  switch (action) {
    case 'race':
      let promiseArray: Promise<SprintResult>[] = [];
      participants.forEach((part) => promiseArray.push(startLogging(part)));
      try {
        const result = await Promise.any(promiseArray);
        const winner = await Controller.getCarById(result.id);
        if (isCar(winner.body)) {
          checkOldResult(result);
          carFormatter(winner.body, result.seconds);
        }
      } catch (error) {
        if (error instanceof TypeError) {
          if (error.message.includes('net::')) {
            console.error(error.message);
          } else {
            showInfo('все машины сломались');
          }
        }
      }
      break;

    case 'reset':
      let resetArray: Promise<Boolean>[] = [];
      participants.forEach((part) => resetArray.push(part.reset));
      try {
        await Promise.allSettled(resetArray);
      } catch (error) {
        console.log(error);
      }
      break;

    default:
      break;
  }
  return true;
}

function startLogging(participant: Participant): Promise<SprintResult> {
  return Promise.resolve(
    (async (): Promise<SprintResult> => {
      const startTime = Date.now();
      const result = await participant.racing;
      const milliseconds = 1000;
      const endTime = (Date.now() - startTime) / milliseconds;
      return { id: result.id, info: result.info, seconds: endTime };
    })(),
  );
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

async function checkOldResult(sprintResult: SprintResult): Promise<void> {
  const response = await Controller.winnerResult(sprintResult.id);
  const result = response.body;
  const winnerObject = {
    id: sprintResult.id,
    time: sprintResult.seconds,
    wins: 1,
  };
  if (isWinner(result)) {
    winnerObject.time =
      winnerObject.time < result.time ? winnerObject.time : result.time;
    winnerObject.wins = Number(result.wins) + 1;
    updateWinner(winnerObject);
  } else {
    Controller.createWinner(winnerObject);
  }
}

export function disableClick(button: Button): void {
  button.getNode().classList.add('inactive');
  button.addListener('click', preventDefault);
}
export function enableClick(button: Button): void {
  button.getNode().classList.remove('inactive');
  button.removeListener('click', preventDefault);
}

function preventDefault(event: Event): void {
  event.preventDefault();
}
