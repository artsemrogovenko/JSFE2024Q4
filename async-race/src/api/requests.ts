import type {
  GetCars,
  CarsResponse,
  ResponseData,
  CarParam,
  Engine,
  Winner,
} from '../modules/types';
import { Status } from '../modules/types';

const serverUrl = 'http://127.0.0.1:3000';
const path = {
  garage: '/garage',
  winners: '/winners',
};

export async function getCars(attributes?: GetCars): Promise<CarsResponse> {
  let url = `${serverUrl}${path.garage}`;
  if (attributes) {
    const params = new URLSearchParams();
    if (attributes._page) params.append('_page', attributes._page.toString());
    if (attributes._limit)
      params.append('_limit', attributes._limit.toString());
    url = `${url}/?${params.toString()}`;
  }

  const response = await fetch(url);

  const code = response.status;
  const count = response.headers.get('X-Total-Count');
  const body = await response.json();

  return { code: code, count: count, body: body };
}

export async function getCar(id: number): Promise<ResponseData> {
  const response = await fetch(`${serverUrl}${path.garage}/${id}`);
  const code = response.status;
  const body = await response.json();

  return { code: code, body: body };
}

export async function createCar(data: CarParam): Promise<ResponseData> {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  const param = JSON.stringify({
    name: `${data.name}`,
    color: `${data.color}`,
  });
  const response = await fetch(`${serverUrl}${path.garage}`, {
    method: 'POST',
    headers: headers,
    body: param,
  });
  const code = response.status;
  const body = await response.json();

  return { code: code, body: body };
}

export async function deleteCar(id: number): Promise<ResponseData> {
  const response = await fetch(`${serverUrl}${path.garage}/${id}`, {
    method: 'DELETE',
  });
  const code = response.status;
  const body = await response.json();

  return { code: code, body: body };
}

export async function updateCar(
  id: number,
  attributes: CarParam,
): Promise<ResponseData> {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  const params = JSON.stringify({
    name: attributes.name,
    color: attributes.color,
  });

  const response = await fetch(`${serverUrl}${path.garage}/${id}`, {
    method: 'PUT',
    headers: headers,
    body: params,
  });
  const code = response.status;
  const body = await response.json();

  return { code: code, body: body };
}

export async function startStopEngine(
  attributes: Engine,
): Promise<ResponseData> {
  const params = new URLSearchParams({
    id: `${attributes.id}`,
    status: `${attributes.status}`,
  });
  const response = await fetch(`${serverUrl}/engine?${params}`, {
    method: 'PATCH',
  });
  const code = response.status;
  const body = await response.json();

  return { code: code, body: body };
}

export async function driveCarEngine(id: number): Promise<ResponseData> {
  const params = new URLSearchParams({
    id: `${id}`,
    status: `${Status.drive}`,
  });
  let response;
  response = await fetch(`${serverUrl}/engine?${params}`, {
    method: 'PATCH',
  });
  try {
    if (!response.ok) {
      throw new Error();
    }
    const code = response.status;
    const body = await response.json();
    return { code: code, body: body };
  } catch (error) {
    const message = await response.text();
    return {
      code: response.status,
      body: { message: message },
    };
  }
}

export async function getWinners(): Promise<ResponseData> {
  const response = await fetch(`${serverUrl}/winners`);
  const code = response.status;
  const body = await response.json();

  return { code: code, body: body };
}

export async function getWinner(id: number): Promise<ResponseData> {
  const response = await fetch(`${serverUrl}${path.winners}/${id}`);
  const code = response.status;
  const body = await response.json();

  return { code: code, body: body };
}

export async function createWinner(data: Winner): Promise<ResponseData> {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const params = JSON.stringify({
    id: `${data.id}`,
    wins: `${data.wins}`,
    time: `${data.time}`,
  });
  const response = await fetch(`${serverUrl}${path.winners}`, {
    method: 'POST',
    headers: headers,
    body: params,
  });
  const code = response.status;
  const body = await response.json();

  return { code: code, body: body };
}

export async function deleteWinner(id: number): Promise<ResponseData> {
  const response = await fetch(`${serverUrl}${path.winners}/${id}`, {
    method: 'DELETE',
  });
  const code = response.status;
  const body = await response.json();

  return { code: code, body: body };
}

export async function updateWinner(
  id: number,
  data: Winner,
): Promise<ResponseData> {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  const params = JSON.stringify({
    wins: `${data.wins}`,
    time: `${data.time}`,
  });

  const response = await fetch(`${serverUrl}${path.winners}/${id}`, {
    method: 'PUT',
    headers: headers,
    body: params,
  });
  const code = response.status;
  const body = await response.json();

  return { code: code, body: body };
}
