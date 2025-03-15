import OptionsView from '../list/options-view';
import type Block from '../modules/block';
import PickerView from '../picker/picker-view';
import NotFound from './not-found';
declare global {
  interface Window {
    route: (event: Event) => void;
  }
}

export class Router {
  private setContent: Function;

  constructor(changer: Function) {
    this.setContent = changer;

    window.addEventListener('popstate', () => {
      this.handleLocation();
    });
    window.onpopstate = (event: PopStateEvent): void => this.route(event);
    window.route = this.route;
    this.handleLocation();
  }
  
  private static routes(path: string): Block<'main'> {
    switch (path) {
      case '/':
        return new OptionsView();
      case '/picker':
        return new PickerView();
      case '/options':
        return new OptionsView();
      default:
        break;
    }
    return new NotFound();
  }

  public route = (event: Event): void => {
    event.preventDefault();
    if (event.target instanceof HTMLElement) {
      const target = event.target;
      if (target && target instanceof HTMLAnchorElement) {
        window.history.pushState({}, '', target.href);
        this.handleLocation();
      }
    }
  };

  private handleLocation(): void {
    const path = window.location.pathname;
    const route = Router.routes(path);
    this.setContent(route);
  }
}
