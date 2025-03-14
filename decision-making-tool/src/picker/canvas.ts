import Block from '../modules/block';
import type { OptionData } from '../modules/types';

export class Wheel extends Block<'canvas'> {
  private ctx: CanvasRenderingContext2D | null;
  private pointX: number = 0;
  private pointY: number = 0;
  private radius: number = 0;
  private currentRotate: number;
  constructor(classname: string) {
    super('canvas', classname);
    this.ctx = null;
    this.currentRotate = 0;

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

  public draw(data: OptionData[]): void {
    const canvas = this.getNode();
    if (this.ctx && canvas instanceof HTMLCanvasElement) {
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
