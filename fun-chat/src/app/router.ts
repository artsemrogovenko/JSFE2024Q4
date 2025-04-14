import type Block from '../modules/block';
import Login from '../views/login/login-view';
import NotFound from '../views/not-found';

export const base = '/artsemrogovenko-JSFE2024Q4/fun-chat/';
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
    const path = window.location.pathname.replace(`${base}`, '');
    const route = routes(path);
    this.setContent(route);
  }
}

function routes(path: string): Block<'main'> {
  switch (path) {
    case '':
    case 'login':
      return new Login();
    case 'main':
    case 'about':
    default:
      break;
  }
  return new NotFound();
}

export function pushState(path: string): void {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
