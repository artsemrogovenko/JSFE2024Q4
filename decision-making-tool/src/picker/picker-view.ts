import Block from '../modules/block';
import { Container } from '../modules/block';
import { Wheel } from './canvas';

export default class PickerView extends Block<'main'> {
  private canvas = new Wheel('canvas-wheel');
  private panel = new Container('panel');
  constructor() {
    super('main', 'pickerScreen');
    this.addBlock(this.panel);
    this.getNode().appendChild(this.canvas.getNode());
    this.canvas.draw([
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
    ]);
  }
}
