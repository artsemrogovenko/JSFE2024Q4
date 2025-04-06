export class Participant extends Container {
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
  private buttonEdit: Button;
  private buttonRemove: Button;
  private buttonEngine: Button;
  private buttonState: Button;
  private sound: ParticipantSound = new ParticipantSound();

  constructor(garage: GarageView, params: Car) {
    super('participant');
    const buttons = ['edit-car', 'remove-car', 'engine', 'drive-state'];
    const buttonsText = ['edit', 'remove', 'race', 'home'];
    [this.buttonEdit, this.buttonRemove, this.buttonEngine, this.buttonState] =
      ButtonsCreator.createButtons(buttons.length, buttonsText, buttons);
    this.name = params.name;
    this.color = params.color;
    this.carId = params.id;
    this.carTag = new Container('car-tag');
    this.carTag.setText(params.name);
    this.carPanel = new Container('car-panel');
    this.carPanel.addBlocks([
      this.buttonEdit,
      this.buttonRemove,
      this.carTag,
      this.buttonEngine,
      this.buttonState,
    ]);
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
    this.changeStateButton();
  }

  public get racing(): Promise<CarInfo> {
    disableClick(this.carPanel);
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
  public stopSound(): void {
    this.sound.destroy();
  }
  public raving(id: number): void {
    if (id === this.carId) {
      this.sound.rave();
    }
  }

  public setParameters(param: CarParam): void {
    this.name = param.name;
    this.color = param.color;
    this.carTag.setText(param.name);
    this.image.setAttribute('fill', param.color);
  }

  private async panelListener(event: Event): Promise<void> {
    const target = event.target;
    const disabled = event.defaultPrevented;
    if (target instanceof HTMLButtonElement && !disabled) {
      const buttonText = target.innerText;
      switch (buttonText) {
        case 'Race':
          this.garage.disableRacing();
          buttonLogic(this.buttonEngine, this.toggleDrive.bind(this));
          break;
        case 'Home':
          buttonLogic(this.buttonState, this.toggleStop.bind(this));
          break;
        case 'Edit':
          this.garage.editCar(this);
          break;
        case 'Remove':
          buttonLogic(this.buttonRemove, () => this.garage.removeCar(this));
          break;
        default:
          break;
      }
    }
  }

  private async toggleStop(): Promise<Boolean> {
    const oldStatus = this.engine.status;
    try {
      this.engine.status = Status.stopped;
      const response = await Controller.ignition(this.engine);
      if (!Object.is({}, response.body) && isEngineResponse(response.body)) {
        if (response.code === HttpСode.OK) {
          this.sound.stopEngine();
          this.changeStateButton();
          resetCar(this.imgContainer, this.carId);
          return true;
        }
      }
      return false;
    } catch (e) {
      this.engine.status = oldStatus;
      disableClick(this.buttonEngine);
      throw e;
    } finally {
      enableClick(this.carPanel);
    }
  }

  private async toggleDrive(): Promise<CarInfo> {
    this.engine.status = Status.started;
    this.sound.starter();
    try {
      const response = await Controller.ignition(this.engine);
      if (!Object.is({}, response.body) && isEngineResponse(response.body)) {
        this.sound.stopStarter();
        this.changeStateButton();
        this.speedParameters = response.body;
        this.sound.noiseEngine(response.body.velocity);
        this.engine.status = Status.drive;
        moveCar(this.speedParameters, this.imgContainer, this.carId);
      }
      await this.drive();
      return { id: this.carId, info: JSON.stringify(response.body) };
    } catch (error) {
      throw error;
    } finally {
      enableClick(this.carPanel);
    }
  }

  private async drive(): Promise<void> {
    try {
      const sprintResult = await Controller.drive(this.carId);
      const code = sprintResult.code;
      const body = sprintResult.body;
      switch (code) {
        case HttpСode.ServerError:
          stopCar(this.imgContainer, this.carId);
          this.sound.stopEngine();
          this.sound.broken();
          if ('message' in body && typeof body?.message === 'string') {
            throw { id: this.carId, info: body.message };
          }
          break;
        case HttpСode.OK:
          this.engine.status = Status.stopped;
          this.sound.noiseEngine(1);
          break;
      }
    } catch (error) {
      throw error;
    }
    return;
  }

  private changeStateButton(): void {
    switch (this.engine.status) {
      case Status.drive:
      case Status.started:
        disableClick(this.buttonEngine);
        enableClick(this.buttonState);
        break;
      case Status.stopped:
      default:
        enableClick(this.buttonEngine);
        disableClick(this.buttonState);
        break;
    }
  }
}

import Controller from '../../api/controller';
import svgCar from '../../assets/car.svg?raw';
import { Container } from '../../modules/block';
import type { Button } from '../../modules/buttons';
import { ButtonsCreator } from '../../modules/buttons';
import { ParticipantSound } from '../../modules/sound';
import type {
  Car,
  CarInfo,
  CarParam,
  Engine,
  EngineResponse,
} from '../../modules/types';
import { HttpСode, Status } from '../../modules/types';
import { moveCar, resetCar, stopCar } from './animation';
import {
  buttonLogic,
  disableClick,
  enableClick,
  isEngineResponse,
} from './functions';
import type GarageView from './garage';
const parser = new DOMParser();
