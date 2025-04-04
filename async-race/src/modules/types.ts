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
  body: Car[] | undefined;
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
export type WinnersResponse = {
  code: number;
  count: string | null;
  body: Winner[] | undefined;
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

export type CarInfo = {
  id: number;
  info: string;
};
export enum RaceState {
  RACING,
  READY,
  FINISH,
}
export type SprintResult = CarInfo & { seconds: number };
//#endregion Garage

export enum HttpСode {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  ManyRequests = 429,
  NotFound = 404,
  ServerError = 500,
}
//#region  PageLogic
export enum PageMode {
  garage = 'garage',
  winners = 'winners',
  not_found = '404',
}

export enum PageStep {
  'next',
  'prev',
}

export enum Limits {
  garage = 7,
  winners = 10,
}
//#endregion  PageLogic

//#region Winners
export type WinnersQuery = {
  _page: number;
  _limit: number;
  _sort?: Sort;
  _order?: Order;
};

export type Sort = 'id' | 'wins' | 'time';
export type Order = 'ASC' | 'DESC';
export type SortWinners = {
  sort: Sort;
  order: Order;
};
export type RowData = {
  id: string;
  color: string;
  name: string;
  wins: number;
  time: number;
};
//#endregion Winners
