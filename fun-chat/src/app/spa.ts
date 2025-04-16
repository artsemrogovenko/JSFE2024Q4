import type Block from '../modules/block';
import { Router } from './router';

export default class App {
  private body: HTMLElement;
  private main: Block<'main'> | null;
  constructor() {
    this.body = document.body;
    this.main = null;
    new Router(this.setContent.bind(this));
  }

  private setContent(view: Block<'main'>): void {
    if (this.body) {
      if (view !== undefined) {
        if (this.main !== null) this.main.destroy();
        this.main = view;
        try {
          this.body.replaceChild(view.getNode(), this.main.getNode());
        } catch (error) {
          this.body.append(this.main.getNode());
        }
      }
    }
  }
}
