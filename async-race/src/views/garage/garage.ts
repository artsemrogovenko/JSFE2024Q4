import { Controller as ApiController, Controller } from '../../api/controller';
import type State from '../../application/state';
import Block, { Container } from '../../modules/block';
import { Button, ButtonsCreator } from '../../modules/buttons';
import { Input } from '../../modules/form';
import type {
  Car,
  CarParam,
  Engine,
  EngineResponse,
  FormsData,
  FormType,
  CarInfo,
} from '../../modules/types';
import { HttpСode, Status } from '../../modules/types';
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
  private editingCar: Participant | null = null;
  private formsData: FormsData = {
    create: { name: '', color: '' },
    update: { name: '', color: '', id: -1 },
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
        if (this.editingCar instanceof Participant) {
          const id = this.formsData.update.id;
          const data = {
            color: this.formsData.update.color,
            name: this.formsData.update.name,
          };
          const result = await Controller.update(id, data);
          if (!Object.is({}, result.body) && isCar(result.body)) {
            const data = result.body;
            const newParam = { color: data.color, name: data.name };
            this.editingCar.setParameters(newParam);
          }
        }
        break;
      case 'form-create':
        if (values.name.trim() !== '') {
          const result = await ApiController.newCar(values);
          if (!Object.is({}, result.body) && isCar(result.body)) {
            const data = result.body;
            this.addParticipant(data);
          }
        }
        break;
      default:
        break;
    }
  }

  public editCar(part: Participant): void {
    this.editingCar = part;
    this.formsData.update = part.parameters;
    const newData = {
      name: part.parameters.name,
      color: part.parameters.color,
    };
    this.update.setValues(newData);
  }

  public async removeCar(part: Participant): Promise<void> {
    const carId = part.parameters.id;
    const success = await Controller.remove(carId);
    if (success) {
      this.deleteBlock(part);
      part.destroy();
    }
  }

  private init(): void {
    this.initRace();
    const racePanel = new Container('dispatcher');
    const buttons = ['race', 'reset', 'generate cars'];
    const operatorButtons = ButtonsCreator.createButtons(
      buttons.length,
      buttons,
    );
    racePanel.addBlocks(operatorButtons);
    racePanel.addListener('click', this.operate.bind(this));
    this.topContainer.addBlock(racePanel);
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
    if (action === FormAction.CREATE) {
      const formData = form.params;
      this.formsData.create = formData;
    } else {
      const formData = form.params;
      this.formsData.update.color = formData.color;
      this.formsData.update.name = formData.name;
    }
  }

  private async operate(event: Event): Promise<void> {
    const target = event.target;
    if (target instanceof HTMLButtonElement) {
      const buttonText = target.textContent;
      const components = this.raceContainer.getComponents();
      switch (buttonText) {
        case 'race':
          let promiseArray: Promise<CarInfo>[] = [];
          if (components.every((element) => element instanceof Participant)) {
            components.forEach((part) => promiseArray.push(part.racing));
            try {
              const result = await Promise.any(promiseArray);
              const winner = await Controller.getCarById(result.id);
              if (isCarResponse(winner.body)) {
                carFormatter(winner.body);
              }
            } catch (error) {}
          }
          break;
        case 'reset':
          if (components.every((element) => element instanceof Participant))
            components.forEach((part) => part.reset);
          break;
        case 'generate cars':
          break;
        default:
          break;
      }
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
    this.colorInput.addListener('change', this.updateValues.bind(this));
    this.nameInput.addListener('change', this.updateValues.bind(this));
  }

  public get getButton(): Button {
    return this.button;
  }

  public get params(): FormType {
    return this.values;
  }

  public setValues(data: CarParam): void {
    if (this.colorInput.getNode() instanceof HTMLInputElement) {
      this.colorInput.setValue(data.color);
    }
    if (this.nameInput.getNode() instanceof HTMLInputElement) {
      this.nameInput.setValue(data.name);
    }
  }

  private updateValues(): void {
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
  private color: string;
  private name: string;
  private engine: Engine;
  private garage: GarageView;
  private speedParameters: EngineResponse = {
    velocity: 0,
    distance: 0,
  };

  constructor(garage: GarageView, params: Car) {
    super('participant');
    const buttons = ['edit-car', 'remove-car', 'engine', 'drive-state'];
    const buttonsText = ['edit', 'remove', 'race', 'home'];
    const [edit, remove, engine, state] = ButtonsCreator.createButtons(
      buttons.length,
      buttonsText,
      buttons,
    );
    this.name = params.name;
    this.color = params.color;
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

    this.garage = garage;
    this.engine = { id: params.id, status: Status.stopped };

    this.addListener('click', this.panelListener.bind(this));
  }
  public get racing(): Promise<CarInfo> {
    return this.toggleDrive();
  }

  public get reset(): Promise<Boolean> {
    return this.toggleStop();
  }
  public get parameters(): Car {
    const params = {
      name: this.name,
      color: this.color,
      id: this.carId,
    };
    return params;
  }

  public setParameters(param: CarParam): void {
    this.name = param.name;
    this.color = param.color;
    this.carTag.setText(param.name);
    this.image.setAttribute('fill', param.color);
  }

  private panelListener(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLButtonElement) {
      const buttonText = target.innerText;
      console.log(buttonText);
      switch (buttonText) {
        case 'Race':
          this.toggleDrive();
          break;
        case 'Home':
          this.toggleStop();
          break;
        case 'Edit':
          this.garage.editCar(this);
          break;
        case 'Remove':
          this.garage.removeCar(this);
          break;
        default:
          break;
      }
    }
  }

  private async toggleStop(): Promise<Boolean> {
    this.engine.status = Status.stopped;
    const response = await Controller.ignition(this.engine);
    if (!Object.is({}, response.body) && isEngineResponse(response.body)) {
      if (response.code === HttpСode.OK) {
        resetCar(this.imgContainer, this.carId);
        return true;
      }
    }
    return false;
  }

  private async toggleDrive(): Promise<CarInfo> {
    this.engine.status = Status.started;
    const response = await Controller.ignition(this.engine);
    if (!Object.is({}, response.body) && isEngineResponse(response.body)) {
      this.speedParameters = response.body;
    }
    moveCar(this.speedParameters, this.imgContainer, this.carId);
    const sprintResult = await Controller.drive(this.carId);
    const code = sprintResult.code;
    const body = sprintResult.body;
    switch (code) {
      case HttpСode.ServerError:
        stopCar(this.imgContainer, this.carId);
        if ('message' in body && typeof body?.message === 'string') {
          throw { id: this.carId, info: body.message };
        }
        break;
    }
    return { id: this.carId, info: JSON.stringify(body) };
  }
}

import svgCar from '../../assets/car.svg?raw';
import { moveCar, resetCar, stopCar } from './animation';
import { carFormatter, showInfo } from './dialog';
const parser = new DOMParser();

function isEngineResponse(obj: object): obj is EngineResponse {
  return obj.hasOwnProperty('velocity') && obj.hasOwnProperty('distance');
}
function isCarResponse(obj: object): obj is Car {
  return (
    obj.hasOwnProperty('name') &&
    obj.hasOwnProperty('color') &&
    obj.hasOwnProperty('id')
  );
}
