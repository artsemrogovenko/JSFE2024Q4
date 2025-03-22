import Block from '../modules/block';
import type { OptionData } from '../modules/types';
import type PickerView from './picker-view';

class Canvas extends Block<'canvas'> {
  protected ctx: CanvasRenderingContext2D | null;
  constructor() {
    super('canvas', 'canvas-wheel');
    this.ctx = null;
    const canvas = this.getNode();
    if (canvas instanceof HTMLCanvasElement) {
      canvas.width = 500;
      canvas.height = 500;
      const context = canvas.getContext('2d');
      if (context instanceof CanvasRenderingContext2D) {
        this.ctx = context;
      }
    }
  }
  public measureText(text: string, font: string): number {
    if (font !== null && this.ctx) {
      this.ctx.font = font;
      return this.ctx.measureText(text).width;
    }
    return 0;
  }
}

export class Wheel extends Canvas {
  private pointX: number = 0;
  private pointY: number = 0;
  private radius: number = 0;
  private currentRotate: number;
  private parent: PickerView;
  private optionsData: OptionData[] = [];
  private generated: boolean = false;
  private generatedColors: number[][] = [];
  private oldAngle: number;

  constructor(parent: PickerView) {
    super();
    this.ctx = null;
    this.currentRotate = randomRange();
    this.oldAngle = this.currentRotate;
    this.parent = parent;
    const canvas = this.getNode();
    if (canvas instanceof HTMLCanvasElement) {
      this.pointX = canvas.width / 2;
      this.pointY = canvas.height / 2;
      this.radius = canvas.width / 2;

      const context = canvas.getContext('2d');
      if (context instanceof CanvasRenderingContext2D) {
        this.ctx = context;
      }
    }
    this.generatedColors = [];
  }
  public prepare(data: OptionData[]): void {
    this.optionsData = data;
    this.generated = false;
    this.draw();
  }

  public spin(duration: number): void {
    this.parent.wheelSpin = true;
    const miliseconds = (duration + 1) * 1000;
    const timeStart = Date.now();
    const endTime = timeStart + miliseconds;
    const middleTime = timeStart + miliseconds / 2;
    const stepBegin = 360 * 5;

    const randomPosition = randomNumber(360);
    const animations = (): void => {
      const currentTime = Date.now();
      const passedTime = currentTime - timeStart;
      let progress = 0;
      let angle = 0;
      if (currentTime <= middleTime) {
        progress = passedTime / (middleTime - timeStart);
        angle = this.oldAngle + circ(progress) * stepBegin;
      } else {
        progress = (currentTime - middleTime) / (endTime - middleTime);
        angle = this.oldAngle + stepBegin + circInverse(progress) * stepBegin;
      }
      angle += randomPosition;
      angle = normalizeAngle(angle);
      this.currentRotate = angle;
      if (currentTime <= endTime) {
        this.draw(angle);
        this.showWinner();
        window.requestAnimationFrame(animations);
      } else {
        this.oldAngle = this.currentRotate;
        this.parent.wheelSpin = false;
        this.parent.congratulate();
      }
    };
    window.requestAnimationFrame(animations);
  }

  public showWinner(): void {
    const value = this.calculateTitle();
    this.parent.showInfo(value);
  }

