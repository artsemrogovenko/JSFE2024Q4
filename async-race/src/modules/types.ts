//#region Requests

export type CarParam = {
  name: string;
  color: string;
};
export type Car = CarParam & { id: number };

export type GetCars = {
  _page: number;
  _limit?: number;
};
export type CarsResponse = {
  code: number;
  count: string | null;
  body: Car[];
};

export type Engine = {
  id: number;
  status: Status;
};
export enum Status {
  started = 'started',
  drive = 'drive',
  stopped = 'stopped',
}
export type Winner = {
  id: number;
  wins: number;
  time: number;
};
export type ResponseData = {
  code: number;
  body: object;
};

//#endregion Requests

//#region Garage

export type FormsData = {
  create: FormType;
  update: Car;
};
export type FormType = {
  name: string;
  color: string;
};
export enum FormAction {
  CREATE,
  UPDATE,
}

export type EngineResponse = {
  velocity: number;
  distance: number;
};
//#endregion Garage

export enum HttpСode {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  ManyRequests = 429,
  NotFound = 404,
  ServerError = 500,
}
