import { pushState } from '../../app/router';
import { Container } from '../../modules/block';
import { Button } from '../../modules/buttons';
import { Paragraph } from '../../modules/form';
import View from '../view';

export default class About extends View {
  private container = new Container('about-container');
  private text = new Paragraph('about');
  private back = new Button('back', 'Вернуться Назад');
  constructor() {
    super('about-view');
    this.container.addBlocks([this.text, this.back]);
    this.addBlock(this.container);
    this.init();
    this.back.addListener('click', () => pushState('main'));
  }

  private init(): void {
    this.text
      .setText(`Lorem Ipsum...\nПриложение стучиться по адресу ws://localhost:4000.\n
    Это было очень сложное задание. Потратил очень много времени,\nза найденые баги прошу понять и простить ¯\\_(ツ)_/¯`);
  }
}
