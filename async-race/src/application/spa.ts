import type Block from '../modules/block';
import { Router } from './router';
import State from './state';

export default class App {
  private body: HTMLElement;
  private main: Block<'main'> | null;
  constructor() {
    this.body = document.body;
    this.main = null;
    const state = new State();
    new Router(this.setContent.bind(this), state);
  }

  private setContent(view: Block<'main'>): void {
    if (this.body && this.main) {
      this.main.destroy();
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
