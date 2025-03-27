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
  update: FormType;
};
export type FormType = {
  name: string;
  color: string;
};
export enum FormAction {
  CREATE,
  UPDATE,
}

//#endregion Garage
