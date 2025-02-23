import AppController from '../controller/controller';
import { AppView } from '../view/appView';
import { IResponseObject, IResponseArticle, IRequestParameters } from '../../types/index';

class App {
    private controller: AppController;
    private view: AppView;
    constructor(params: IRequestParameters) {
        this.controller = new AppController(params);
        this.view = new AppView();
    }

    public start(): void {
        const newsAgencies = document.querySelector('.sources') as Element;
        newsAgencies.addEventListener('click', (e) =>
            this.controller.getNews(e, (data: object) => this.view.drawNews(data as IResponseArticle))
        );
        this.controller.getSources((data: object) => this.view.drawSources(data as IResponseObject));
    }

    public updateNews(request: IRequestParameters): void {
        this.controller.applyFilter(request, (data: object) => this.view.drawNews(data as IResponseArticle));
    }
}

export default App;
