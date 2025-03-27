import { Controller as ApiController } from '../../api/controller';
import type State from '../../application/state';
import Block, { Container } from '../../modules/block';
import { Button, ButtonsCreator } from '../../modules/buttons';
import { Input } from '../../modules/form';
import type { Car, CarParam, FormsData, FormType } from '../../modules/types';
import { FormAction } from '../../modules/types';

function isCar(obj: object): obj is Car {
  return (
    obj.hasOwnProperty('id') &&
    obj.hasOwnProperty('name') &&
    obj.hasOwnProperty('color')
  );
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
    this.create = new Form('form-create', 'create', this);
    this.update = new Form('form-edit', 'update', this);
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

  public async getForm(className: string, values: CarParam): Promise<void> {
    switch (className) {
      case 'form-edit':
        break;
      case 'form-create':
        const result = await ApiController.newCar(values);
        if (!Object.is({}, result.body) && isCar(result.body)) {
          const data = result.body;
          this.addParticipant(data);
        }
        break;
      default:
        break;
    }
  }

  private init(): void {
    this.initRace();
    const updateCar = this.update.getButton;
    // updateCar.addListener('click', () => );
  }

  private async initRace(): Promise<void> {
    const cars = await ApiController.getCarsList();
    if (cars instanceof Array) {
      cars.forEach((car) => {
        this.addParticipant(car);
      });
    }
  }

  private addParticipant(value: Car): void {
    const newCar = new Participant(this, value);
    this.raceContainer.addBlock(newCar);
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
  private values: CarParam = { name: '', color: '' };
  constructor(className: string, submitClass: string, view: GarageView) {
    super(className);
    this.nameInput = new Input('input-name', 'text', '', '', 'Car name', '');
    this.colorInput = new Input('pick-color', 'color', 'color', '', '');
    this.button = new Button(submitClass, submitClass);
    this.addBlocks([this.nameInput, this.colorInput, this.button]);
    this.button.addListener('click', () => this.submitForm(view));
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

  private submitForm(view: GarageView): void {
    const className = this.getNode().className;
    view.getForm(className, this.values);
  }
}

class Participant extends Container {
  private imgContainer: Container;
  private carTag: Container;
  private image: HTMLElement;
  private carPanel: Container;
  private carId: number;
  constructor(garage: GarageView, params: Car) {
    super('participant');
    const buttons = ['edit-car', 'remove-car', 'engine', 'drive-state'];
    const buttonsText = ['edit', 'remove', 'ignition', 'mode'];
    const [edit, remove, engine, state] = ButtonsCreator.createButtons(
      buttons.length,
      buttonsText,
      buttons,
    );
    this.carId = params.id;
    this.carTag = new Container('car-tag');
    this.carTag.setText(params.name);
    this.carPanel = new Container('car-panel');
    this.carPanel.addBlocks([edit, remove, this.carTag, engine, state]);
    this.imgContainer = new Container(`car-img _${params.id}`);

    const svgCopy = parser.parseFromString(svgCar, 'image/svg+xml');
    const imageElement = svgCopy.documentElement;

    this.image = document.importNode(imageElement, true);
    this.imgContainer.getNode().appendChild(this.image);

    this.image.setAttribute('fill', params.color);
    this.addBlock(this.carPanel);
    this.addBlock(this.imgContainer);
  }

  public changeData(params: CarParam): void {
    this.carTag.setText(params.name);
    this.image.setAttribute('fill', params.color);
  }
}

import svgCar from '../../assets/car.svg?raw';
const parser = new DOMParser();
