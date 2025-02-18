export type source = {
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    language: string;
    country: string;
};

export interface IRequestParameters {
    apiKey: Required<string>;
    category?: string;
    language?: string;
    country?: string;
}
export interface IResponseObject {
    status: string;
    sources: source[];
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    language: string;
    country: string;
}
