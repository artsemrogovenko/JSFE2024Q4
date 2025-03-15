import Block from '../modules/block';
import { Container } from '../modules/block';
import { ButtonsCreator } from '../modules/buttons';
import { Input, Label } from '../modules/form';
import type { OptionData } from '../modules/types';
import { Wheel } from './canvas';

export default class PickerView extends Block<'main'> {
  private canvas = new Wheel('canvas-wheel');
  private panel = new Container('panel');
  constructor() {
    super('main', 'pickerScreen');
    this.addBlock(this.panel);
    this.getNode().appendChild(this.canvas.getNode());
    this.init();
    this.canvas.draw(testData);
  }

  public draw(data: OptionData[]): void {
    this.canvas.draw(data);
  }

  private init(): void {
    const [back, sound, spin] = ButtonsCreator.createButtons(
      3,
      ['', '', 'Start'],
      ['back', 'sound', 'spin'],
    );
    back.addListener('click', () => {});
    sound.addListener('click', () => {});
    spin.addListener('click', () => {});

    const label = new Label('clock', 'duration');
    const input = new Input('duration', 'number', '5', '', 'sec', 'duration');

    input.getNode().setAttribute('min', '5');
    input.getNode().setAttribute('min', '5');
    input.getNode().setAttribute('required', 'true');

    const infoArea = new Container('info-area');
    infoArea.setText('Press button to start');
    this.panel.addBlocks([back, sound, label, input, spin, infoArea]);
  }
}
const testData = [
  {
    id: '#1',
    title: 'abc',
    weight: '1',
  },
  {
    id: '#2',
    title: 'qwe',
    weight: '3',
  },
  {
    id: '#3',
    title: 'rty',
    weight: '2',
  },
];
