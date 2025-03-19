export type DataList = {
  list: OptionData[];
  last: number;
};

export type OptionData = {
  id: string;
  title: string;
  weight: string;
};

export enum ModeImportOptions {
  CSV = 'CSV',
  JSON = 'JSON',
}

export interface ImportMetaEnv {
  readonly VITE_BASE: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}
