import type { Container } from '../../modules/block';
import type { EngineResponse } from '../../modules/types';

export function moveCar(
  data: EngineResponse,
  carBlock: Container,
  carId: number,
): void {
  const car = carBlock.getNode();
  const carWidth = car.offsetWidth;
  const raceWidth = document.body.offsetWidth;

  const time = raceWidth + data.distance / data.velocity;

  let animation: Animation;
  const animationId = `car-animation_${carId}`;
  const hasAnimation = car
    .getAnimations()
    .find((animation) => animation.id === animationId);
  if (hasAnimation) {
    hasAnimation.cancel();
    animation = hasAnimation;
  } else {
    animation = new Animation();
    animation.id = animationId;
  }

  const frames = [
    { left: `${car.offsetLeft}px` },
    { left: `calc(${raceWidth}px - ${carWidth}px)` },
  ];

  const effect = new KeyframeEffect(car, frames, {
    duration: time,
    fill: 'forwards',
    easing: 'linear',
  });
  if (animation instanceof Animation) {
    animation.effect = effect;
    animation.timeline = document.timeline;
    animation.play();
  }
}

export function stopCar(carBlock: Container, carId: number): void {
  const car = carBlock.getNode();
  const animationId = `car-animation_${carId}`;
  const animation = hasAnimation(car, animationId);
  if (animation) {
    animation.pause();
  }
}

export function resetCar(carBlock: Container, carId: number): void {
  const car = carBlock.getNode();
  const animationId = `car-animation_${carId}`;
  const animation = hasAnimation(car, animationId);
  if (animation) {
    animation.cancel();
  }
}

function hasAnimation(
  node: HTMLElement,
  animationId: string,
): Animation | undefined {
  return node.getAnimations().find((animation) => animation.id === animationId);
}
