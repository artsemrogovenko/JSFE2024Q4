import type {
  CarsResponse,
  Engine,
  Winner,
  WinnersQuery,
  WinnersResponse,
} from '../modules/types';
import {
  HttpСode,
  type CarParam,
  type ResponseData,
  type GetCars,
} from '../modules/types';
import { showInfo } from '../views/garage/dialog';
import {
  createCar,
  createWinner,
  deleteCar,
  deleteWinner,
  driveCarEngine,
  getCar,
  getCars,
  getWinner,
  getWinners,
  startStopEngine,
  updateCar,
  updateWinner,
} from './requests';

export default class Controller {
  public static async getCarsList(args?: GetCars): Promise<CarsResponse> {
    try {
      const result = await getCars(args);
      return result;
    } catch (error) {
      showInfo('Потеряна связь с сервером');
      // throw error;
    }
    return { code: 0, count: '0', body: undefined };
  }

  public static async newCar(data: CarParam): Promise<ResponseData> {
    let result: ResponseData = { code: 0, body: {} };
    try {
      result = await createCar(data);
      if (result.code === HttpСode.Created) {
      } else {
        throw new Error('');
      }
    } catch (error) {
      showInfo('Потеряна связь с сервером');
    } finally {
      return result;
    }
  }

  public static async remove(id: number): Promise<boolean> {
    try {
      const result = await deleteCar(id);
      if (result.code === HttpСode.OK) {
        try {
          const response = await deleteWinner(id);
          if (response.code === HttpСode.OK) {
            return true;
          } else {
            throw response;
          }
        } catch (error) {
          throw error;
        }
      }
    } catch (error) {
      showInfo('Потеряна связь с сервером');
    }
    return false;
  }

  public static async update(
    id: number,
    data: CarParam,
  ): Promise<ResponseData> {
    try {
      const result = await updateCar(id, data);
      if (result.code === HttpСode.OK) {
        return result;
      }
    } catch (error) {
      showInfo('Потеряна связь с сервером');
    }
    return { code: 0, body: {} };
  }

  public static async ignition(engine: Engine): Promise<ResponseData> {
    try {
      const result = await startStopEngine(engine);
      if (result.code === HttpСode.OK) {
        return result;
      }
    } catch (error) {
      console.log(error);
    }
    return { code: 0, body: {} };
  }

  public static async drive(id: number): Promise<ResponseData> {
    try {
      const result = await driveCarEngine(id);
      return result;
    } catch (error) {
      showInfo('Потеряна связь с сервером');
      console.log(error);
    }
    return { code: 0, body: {} };
  }

  public static async getCarById(id: number): Promise<ResponseData> {
    try {
      const result = await getCar(id);
      if (result.code === HttpСode.OK) {
        return result;
      }
    } catch (error) {
      showInfo('Потеряна связь с сервером');
    }
    return { code: 0, body: {} };
  }

  public static async winnersList(
    args: WinnersQuery,
  ): Promise<WinnersResponse> {
    try {
      const result = await getWinners(args);
      return result;
    } catch (error) {
      showInfo('Потеряна связь с сервером');
    }
    return { code: 0, count: '0', body: undefined };
  }

  public static async winnerResult(id: number): Promise<ResponseData> {
    try {
      const result = await getWinner(id);
      return result;
    } catch (error) {
      showInfo('Потеряна связь с сервером');
    }
    return { code: 0, body: {} };
  }

  public static async createWinner(winner: Winner): Promise<ResponseData> {
    try {
      const result = await createWinner(winner);
      return result;
    } catch (error) {
      showInfo('Потеряна связь с сервером');
    }
    return { code: 0, body: {} };
  }

  public static async updateWinner(winner: Winner): Promise<ResponseData> {
    try {
      const result = await updateWinner(winner);
      return result;
    } catch (error) {
      showInfo('Потеряна связь с сервером');
    }
    return { code: 0, body: {} };
  }
}
