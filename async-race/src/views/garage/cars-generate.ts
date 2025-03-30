import Controller from '../../api/controller';
import {
  HttpСode,
  type CarParam,
  type ResponseData,
} from '../../modules/types';
import { isResponseData } from './functions';

const carBrands = [
  'Audi',
  'BMW',
  'Mercedes-Benz',
  'Porsche',
  'Volkswagen',
  'Opel',
  'Maybach',
  'Ford',
  'Chevrolet',
  'Tesla',
  'Dodge',
  'Jeep',
  'Chrysler',
  'Cadillac',
  'Buick',
  'GMC',
  'Ram',
  'Lincoln',
  'Toyota',
  'Honda',
  'Nissan',
  'Mazda',
  'Subaru',
  'Mitsubishi',
  'Lexus',
  'Infiniti',
  'Acura',
  'Suzuki',
  'Isuzu',
  'Hyundai',
  'Kia',
  'Peugeot',
  'Renault',
  'Citroën',
  'Ferrari',
  'Lamborghini',
  'Maserati',
  'Alfa Romeo',
  'Fiat',
  'Lancia',
  'Pagani',
  'Land Rover',
  'Jaguar',
  'Bentley',
  'Rolls-Royce',
  'Aston Martin',
  'McLaren',
  'Mini',
  'Lotus',
  'Volvo',
  'Koenigsegg',
  'Saab',
  'Škoda',
  'Lada',
];

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

export function randomCarData(): CarParam {
  const nameIndex = Math.floor(Math.random() * carBrands.length);
  const name = carBrands[nameIndex];
  const randomColor = rgbToHex(generateRGB());
  return { name: name, color: randomColor };
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
