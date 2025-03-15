import OptionsView from '../list/options-view';
import type Block from '../modules/block';
import { Router } from './router';

export default class App {
  private body: HTMLElement;
  private main: Block<'main'>;
  private router: Router;
  constructor() {
    this.body = document.body;
    this.main = new OptionsView();
    this.router = new Router(this.setContent.bind(this));
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
