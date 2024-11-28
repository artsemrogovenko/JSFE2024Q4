let gifts ;
loadGifts();
function loadGifts(){
  fetch('./assets/gifts.json')
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(res => {
    gifts = Array.from(res);
  })
}
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

document.addEventListener("DOMContentLoaded", function () {
  if (document.location.pathname.includes("home.html")) {
    calculateTime();
    initSlider();
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
  slider.style.transform = `translateX(0px)`;
  initWindow();
  buttonLeft.classList.add('inactive');
  buttonRight.classList.remove('inactive');
  console.log('resized');
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
