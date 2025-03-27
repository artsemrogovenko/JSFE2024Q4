import {
  HttpСode,
  type Car,
  type CarParam,
  type ResponseData,
} from '../modules/types';
import { createCar, getCars } from './requests';

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
}
