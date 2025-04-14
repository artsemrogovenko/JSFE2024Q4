import View from './vew';
export default class NotFound extends View {
  constructor() {
    super('not-found-404');
    const heading = document.createElement('h3');
    window.history.replaceState({}, '', window.location.href);
    heading.textContent = '404\nPage Not Found';
    heading.style.color = '#ABCDEF';
    this.getNode().appendChild(heading);
  }
}
