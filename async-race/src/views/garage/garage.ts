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
  getList,
  isCar,
  isCarParam,
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
  private soundButton = pagesLogic.getSoundButton;

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
    this.addBlock(this.soundButton);
  }

  public get getState(): State {
    return this.state;
  }
  public carReadyRacing(): void {
    const everyIsReady = this.raceContainer
      .getComponents()
      .every((component) => {
        if (component instanceof Participant) {
          return component.raceState === RaceState.READY;
        }
        return false;
      });
    if (everyIsReady) {
      this.raceState = RaceState.READY;
      this.toggleButtons();
    }
  }
  public disableRacing(): void {
    if (this.raceState !== RaceState.RACING) {
      this.raceState = RaceState.RACING;
      this.toggleButtons();
    }
  }
  public enableRacing(): void {
    if (this.raceState !== RaceState.READY) {
      this.raceState = RaceState.READY;
      this.toggleButtons();
    }
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
        if (this.raceState === RaceState.RACING) {
          showInfo('Дождитесь окончания заезда');
          return;
        }
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
    try {
      const success = await Controller.remove(carId);
      if (success) {
        part.clearData();
        const page = pagesLogic.totalPages === 1 ? 1 : pagesLogic.getPage + 1;
        const limit = Limits.garage;
        const carResponse = await getList(page, limit);
        if (carResponse && carResponse.body) {
          const car = carResponse.body[0];
          if (isCarParam(car) && pagesLogic.totalPages !== pagesLogic.getPage) {
            this.addParticipant(car);
          }
          if (carResponse.count) {
            const total = parseInt(carResponse.count);
            pagesLogic.updateTitles(total);
            this.updateTitles(total);
          }
        }
        const index = this.raceContainer.deleteBlock(part);
        this.raceContainer.getComponents().splice(index, 1);
        this.enableRacing();
      }
    } catch (error) {
      throw error;
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
    const cars = await getList(page, maxCars);
    if (cars !== undefined) {
      this.clearRace();
      const body = cars.body;
      if (typeof cars.count === 'string' && Array.isArray(body)) {
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
            case 'reset':
              if (this.raceContainer.getComponents().length === 0) {
                showInfo('Гараж пуст');
                return;
              }
              disableClick(this.racePanel);
              this.raceState = RaceState.RACING;
              pagesLogic.disablePagination();
              try {
                await this.panelCommand(buttonText, components);
                this.calcState(buttonText);
              } catch (error) {
              } finally {
                enableClick(this.racePanel);
                pagesLogic.enablePagination();
              }
              break;
            case 'generate cars':
              await this.generateCars();
              break;
            default:
              break;
          }
      }
    }
    this.toggleButtons();
  }

  private async panelCommand(
    buttonText: string,
    components: Participant[],
  ): Promise<boolean | void> {
    try {
      const result = await raceHandler(
        components,
        buttonText,
        this.toggleButtons.bind(this),
      );
      if (this.raceState === RaceState.RACING) {
        this.raceState = RaceState.FINISH;
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  private calcState(button: string): void {
    if (button === 'reset') {
      this.raceState = RaceState.READY;
      return;
    }
    if (button === 'race') {
      this.raceState = RaceState.FINISH;
      return;
    }
  }

  private async generateCars(): Promise<void> {
    if (this.raceState === RaceState.RACING) {
      showInfo('Дождитесь окончания заезда');
      return;
    }
    showInfo('Идет добавление');
    const success = await randomCarsHandler();
    if (success) {
      showInfo('Успех!');
      this.raceState = RaceState.READY;
      this.toggleButtons();
    }
    this.initRace();
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
