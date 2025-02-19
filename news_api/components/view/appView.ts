import News from './news/news';
import Sources from './sources/sources';
import { IResponseObject, source } from '../../types/index';
import { IResponseArticle, article } from '../../types/index';

export class AppView {
    private news: News;
    private sources: Sources;
    constructor() {
        this.news = new News();
        this.sources = new Sources();
    }

    public drawNews(data: IResponseArticle): void {
        const values: Array<article> = data?.articles ? data?.articles : [];
        this.news.draw(values);
    }

    public drawSources(data: IResponseObject): void {
        const values: Array<source> = data?.sources ? data?.sources : [];
        this.sources.draw(values);
    }
}

export default AppView;
