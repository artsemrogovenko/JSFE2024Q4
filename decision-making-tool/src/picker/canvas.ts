import Block from '../modules/block';
import type { OptionData } from '../modules/types';
import type PickerView from './picker-view';

export class Wheel extends Block<'canvas'> {
  private ctx: CanvasRenderingContext2D | null;
  private pointX: number = 0;
  private pointY: number = 0;
  private radius: number = 0;
  private currentRotate: number;
  private parent: PickerView;
  private optionsData: OptionData[] = [];

  constructor(classname: string, parent: PickerView) {
    super('canvas', classname);
    this.ctx = null;
    this.currentRotate = 0;
    this.parent = parent;
    const canvas = this.getNode();
    if (canvas instanceof HTMLCanvasElement) {
      canvas.width = 500;
      canvas.height = 500;

      this.pointX = canvas.width / 2;
      this.pointY = canvas.height / 2;
      this.radius = canvas.width / 2;

      const context = canvas.getContext('2d');
      if (context instanceof CanvasRenderingContext2D) {
        this.ctx = context;
      }
    }
  }
  public prepare(data: OptionData[]): void {
    this.optionsData = data;
  }
  public spin(duration: number): void {
    console.log(duration);
    this.showWinner();
  }

  public showWinner(): void {
    const value = this.calculateTitle();
    this.parent.showInfo(value);
  }

  public draw(): void {
    const data = this.optionsData;
    const canvas = this.getNode();
    if (this.ctx && canvas instanceof HTMLCanvasElement && data.length > 2) {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);

      const totalWeight = data.reduce<number>(
        (sum, item) => sum + Number(item.weight),
        0,
      );

      let startDeg: number = this.currentRotate;

      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const weight: number = parseInt(item.weight);
        const step: number = (weight / totalWeight) * 360;
        const endDeg: number = startDeg + step;

        const [red, green, blue] = generateColor();
        const colorStyle: string = `rgb(${red},${green},${blue})`;

        this.ctx.beginPath();
        this.ctx.moveTo(this.pointX, this.pointY);
        this.ctx.arc(
          this.pointX,
          this.pointY,
          this.radius,
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
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle =
          red > 150 || green > 150 || blue > 150 ? '#000' : '#fff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText(item.title, this.radius - 120, 10);
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

        startDeg = endDeg;
      }
    }
  }
  private outline(): void {
    if (this.ctx) {
      this.ctx.strokeStyle = '#fff';
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
function sine(x: number): number {
  return Math.sin((x * Math.PI) / 2);
}
function randomNumber(): number {
  return Math.floor(Math.random() * 255);
}
function toRadians(deg: number): number {
  return deg * (Math.PI / 180);
}
function generateColor(): number[] {
  const values: number[] = [];
  while (values.length !== 3) {
    let value = randomNumber();
    if (!values.includes(value)) {
      values.push(value);
    }
  }
  return values;
}
