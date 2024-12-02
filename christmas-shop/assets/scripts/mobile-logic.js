/**логика для бургер меню */
const documentElement = document.documentElement;
const rootStyles = getComputedStyle(document.documentElement);
const burgerContainer = document.querySelector(".burger-container");
const burgerContent = document.querySelector(".burger-content");
const burgerIcon = document.querySelector(".burger_button");
/**
 * задержка для трансформации
 */
let myDelay ;

window.addEventListener("resize", initialize);
document.addEventListener('DOMContentLoaded', preparationFirstLoading);

function initialize() {
  calcPositionBurger();
  document.documentElement.style.setProperty("--my-burger-height",`${document.body.scrollHeight}px`);
  document.documentElement.style.setProperty("--my-burger-width",`${documentElement.clientWidth}px`);
  toggleNavigation();
  toggleBurgerButton();
  toTop();
}

function toggleNavigation() {
  const menu = document.querySelector(".menu");
  if (documentElement.clientWidth < 769) {
    menu.classList.add("hidden");
  } else {
    menu.classList.remove("hidden");
  }
}

function toggleBurgerButton() {
  const button = document.querySelector(".burger_button");
  if (documentElement.clientWidth < 769) {
    button.classList.replace("hidden", "visible");
  } else {
    button.classList.replace("visible", "hidden");
    hideBurgerMenu();
  }
}


let timeStart = Date.now();
/**
 * с фильтрацией многократного нажатия
 */
function initBurger() {
  if (Date.now() - timeStart > 1000) {
    if (burgerIcon.classList.contains("pressed")) {
      hideBurgerMenu();
    } else {
      burgerIcon.classList.add("pressed");
      burgerContainer.classList.remove("hidden");
      document.body.style.overflow='hidden';
      setTimeout(() => {
        burgerContainer.classList.add("move_burger");
      }, 50);
    }
    timeStart = Date.now();
  }
}

function hideBurgerMenu() {
  burgerIcon.classList.remove("pressed");
  burgerContainer.classList.remove("move_burger");
  document.body.style.overflow='';
  setTimeout(() => {
    burgerContainer.classList.add("hidden");
  }, myDelay);
}

function calcPositionBurger() {
  const burgerContentHeight = 200;
  let burgerTopPosition = documentElement.clientHeight / 2 - burgerContentHeight / 2;
  documentElement.style.setProperty(
    "--my-burger-top-position",
    `${burgerTopPosition}px`
  );
}

function preparationFirstLoading(){
  burgerIcon.addEventListener("click", initBurger);

  const time = rootStyles.getPropertyValue("--my-transform-time").trim();
  myDelay = parseFloat(time) * 1000;

// добавление событий на ссылки бургера
let burgerButtons = Array.from(burgerContent.childNodes).filter(
  (e) => e.nodeType === 1 && e.classList.contains("nav")
);

burgerButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();

    hideBurgerMenu();
    setTimeout(() => {
      window.location = button.href;
    }, myDelay);
  });
});

  initialize();
}

const scrollUp = document.querySelector('.to_top');
let positionScrollUp = 300;

function toTop() {
  if (window.innerWidth <= 768 && document.location.pathname.includes('gifts.html')) {
    if (window.pageYOffset >= positionScrollUp) {
      document.querySelector(".to_top").classList.remove("hidden");
    }else {
      document.querySelector(".to_top").classList.add("hidden");
    }
  } else {
    document.querySelector(".to_top").classList.add("hidden");
  }
}

if(document.location.pathname.includes('gifts.html')){
  window.addEventListener('scroll', toTop);
}
