import OptionsView from '../list/options-view';
import type Block from '../modules/block';
import { Router } from './router';
import State from './state';

export default class App {
  private body: HTMLElement;
  private main: Block<'main'>;
  private router: Router;
  constructor() {
    this.body = document.body;
    const state = new State();
    this.main = new OptionsView(state);
    this.router = new Router(this.setContent.bind(this), state);
  }

  private setContent(view: Block<'main'>): void {
    if (this.body && this.main) {
      this.main = view;
      try {
        this.body.replaceChild(view.getNode(), this.main.getNode());
      } catch (error) {
        this.body.replaceChildren();
        this.body.append(this.main.getNode());
      }
    }
  }
}
