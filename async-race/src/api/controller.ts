import {
  HttpСode,
  type Car,
  type CarParam,
  type ResponseData,
} from '../modules/types';
import { createCar, deleteCar, getCars, updateCar } from './requests';

export class Controller {
  public static async getCarsList(): Promise<Car[] | null> {
    try {
      const result = await getCars();
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
}
