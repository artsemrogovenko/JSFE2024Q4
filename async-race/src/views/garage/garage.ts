import Controller from '../../api/controller';
import type State from '../../application/state';
import { Container } from '../../modules/block';
import type { Button } from '../../modules/buttons';
import { ButtonsCreator } from '../../modules/buttons';
import Form from '../../modules/form';
import type { Car, CarParam, FormsData } from '../../modules/types';
import { FormAction, Limits, PageMode, RaceState } from '../../modules/types';
import { pagesLogic } from '../pages-logic';
import { View } from '../view';
import { showInfo } from './dialog';
import {
  disableClick,
  enableClick,
  isCar,
  isCarsResponse,
  raceHandler,
  randomCarsHandler,
} from './functions';
import { Participant } from './participant';

export default class GarageView extends View {
  private create: Form;
  private update: Form;
  private topContainer = new Container('top-container');
  private racePanel = new Container('dispatcher');
  private raceContainer = new Container('race-container');
  private state: State;
  private editingCar: Participant | null = null;
  private formsData: FormsData = {
    create: { name: '', color: '' },
    update: { name: '', color: '', id: -1 },
  };
  private startRace: Button | undefined;
  private resetRace: Button | undefined;
  constructor(state: State) {
    super('main');
    this.state = state;
    this.raceState = RaceState.READY;
    this.create = new Form('form-create', 'create', this);
    this.update = new Form('form-edit', 'update', this);
    this.create.addListener('change', () =>
      this.changeValues(this.create, FormAction.CREATE),
    );
    this.update.addListener('change', () =>
      this.changeValues(this.update, FormAction.UPDATE),
    );
    this.topContainer.addBlocks([this.create, this.update]);
    const headlines = this.headlines(PageMode.garage);
    this.addBlocks([this.topContainer, headlines, this.raceContainer]);
    this.init();
    disableClick(this.update);
  }

  public get getState(): State {
    return this.state;
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
          this.update.resetInput();
          disableClick(this.update);
        }
        break;
      case 'form-create':
        if (values.name.trim() !== '') {
          const result = await Controller.newCar(values);
          if (result && isCar(result.body)) {
            this.initRace();
            this.create.resetInput();
          }
        } else {
          showInfo('поле не должно быть пустым');
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
    enableClick(this.update);
  }

  public async removeCar(part: Participant): Promise<void> {
    const carId = part.parameters.id;
    const success = await Controller.remove(carId);
    if (success) {
      this.clearRace();
      this.raceContainer.deleteAllBlocks();
      this.initRace();
    }
  }
  public clearRace(): void {
    const components = this.raceContainer.getComponents();
    components.forEach((part) => {
      if (part instanceof Participant) {
        part.stopSound();
      }
    });
    this.raceContainer.deleteAllBlocks();
  }
  private init(): void {
    this.initRace();
    const buttons = ['race', 'reset', 'generate cars'];
    const operatorButtons = ButtonsCreator.createButtons(
      buttons.length,
      buttons,
    );
    this.startRace = operatorButtons[0];
    this.resetRace = operatorButtons[1];
    this.racePanel.addBlocks(operatorButtons);
    this.racePanel.addListener('click', this.operate.bind(this));
    this.topContainer.addBlock(this.racePanel);
    this.toggleButtons();
    this.addListener('page-changed', (event) => {
      this.getPartData(event);
    });
  }

  private async getPartData(event: Event): Promise<void> {
    if ('detail' in event && event.detail instanceof Object) {
      const detail = event.detail;
      if ('page' in detail && typeof detail.page === 'number') {
        const page = detail.page;
        this.initRace(page);
      }
    }
    this.raceState = RaceState.READY;
    this.toggleButtons();
  }

  private async initRace(wishPage?: number): Promise<void> {
    const maxCars = Limits.garage;
    const page = wishPage ?? pagesLogic.getPage;
    const cars = await Controller.getCarsList({ _page: page, _limit: maxCars });
    if (isCarsResponse(cars) && cars.body) {
      this.clearRace();
      const body = cars.body;
      if (typeof cars.count === 'string') {
        const total = parseInt(cars.count);
        this.updateTitles(total);
        body.forEach((car) => {
          this.addParticipant(car);
        });
      }
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
      if (!event.defaultPrevented) {
        const buttonText = target.textContent;
        const components = this.raceContainer.getComponents();
        if (
          components.every((participant) => participant instanceof Participant)
        )
          switch (buttonText) {
            case 'race':
              this.raceState = RaceState.RACING;
              this.toggleButtons();
              await raceHandler(components, buttonText, this.racePanel);
              this.raceState = RaceState.FINISH;
              this.toggleButtons();
              break;
            case 'reset':
              disableClick(this.racePanel);
              await raceHandler(components, buttonText);
              enableClick(this.racePanel);
              this.raceState = RaceState.READY;
              this.toggleButtons();
              break;
            case 'generate cars':
              showInfo('Идет добавление');
              const success = await randomCarsHandler();
              if (success) showInfo('Успех!');
              this.initRace();
              break;
            default:
              break;
          }
      }
    }
  }

  private toggleButtons(): void {
    switch (this.raceState) {
      case RaceState.FINISH:
      case RaceState.RACING:
        if (this.startRace) disableClick(this.startRace);
        if (this.resetRace) enableClick(this.resetRace);
        break;

      case RaceState.READY:
        if (this.startRace) enableClick(this.startRace);
        if (this.resetRace) disableClick(this.resetRace);
        break;
    }
  }
}
