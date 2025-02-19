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
}

export interface IResponseObject extends Partial<source> {
    status: string;
    sources: source[];
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

export interface IResponseArticle extends Partial<article> {
    status: string;
    totalResults: number;
    articles: article[];
}

export type NewsResponse = IResponseArticle | IResponseObject | void;
/**
 * https://newsapi.org/docs/endpoints/top-headlines
 */
export interface Headlines extends IRequestParameters {
    country: Country;
    category: Category;
    sources: string;
    q: string;
    pageSize: number;
    page: number;
}

/**
 * https://newsapi.org/docs/endpoints/everything
 */
export interface Everything extends IRequestParameters {
    q: string;
    searchIn: searchIn;
    sources: Country;
    domains: string;
    excludeDomains: string;
    from: Date;
    to: Date;
    language: Country;
    sortBy: sort;
    pageSize: number;
    page: number;
}

export function pageSize(size: number | undefined): number {
    if (size) {
        if (size > 100 || size <= 0) {
            throw new Error('Page size min 1 and max 100');
        }
    }
    return size ?? 100;
}

enum Category {
    business = 'business',
    entertainment = 'entertainment',
    general = 'general',
    health = 'health',
    science = 'science',
    sports = 'sports',
    technology = 'technology',
}

enum sort {
    relevancy = 'relevancy',
    popularity = 'popularity',
    publishedAt = 'publishedAt',
}
enum searchIn {
    title = 'title',
    description = 'description',
    content = 'content',
}

enum Country {
    ae = 'ae',
    ar = 'ar',
    at = 'at',
    au = 'au',
    be = 'be',
    bg = 'bg',
    br = 'br',
    ca = 'ca',
    ch = 'ch',
    cn = 'cn',
    co = 'co',
    cu = 'cu',
    cz = 'cz',
    de = 'de',
    eg = 'eg',
    fr = 'fr',
    gb = 'gb',
    gr = 'gr',
    hk = 'hk',
    hu = 'hu',
    id = 'id',
    ie = 'ie',
    il = 'il',
    in = 'in',
    it = 'it',
    jp = 'jp',
    kr = 'kr',
    lt = 'lt',
    lv = 'lv',
    ma = 'ma',
    mx = 'mx',
    my = 'my',
    ng = 'ng',
    nl = 'nl',
    no = 'no',
    nz = 'nz',
    ph = 'ph',
    pl = 'pl',
    pt = 'pt',
    ro = 'ro',
    rs = 'rs',
    ru = 'ru',
    sa = 'sa',
    se = 'se',
    sg = 'sg',
    si = 'si',
    sk = 'sk',
    th = 'th',
    tr = 'tr',
    tw = 'tw',
    ua = 'ua',
    us = 'us',
    ve = 've',
    za = 'za',
}