  public draw(angle?: number): void {
    const data = this.optionsData;
    const canvas = this.getNode();
    if (this.ctx && canvas instanceof HTMLCanvasElement && data.length >= 2) {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.ctx.save();

      const totalWeight = data.reduce<number>(
        (sum, item) => sum + Number(item.weight),
        0,
      );
      let startDeg: number = angle || this.currentRotate;

      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const weight: number = parseInt(item.weight);
        const step: number = (weight / totalWeight) * 360;
        const endDeg: number = startDeg + step;
        let [red, green, blue] = [0, 0, 0];
        if (!this.generated) {
          [red, green, blue] = generateColor();
          this.generatedColors.push([red, green, blue]);
        } else {
          [red, green, blue] = this.generatedColors[i];
        }
        const colorStyle: string = `rgb(${red},${green},${blue})`;

        this.ctx.beginPath();
        this.ctx.moveTo(this.pointX, this.pointY);
        this.ctx.arc(
          this.pointX,
          this.pointY,
          this.radius - 10,
          toRadians(startDeg),
          toRadians(endDeg),
        );
        this.ctx.fillStyle = colorStyle;
        this.ctx.fill();

        this.outline();

        this.ctx.save();
        this.ctx.translate(this.pointX, this.pointY);
        const midDeg: number = (startDeg + endDeg) / 2;
        this.ctx.rotate(toRadians(midDeg));
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle =
          red > 150 || green > 150 || blue > 150 ? '#000' : '#fff';
        const fontSize = 16;
        this.ctx.font = `bold ${fontSize}px Arial`;

        const textMaxWidth = this.radius - 50;
        const fontMaxHeight = 30;
        const sectorAngle = endDeg - startDeg;
        const text = formatTitle(
          item.title,
          textMaxWidth,
          fontMaxHeight,
          fontSize,
          sectorAngle,
        );
        if (text) {
          this.ctx.fillText(text, 30, fontSize / 4);
        }
        this.ctx.restore();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.moveTo(this.pointX, this.pointY);
        this.ctx.arc(
          this.pointX,
          this.pointY,
          20,
          toRadians(startDeg),
          toRadians(endDeg),
        );
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();
        this.ctx.closePath();
        this.outline('white');

        startDeg = endDeg;

        this.ctx.translate(this.radius * 2 + 30, this.radius + 2);
        this.ctx.rotate(toRadians(90));
        const [x, y, base, height] = [0, 0, 30, 50];
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + height * 2);
        this.ctx.lineTo(x - base / 2, y + height / 2);
        this.ctx.lineTo(x + base / 2, y + height / 2);
        this.ctx.closePath();
        this.ctx.fillStyle = '#ddd';
        this.ctx.fill();
        this.outline('#000');
        this.ctx.rotate(toRadians(-90));
        this.ctx.translate(this.radius * 2 * -1 - 30, this.radius * -1 - 2);
      }
      this.generated = true;
      this.ctx.restore();
    }
  }
  private outline(color: string = ''): void {
    if (this.ctx) {
      this.ctx.strokeStyle = color !== '' ? color : '#fff';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }
  }
  private calculateTitle(): string {
    const angle = (360 - (this.currentRotate % 360)) % 360;
    let startDeg = 0;
    const totalWeight = this.optionsData.reduce(
      (sum, item) => sum + Number(item.weight),
      0,
    );

    for (const item of this.optionsData) {
      const step = (parseInt(item.weight) / totalWeight) * 360;
      const endDeg = startDeg + step;

      if (angle >= startDeg && angle < endDeg) {
        return item.title;
      }
      startDeg = endDeg;
    }
    return '';
  }
}

function randomNumber(v: number): number {
  return Math.floor(Math.random() * v);
}
function toRadians(deg: number): number {
  return deg * (Math.PI / 180);
}
function generateColor(): number[] {
  const values: number[] = [];
  while (values.length !== 3) {
    let value = randomNumber(255);
    if (!values.includes(value)) {
      values.push(value);
    }
  }
  return values;
}
function randomRange(min: number = 0, max: number = 360): number {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function circ(timeFraction: number): number {
  return 1 - Math.sin(Math.acos(timeFraction));
}

function circInverse(timeFraction: number): number {
  return Math.cos(Math.asin(1 - timeFraction));
}
function normalizeAngle(angle: number): number {
  return angle % 360;
}

function formatTitle(
  title: string,
  maxWidth: number,
  maxHeight: number,
  fontSize: number,
  sectorAngle: number,
): string | null {
  if (sectorAngle < 10) {
    return null;
  }
  let result = title;
  while (
    myCanvas.measureText(result + '…', `bold ${fontSize}px Arial`) > maxWidth &&
    result.length > 0
  ) {
    result = result.slice(0, -1);
  }
  const textHeight = fontSize * 0.2;
  if (textHeight > maxHeight) {
    return null;
  }
  return result.length < title.length ? result + '…' : result;
}

export const myCanvas = new Canvas();
