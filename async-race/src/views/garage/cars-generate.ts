import Controller from '../../api/controller';
import {
  HttpСode,
  type CarParam,
  type ResponseData,
} from '../../modules/types';
import { isResponseData } from './functions';
import { carBrands } from '../car-data';

function randomNumber(v: number): number {
  return Math.floor(Math.random() * v);
}

function generateRGB(): number[] {
  const values: number[] = [];
  const size = 3;
  const MAX_VALUE = 255;
  while (values.length !== size) {
    let value = randomNumber(MAX_VALUE);
    if (!values.includes(value)) {
      values.push(value);
    }
  }
  return values;
}

function colorToHex(color: number): string {
  const characters = 2;
  const system = 16;
  return color.toString(system).padStart(characters, '0');
}

function rgbToHex(array: number[]): string {
  return (
    '#' + array.reduce((result, color) => (result += colorToHex(color)), '')
  );
}

const carBrandsNames = Object.keys(carBrands);
const NamesLength = carBrandsNames.length;

function randomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

function randomModel(name: string): string {
  const models = carBrands[name];
  const index = randomIndex(models.length);
  return models[index];
}

export function randomCarData(): CarParam {
  const nameIndex = randomIndex(NamesLength);
  const name = carBrandsNames[nameIndex];
  const model = randomModel(name);
  const randomColor = rgbToHex(generateRGB());
  return { name: `${name} ${model}`, color: randomColor };
}

export async function addHundredCars(): Promise<ResponseData[]> {
  const count = 100;
  const responces: ResponseData[] = [];
  for (let index = 0; index < count; index++) {
    try {
      const param = randomCarData();

      const request = await Controller.newCar(param)
        .then((data) => {
          if (isResponseData(data))
            if (data.code === HttpСode.Created) {
              return data;
            }
          throw data;
        })
        .catch((error) => {
          throw error;
        });
      responces.push(request);
    } catch (error) {
      break;
    }
  }

  return Promise.all(responces);
}
