// let gifts ;
// loadGifts();
import gifts from "../gifts.json" assert {type: 'json'};
// function loadGifts(){
//   fetch('./assets/gifts.json')
//   .then(response => {
//       if (!response.ok) {
//           throw new Error('Network response was not ok');
//       }
//       return response.json();
//   })
//   .then(res => {
//     gifts = Array.from(res);
//   })
// }
//#region timer
const daysValue =document.getElementById('days');
const hoursValue =document.getElementById('hours');
const minutesValue =document.getElementById('minutes');
const secondsValue =document.getElementById('seconds');

const newYear = new Date(Date.UTC(2025, 0));

function calculateTime() {

  if(document.location.pathname.includes('home.html')){
    const differenceMs = newYear - Date.now();
    daysValue.innerText = Math.floor(differenceMs / (3600000 * 24));
    hoursValue.innerText = new Date(differenceMs).getUTCHours();
    minutesValue.innerText = new Date(differenceMs).getUTCMinutes();
    secondsValue.innerText = new Date(differenceMs).getUTCSeconds();
  }

}

setInterval(() => {
  calculateTime();
}, 1000);
//#endregion timer
const cardsContainer = document.querySelector('.cards_container');

const isHomePage = document.location.pathname.includes("home.html");
document.addEventListener("DOMContentLoaded", function () {
  if (isHomePage) {
    calculateTime();
    initSlider();
    homeGifts();
  }else{
   cardsContainer.innerHTML=gifts.reduce((acc,element) => acc+draftingBlock(element),'');
}
});

let templateWidth;
// #region slider
const buttonsSlider=document.querySelectorAll('.scroll');
const slider = document.querySelector('.slider');

let leftPageCoordinate ;
let distanceOnParent ;

let maxClicks;
let countClicks;
let buttonLeft = document.querySelector('.arrow-left');
let buttonRight = document.querySelector('.arrow-right');

function initSlider() {
    slider.style.transform = `translateX(0px)`;
    initWindow();
    buttonLeft.addEventListener("click", function () {
      sliderLogic("left");
      sliderButtonLogic(buttonLeft,buttonRight);
    });
    buttonRight.addEventListener("click", function () {
      sliderLogic("right");
      sliderButtonLogic(buttonLeft,buttonRight);
    });
}

function initWindow(){
  templateWidth = document.querySelector('section').offsetWidth;
  leftPageCoordinate = document.querySelector('section').getBoundingClientRect().left;
  distanceOnParent=document.querySelector('.slider_text').getBoundingClientRect().left - leftPageCoordinate;
  countClicks = 0;
  if (documentElement.clientWidth > 768) {
    maxClicks = 3;
  } else {
    maxClicks = 6;
  }
}

window.addEventListener("resize", function () {
  if(isHomePage){
    slider.style.transform = `translateX(0px)`;
    initWindow();
    buttonLeft.classList.add('inactive');
    buttonRight.classList.remove('inactive');
  }
});

function sliderButtonLogic(btnL,btnR){
  if(countClicks===0){
    btnL.classList.add('inactive');
  }else{
    btnL.classList.remove('inactive');
  }

  if(countClicks===maxClicks){
    btnR.classList.add('inactive');
  }else{
    btnR.classList.remove('inactive');
  }
}



function sliderLogic(direction) {
  const sliderWidth = slider.getBoundingClientRect().width;
  // const stepFormula = parseInt((sliderWidth - documentElement.clientWidth) / maxClicks);
  let stepFormula = parseInt((sliderWidth- templateWidth) / maxClicks+(distanceOnParent)/1.5);
  if(documentElement.clientWidth<=768){
    stepFormula=stepFormula-((distanceOnParent+15)/maxClicks);
  }

  let currentValue = parseFloat((slider.style.transform).slice(11));
  switch (direction) {
    case "left":
      if(countClicks>0){
      currentValue += stepFormula;
      countClicks--;}
      break;
    case "right":
      if(countClicks<maxClicks){
      currentValue -= stepFormula;
      countClicks++;}
      break;
  }
  slider.style.transform=`translateX(${currentValue}px)`;
}
// #endregion slider

//#region cards
function pickRandom(size){
  let cardsContent= new Set();
  while (cardsContent.size < size) {
    const randomIndex = Math.floor(Math.random() * gifts.length);
    cardsContent.add(gifts[randomIndex]);
  }
  return Array.from(cardsContent);
}

function draftingBlock(object) {
  let formattedCategory = object.category.replace(" ", "_").toLowerCase();
  return `<div class="card ${formattedCategory}">
  <div class="card-image"></div>
  <div class="card-content">
      <h4>${object.name}</h4>
      <h3>${object.description}</h3>
  </div>
</div>`;
}

function homeGifts() {
  while (cardsContainer.firstChild) {
    cardsContainer.removeChild(cardsContainer.firstChild);
  }
  cardsContainer.innerHTML= pickRandom(4).reduce((acc,element) => acc+draftingBlock(element),'');
}

function formFields(data) {
  const forDescription = `<h4>${data}</h4><h3>${data}</h3><p>${data}</p>`;
  const forLive = `<p>Live</p><p>${data}</p>
     							 <div class="stars_container">
                  ${'<div class="star light">'.repeat(5)}
                  </div>`;

  const forCreate = `<p>Create</p><p>${data}</p>
                  <div class="stars_container">
                  ${'<div class="star light">'.repeat(5)}
                  </div>`;

  const forLove = `<p>Love</p><p>${data}</p>
                  <div class="stars_container">
                  ${'<div class="star light">'.repeat(5)}
                  </div>`;

  const forDream = `<p>Dream</p><p>${data}</p>
                  <div class="stars_container">
                  ${'<div class="star light">'.repeat(5)}
                  </div>`;
}
//#endregion


document.querySelector('.social.telegram').addEventListener('click', function () {
  window.open('https://web.telegram.org/', '_blank');
});
document.querySelector('.social.facebook').addEventListener('click', function () {
  window.open('https://instagram.com', '_blank');
});
document.querySelector('.social.instagram').addEventListener('click', function () {
  window.open('https://www.instagram.com/', '_blank');
});
document.querySelector('.social.x').addEventListener('click', function () {
  window.open('https://x.com', '_blank');
});
