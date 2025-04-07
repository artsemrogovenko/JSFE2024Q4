import type { Container } from '../../modules/block';
import type { EngineResponse } from '../../modules/types';

export function moveCar(
  data: EngineResponse,
  carBlock: Container,
  carId: number,
): void {
  const car = carBlock.getNode();
  const carWidth = car.offsetWidth;
  const finishLine = 0.95;
  const raceWidth = document.body.offsetWidth * finishLine;
  const time = (raceWidth + data.distance) / data.velocity;

  resetCar(carBlock);
  const animation: Animation = new Animation();
  const animationId = `car-animation_${carId}`;
  animation.id = animationId;
  smoke(carBlock);

  const frames = [
    { left: `${car.offsetLeft}px` },
    { left: `calc(${raceWidth}px - ${carWidth}px)` },
  ];

  const effect = new KeyframeEffect(car, frames, {
    duration: time,
    fill: 'forwards',
    easing: 'linear',
  });
  animation.effect = effect;
  animation.timeline = document.timeline;
  animation.play();
}

export function stopCar(carBlock: Container, carId: number): void {
  const car = carBlock.getNode();
  const animationId = `car-animation_${carId}`;
  const animation = existAnimation(car, animationId);
  if (animation) {
    car.getAnimations().forEach((animation) => {
      animation.pause();
    });
  }
  stopSmoke(carBlock);
}

export function resetCar(carBlock: Container): void {
  const car = carBlock.getNode();
  car.getAnimations().forEach((animation) => {
    animation.cancel();
    animation.timeline = null;
    animation.effect = null;
  });
  stopSmoke(carBlock);
}

function existAnimation(node: HTMLElement, animationId: string): boolean {
  return node.getAnimations().some((animation) => animation.id === animationId);
}

export function smoke(carBlock: Container): void {
  const smokeElement = document.createElement('label');
  carBlock.getNode().insertAdjacentElement('afterbegin', smokeElement);
  smokeElement.classList.add('exhaust');
}

export function stopSmoke(carBlock: Container): void {
  const car = carBlock.getNode();
  const smokeElement = car.firstChild;
  if (smokeElement && smokeElement instanceof HTMLElement) {
    smokeElement.remove();
  }
}
