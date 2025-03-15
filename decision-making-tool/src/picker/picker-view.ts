import Block from '../modules/block';
import { Container } from '../modules/block';
import { Button } from '../modules/buttons';
import { ButtonsCreator } from '../modules/buttons';
import { Input, Label } from '../modules/form';
import type { OptionData } from '../modules/types';
import { Wheel } from './canvas';

export default class PickerView extends Block<'main'> {
  private canvas: Wheel;
  private panel: Container;
  private infoArea: Container;

  private back: Button = new Button();
  private sound: Button = new Button();
  private spin: Button = new Button();
  constructor() {
    super('main', 'pickerScreen');
    this.canvas = new Wheel('canvas-wheel', this);
    this.panel = new Container('panel');
    this.infoArea = new Container('info-area');
    this.addBlock(this.panel);
    this.getNode().appendChild(this.canvas.getNode());
    this.init();
    this.canvas.prepare(testData);
    this.canvas.draw();
  }

  public draw(data: OptionData[]): void {
    this.canvas.prepare(data);
  }
  public showInfo(msg: string): void {
    this.infoArea.setText(msg);
  }

  private init(): void {
    const label = new Label('clock', 'duration');
    const input = new Input('duration', 'number', '5', '', 'sec', 'duration');

    input.getNode().setAttribute('min', '5');
    input.getNode().setAttribute('min', '5');
    input.getNode().setAttribute('required', 'true');
    const buttons = ButtonsCreator.createButtons(
      3,
      ['', '', 'Start'],
      ['back', 'sound', 'spin'],
    );
    this.back = buttons[0];
    this.sound = buttons[1];
    this.spin = buttons[2];
    this.back.addListener('click', () => {});
    this.sound.addListener('click', () => {});
    this.spin.addListener('click', () => {
      const value = Number(input.getNode().ariaValueNow) || 0;
      this.canvas.spin(value);
    });

    this.infoArea.setText('Press button to start');
    this.panel.addBlocks([
      this.back,
      this.sound,
      label,
      input,
      this.spin,
      this.infoArea,
    ]);
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
