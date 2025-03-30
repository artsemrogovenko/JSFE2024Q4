import type { Engine } from '../modules/types';
import {
  HttpСode,
  type Car,
  type CarParam,
  type ResponseData,
  type GetCars,
} from '../modules/types';
import {
  createCar,
  deleteCar,
  driveCarEngine,
  getCar,
  getCars,
  startStopEngine,
  updateCar,
} from './requests';

export default class Controller {
  public static async getCarsList(args?: GetCars): Promise<Car[] | null> {
    try {
      const result = await getCars(args);
      return result.code === HttpСode.OK ? result.body : null;
    } catch (error) {
      return null;
    }
  }

  public static async newCar(data: CarParam): Promise<ResponseData> {
    try {
      const result = await createCar(data);
      if (result.code === HttpСode.Created) {
        return result;
      }
    } catch (error) {}
    return { code: 0, body: {} };
  }

  public static async remove(id: number): Promise<boolean> {
    try {
      const result = await deleteCar(id);
      if (result.code === HttpСode.OK) {
        return true;
      }
    } catch (error) {}
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
    } catch (error) {}
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
    // try {
    const result = await driveCarEngine(id);
    return result;
    // } catch (error) {
    //   console.log(error);
    // }
    // return { code: 0, body: {} };
  }

  public static async getCarById(id: number): Promise<ResponseData> {
    try {
      const result = await getCar(id);
      if (result.code === HttpСode.OK) {
        return result;
      }
    } catch (error) {}
    return { code: 0, body: {} };
  }
}
