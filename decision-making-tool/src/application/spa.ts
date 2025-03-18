import OptionsView from '../list/options-view';
import type Block from '../modules/block';
import { closeDialog } from '../modules/list-utils';
import { Router } from './router';
import State from './state';

export default class App {
  private body: HTMLElement;
  private main: Block<'main'>;
  // private router: Router;
  constructor() {
    this.body = document.body;
    const state = new State();
    this.main = new OptionsView(state);
    new Router(this.setContent.bind(this), state);
    if (this.main instanceof OptionsView) {
      const list = this.main.getUtils();
      document.addEventListener('keyup', (e) => closeDialog(e, list));
    }
  }

  private setContent(view: Block<'main'>): void {
    if (this.body && this.main) {
      this.main = view;
      try {
        this.body.replaceChild(view.getNode(), this.main.getNode());
      } catch (error) {
        this.body.replaceChildren();

        const title = document.createElement('h1');
        title.textContent = 'Decision Making Tool';
        const node = view.getNode();

        node.prepend(title);
        this.body.append(this.main.getNode());
      }
    }
  }
}
