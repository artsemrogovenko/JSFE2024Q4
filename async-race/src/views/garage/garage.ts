import type State from '../../application/state';
import Block, { Container } from '../../modules/block';
import { ButtonsCreator } from '../../modules/buttons';

export default class GarageView extends Block<'main'> {
  private state: State;
  constructor(state: State) {
    super('main', 'garage');
    this.state = state;
  }
}

class Participant extends Container {
  constructor() {
    super('participant');
    const buttons = ['edit-car', 'remove-car', 'engine', 'drive-state'];
    const [edit, remove, engine, state] = ButtonsCreator.createButtons(
      buttons.length,
      buttons,
    );
    this.addBlocks([edit, remove, engine, state]);
  }
}
