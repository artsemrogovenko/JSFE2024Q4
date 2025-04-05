import type Block from '../modules/block';
import GarageView from '../views/garage/garage';
import NotFound from '../views/not-found';
import WinnersView from '../views/winners/winners';
import type State from './state';

declare global {
  interface Window {
    route: (event: Event) => void;
  }
}

const base = import.meta.env.VITE_BASE;
export class Router {
  private setContent: Function;
  private state: State;
  constructor(changer: Function, state: State) {
    this.setContent = changer;
    this.state = state;
    window.addEventListener('popstate', () => {
      this.handleLocation();
    });
    window.onpopstate = (event: PopStateEvent): void => this.route(event);
    window.route = this.route;
    this.handleLocation();
  }

  private routes(path: string): Block<'main'> {
    switch (path) {
      case '':
      case '/garage':
        return new GarageView(this.state);
      case '/winners':
        return new WinnersView();
      default:
        break;
    }
    return new NotFound();
  }

  private route = (event: Event): void => {
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
    const path = window.location.pathname.replace(`${base}`, '');
    const route = this.routes(path);
    this.setContent(route);
  }
}
export function pushState(path: string): void {
  window.history.pushState({}, '', base + path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
