import type Block from '../modules/block';
import NotFound from '../views/not-found';

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
    const path = window.location.pathname;
    const route = routes(path);
    this.setContent(route);
  }
}

function routes(path: string): Block<'main'> {
  switch (path) {
    case '':
    case '/login':
    case '/main':
    case '/about':
    default:
      break;
  }
  return new NotFound();
}

export function pushState(path: string): void {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
