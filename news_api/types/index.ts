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
    id?: string;
    name?: string;
    description?: string;
    url?: string;
    category?: string;
    language?: string;
    country?: string;
}

export type article = {
    source: { id: string; name: string };
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
};

export interface IResponseArticle {
    status: string;
    totalResults: number;
    articles: article[];
    source?: { id: string; name: string };
    author?: string;
    title?: string;
    description?: string;
    url?: string;
    urlToImage?: string;
    publishedAt?: string;
    content?: string;
}
