import Block from '../modules/block';
import { Button } from '../modules/buttons';
import { pushState } from './router';

export default class NotFound extends Block<'main'> {
  private button: Button;

  constructor() {
    super('main', 'not-found-404');
    const heading = document.createElement('h3');
    window.history.replaceState({}, '', window.location.href);
    heading.textContent = '404';
    this.button = new Button(
      'ui-Btn not-found',
      'Page Not Found,Go to homepage',
    );
    this.getNode().appendChild(heading);
    this.addBlock(this.button);
    this.button.addListener('click', () => {
      window.history.replaceState({}, '', '/options');
      pushState('/options');
    });
  }
}
