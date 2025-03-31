import Block from '../modules/block';
import { pagesLogic } from './pages-logic';
export default class NotFound extends Block<'main'> {
  constructor() {
    super('main', 'not-found-404');
    const heading = document.createElement('h3');
    window.history.replaceState({}, '', window.location.href);
    heading.textContent = '404\nPage Not Found';
    heading.style.color = '#ABCDEF';
    this.getNode().appendChild(heading);
    pagesLogic.setNotFound();
  }
}
