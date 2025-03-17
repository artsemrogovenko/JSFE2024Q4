import type State from '../application/state';
import Block from '../modules/block';
import { Container } from '../modules/block';
import { Button } from '../modules/buttons';
import { ButtonsCreator } from '../modules/buttons';
import { Input, Label } from '../modules/form';
import { correctAmount } from '../modules/list-utils';
import type { DataList, OptionData } from '../modules/types';
import { Wheel } from './canvas';

export default class PickerView extends Block<'main'> {
  private canvas: Wheel;
  private panel: Container;
  private infoArea: Container;
  // private listUtil = new OptionsUtils(this);
  private back: Button = new Button();
  private sound: Button = new Button();
  private spin: Button = new Button();
  private state: State;
  private wheelIsSpinning: boolean;
  private input: Input;
  constructor(state: State) {
    super('main', 'pickerScreen');
    this.canvas = new Wheel('canvas-wheel', this);
    this.panel = new Container('panel');
    this.infoArea = new Container('info-area');
    this.addBlock(this.panel);
    this.addBlock(this.infoArea);
    this.getNode().appendChild(this.canvas.getNode());
    this.state = state;
    this.wheelIsSpinning = false;
    this.input = new Input('duration', 'number', '5', '', 'sec', 'duration');
    this.init();
  }

  public set wheelSpin(v: boolean) {
    this.wheelIsSpinning = v;
  }
  public drawWheel(data: OptionData[] | null): void {
    if (correctAmount(this.state)) {
      const dataList: DataList = JSON.parse(this.state.getValue('listData'));
      const options =
        data ||
        dataList.list.filter((option) => {
          return option.title !== '' && option.weight !== '';
        });
      this.infoArea.setText('Press button to start');
      this.canvas.prepare(options);
    } else {
      this.infoArea.setText(
        'List of Options are less than two valid options to display.\nGo back to the list of options and add data.',
      );
    }
  }
  public showInfo(msg: string): void {
    this.infoArea.setText(msg);
  }
  public congratulate(): void {
    this.panel.getNode().classList.remove('inactive');
    this.infoArea.getNode().classList.add('winner');
  }

  private init(): void {
    const label = new Label('clock', 'duration');
    this.input.addListener('change', (e) => this.checkWheelState(e, this));
    this.input.getNode().setAttribute('min', '5');
    this.input.getNode().setAttribute('max', '30');
    this.input.getNode().setAttribute('value', '5');
    this.input.getNode().setAttribute('required', 'true');
    const buttons = ButtonsCreator.createButtons(
      3,
      ['', '', 'Start'],
      ['back', 'sound', 'spin'],
    );
    this.back = buttons[0];
    this.sound = buttons[1];
    this.spin = buttons[2];
    this.back.addListener('click', (e) => this.checkWheelState(e, this));
    this.sound.addListener('click', () => {});
    this.spin.addListener('click', (e) => this.checkWheelState(e, this));

    this.panel.addBlocks([
      this.back,
      this.sound,
      label,
      this.input,
      this.spin,
      // this.infoArea,
    ]);
    this.panel.addListener('click', (e) => this.checkWheelState(e, this));
    this.drawWheel(null);
  }

  private checkWheelState(event: Event, context: PickerView): void {
    const target = event.target;
    if (context.wheelIsSpinning) {
      event.preventDefault();
    } else {
      if (target instanceof HTMLInputElement) {
        const normalized = normalizeInput(Number(target.value));
        target.value = `${normalized}`;
      }

      if (target instanceof HTMLButtonElement) {
        if (target.classList.value === 'back') {
          window.history.pushState({}, '', '/options');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
        if (target.classList.value === 'spin') {
          const element = context.input.getNode();
          if (
            element instanceof HTMLInputElement &&
            correctAmount(this.state)
          ) {
            const value = Number(element.value);
            context.infoArea.getNode().classList.remove('winner');
            context.panel.getNode().classList.add('inactive');
            this.canvas.spin(value);
          }
        }
      }
    }
  }
}

function normalizeInput(time: number): number {
  if (time > 30) {
    return 30;
  }
  if (time < 5) {
    return 5;
  }
  return time;
}
