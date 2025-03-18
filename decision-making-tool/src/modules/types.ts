export type DataList = {
  list: OptionData[];
  last: number;
};

export type OptionData = {
  id: string;
  title: string;
  weight: string;
};
export interface ImportMetaEnv {
  readonly VITE_BASE: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}
