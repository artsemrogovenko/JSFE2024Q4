import type Block from '../modules/block';
import { pagesLogic } from '../views/pages-logic';
import { Router } from './router';
import { appState } from './state';

export default class App {
  private body: HTMLElement;
  private main: Block<'main'> | null;
  private viewSwitch = pagesLogic.selectorView.getNode();
  private selectPages = pagesLogic.selectPages.getNode();
  constructor() {
    this.body = document.body;
    this.main = null;
    const state = appState;
    this.body.append(this.viewSwitch, this.selectPages);
    new Router(this.setContent.bind(this), state);
  }

  private setContent(view: Block<'main'>): void {
    if (this.body) {
      if (this.main !== null) this.main.destroy();
      this.main = view;
      try {
        this.body.replaceChild(view.getNode(), this.main.getNode());
      } catch (error) {
        this.viewSwitch.insertAdjacentElement('afterend', this.main.getNode());
      }
    }
  }
}
