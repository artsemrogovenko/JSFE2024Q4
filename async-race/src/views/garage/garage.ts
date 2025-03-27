import type State from '../../application/state';
import Block, { Container } from '../../modules/block';
import { Button, ButtonsCreator } from '../../modules/buttons';
import { Input } from '../../modules/form';

type FormsData = {
  create: FormType;
  update: FormType;
};
type FormType = {
  name: string;
  color: string;
};
enum FormAction {
  CREATE,
  UPDATE,
}
export default class GarageView extends Block<'main'> {
  private create: Form;
  private update: Form;
  private topContainer = new Container('top-container');
  private raceContainer = new Container('race-container');
  private state: State;
  private formsData: FormsData = {
    create: { name: '', color: '' },
    update: { name: '', color: '' },
  };
  constructor(state: State) {
    super('main', 'garage');
    this.state = state;
    this.create = new Form('form-create', 'create');
    this.update = new Form('form-edit', 'update');
    this.create.addListener('change', () =>
      this.changeValues(this.create, FormAction.CREATE),
    );

    this.update.addListener('change', () =>
      this.changeValues(this.update, FormAction.UPDATE),
    );
    this.topContainer.addBlocks([this.create, this.update]);
    this.addBlocks([this.topContainer, this.raceContainer]);
    this.init();
  }
  private init(): void {
    const createCar = this.create.getButton;
    const updateCar = this.update.getButton;
    this.topContainer.addBlock(new Participant());
    this.topContainer.addBlock(new Participant());
  }

  private changeValues(form: Form, action: FormAction): void {
    if ((action = FormAction.CREATE)) {
      const formData = form.params;
      this.formsData.create = formData;
    } else {
      const formData = form.params;
      this.formsData.update = formData;
    }
  }
}

class Form extends Container {
  private nameInput: Input;
  private colorInput: Input;
  private button: Button;
  private values = { name: '', color: '' };
  constructor(className: string, submitClass: string) {
    super(className);
    this.nameInput = new Input('input-name', 'text', '', '', 'Car name', '');
    this.colorInput = new Input('pick-color', 'color', 'color', '', '');
    this.button = new Button(submitClass, submitClass);
    this.addBlocks([this.nameInput, this.colorInput, this.button]);
    // this.button.addListener('click', this.changeValues.bind(this));
    this.colorInput.addListener('change', this.changeValues.bind(this));
    this.nameInput.addListener('change', this.changeValues.bind(this));
  }

  public get getButton(): Button {
    return this.button;
  }

  public get params(): FormType {
    return this.values;
  }
  private changeValues(): void {
    if (this.colorInput.getNode() instanceof HTMLInputElement) {
      this.values.color = this.colorInput.getValue();
    }
    if (this.nameInput.getNode() instanceof HTMLInputElement) {
      this.values.name = this.nameInput.getValue();
    }
  }
}

class Participant extends Container {
  constructor() {
    super('participant');
    const buttons = ['edit-car', 'remove-car', 'engine', 'drive-state'];
    const buttonsText = ['edit', 'remove', 'start/stop', 'D'];
    const [edit, remove, engine, state] = ButtonsCreator.createButtons(
      buttons.length,
      buttonsText,
      buttons,
    );
    this.addBlocks([edit, remove, engine, state]);
  }
}
