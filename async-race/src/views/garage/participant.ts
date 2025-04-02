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

import Controller from '../../api/controller';
import svgCar from '../../assets/car.svg?raw';
import { Container } from '../../modules/block';
import { ButtonsCreator } from '../../modules/buttons';
import type {
  Car,
  CarInfo,
  CarParam,
  Engine,
  EngineResponse,
} from '../../modules/types';
import { HttpСode, Status } from '../../modules/types';
import { moveCar, resetCar, stopCar } from './animation';
import { isEngineResponse } from './functions';
import type GarageView from './garage';
const parser = new DOMParser();
