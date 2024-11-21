const documentElement = document.documentElement;

function initialize() {
  toggleNavigation();
  toggleBurgerButton();
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
  }
}

window.addEventListener("resize", initialize);
document.addEventListener('DOMContentLoaded', function() {
  initialize();
});
