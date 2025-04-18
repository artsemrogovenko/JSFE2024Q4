import { appLogic } from '..';
import type Block from '../modules/block';
import Login from '../views/login/login-view';
import Main from '../views/main/main-view';
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
    event.stopImmediatePropagation();
    if (event instanceof PopStateEvent) {
      const target = event.target;
      if (
        target &&
        'location' in target &&
        typeof target.location === 'object'
      ) {
        if (target.location && 'pathname' in target.location) {
          switch (target.location.pathname) {
            case `${base}main`:
            case `${base}login`:
              return;
          }
        }
      }
      return;
    }
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
function routes(path: string): Block<'main'> | undefined {
  switch (path) {
    case '':
    case 'login':
      if (Boolean(appLogic.isLogined)) {
        pushState('main');
        break;
      }
      return new Login();
    case 'main':
      if (!Boolean(appLogic.isLogined)) {
        pushState('login');
        break;
      }
      return new Main();
    case 'about':
    default:
      return new NotFound();
      break;
  }
}

export function pushState(path: string): void {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
