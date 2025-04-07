import Controller from '../../api/controller';
import { updateWinner } from '../../api/requests';
import type Block from '../../modules/block';
import type { Button } from '../../modules/buttons';
import {
  type Car,
  type CarParam,
  type CarsResponse,
  type EngineResponse,
  type ResponseData,
  type SprintResult,
} from '../../modules/types';
import { isWinner } from '../winners/functions';
import { addHundredCars } from './cars-generate';
import { carFormatter, showInfo } from './dialog';
import type { Participant } from './participant';

export function isResponseData(data: object | unknown): data is ResponseData {
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
export function isCarParam(data: object): data is CarParam {
  const obj = Object.assign({}, data);
  return obj.hasOwnProperty('name') && obj.hasOwnProperty('color');
}

export function isCarsResponse(data: object): data is CarsResponse {
  const obj = Object.assign({}, data);
  return obj.hasOwnProperty('code') && obj.hasOwnProperty('body');
}

export function isCarInfo(data: object | unknown): data is Car {
  const obj = Object.assign({}, data);
  return obj.hasOwnProperty('info') && obj.hasOwnProperty('id');
}

export async function raceHandler(
  participants: Participant[],
  action: string,
  toggler: Function,
): Promise<boolean | void> {
  switch (action) {
    case 'race':
      try {
        toggler();
        await calculateWinner(participants);
      } catch (error) {
        throw error;
      }
      break;
    case 'reset':
      let resetArray: Promise<Boolean>[] = [];
      participants.forEach((part) => resetArray.push(part.reset));
      toggler();
      const result = (await Promise.allSettled(resetArray)).every(
        (promise) => promise.status === 'fulfilled',
      );
      if (!result) {
        throw result;
      }
      break;
  }
  return true;
}

async function calculateWinner(participants: Participant[]): Promise<boolean> {
  let promiseArray: Promise<SprintResult>[] = [];
  participants.forEach((part) => promiseArray.push(startLogging(part)));
  try {
    const result = await Promise.any(promiseArray);
    const winner = await Controller.getCarById(result.id);
    if (isCar(winner.body)) {
      checkOldResult(result);
      carFormatter(winner.body, result.seconds, winner.body.color);
      participants.forEach((participant) => participant.raving(result.id));
    }
    return true;
  } catch (error) {
    if (error instanceof AggregateError) {
      if (isFetchError(error.errors)) {
        showInfo('Потеряна связь с сервером');
        return false;
      } else {
        showInfo('все машины сломались');
      }
    }
    throw false;
  }
}

async function startLogging(participant: Participant): Promise<SprintResult> {
  const startTime = Date.now();
  try {
    const result = await participant.racing;
    const milliseconds = 1000;
    const endTime = (Date.now() - startTime) / milliseconds;
    return { id: result.id, info: result.info, seconds: endTime };
  } catch (error) {
    throw error;
  }
}

function isFetchError(array: AggregateError[]): boolean {
  return array.some((error) => {
    return error instanceof TypeError;
  });
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

export function disableClick(
  element: Block<keyof HTMLElementTagNameMap>,
): void {
  element.getNode().classList.add('inactive');
  element.addListener('click', preventDefault, true);
  element.addListener('keydown', preventDefault, true);
}
export function enableClick(element: Block<keyof HTMLElementTagNameMap>): void {
  element.getNode().classList.remove('inactive');
  element.removeListener('click', preventDefault, true);
  element.removeListener('keydown', preventDefault, true);
}

function preventDefault(event: Event): void {
  event.preventDefault();
}

export async function getList(
  wishPage: number,
  limit: number,
): Promise<CarsResponse | undefined> {
  const cars = await Controller.getCarsList({ _page: wishPage, _limit: limit });
  if (isCarsResponse(cars) && cars.body) {
    return cars;
  }
  return;
}

export async function buttonLogic(
  button: Button,
  execute: Function,
): Promise<void> {
  disableClick(button);
  try {
    await execute();
  } catch (error) {
    if (isCarInfo(error)) {
      return;
    }
    if (error instanceof TypeError) {
      enableClick(button);
    }
  }
}
