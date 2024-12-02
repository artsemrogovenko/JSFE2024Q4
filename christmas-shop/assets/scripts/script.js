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
let cardsContainer = document.querySelector('.cards_container');

cardsContainer.addEventListener("click", function (event) {
  let selected = event.target;
  if (selected.className !== "cards_container") {
    while (!selected.classList.contains("card")) {
      selected = selected.parentElement;
    }
    formFields(selected);
  }
});

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

// let templateWidth;
// #region slider
// const buttonsSlider=document.querySelectorAll('.scroll');
const slider = document.querySelector('.slider');

// let leftPageCoordinate ;
// let distanceOnParent ;

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
  // templateWidth = document.querySelector('section').offsetWidth;
  // leftPageCoordinate = document.querySelector('section').getBoundingClientRect().left;
  // distanceOnParent=document.querySelector('.slider_text').getBoundingClientRect().left - leftPageCoordinate;
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
  const sliderWidth = slider.scrollWidth;
  const parentWidth = slider.parentElement.offsetWidth;
  // const sliderWidth = slider.getBoundingClientRect().width;
  // const sliderWidth = slider.scrollWidth;
  const stepFormula = (sliderWidth+8 - parentWidth) / maxClicks;
  // const stepFormula = parseInt((sliderWidth - templateWidth) / maxClicks+offsetLeft+distanceOnParent);
  // let stepFormula = parseInt((sliderWidth- templateWidth) / maxClicks+(distanceOnParent)/1.5);
  // if(documentElement.clientWidth<=768){
  //   stepFormula=stepFormula-((distanceOnParent+15)/maxClicks);
  // }

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

function searchData(cardElement) {
  let contentBlock = Array.from(cardElement.childNodes).filter(
    (node) => node.nodeType === 1 && node.classList.contains("card-content"));
  let searchNamePhrase=contentBlock.pop().innerText.split('\n')[0].toLowerCase();
  let foundElement = gifts.filter(gift=>gift.name.toLowerCase() === searchNamePhrase);
  return foundElement[0];
}

const modalBackground = document.querySelector(".modal_background");
const modalWindow = document.querySelector(".modal");
const modalDescription = document.querySelector(".modal-description");

function formFields(cardElement) {
  const data = searchData(cardElement);
  let modalContent= modalDescription.firstElementChild;

  modalWindow.className="modal";
  modalWindow.classList.add(`${data.category.toLowerCase().replace(' ','_')}`);
  modalContent.innerHTML = `<h4>${data.category}</h4><h3>${data.name}</h3><p>${data.description}</p>`;

  let adds=document.querySelector(".adds").children;
  const forLive = parseInt(data.superpowers.live);
  const forCreate = parseInt(data.superpowers.create);
  const forLove = parseInt(data.superpowers.love);
  const forDream = parseInt(data.superpowers.dream);
  adds[0].innerHTML = composeInner("Live", forLive);
  adds[1].innerHTML = composeInner("Create", forCreate);
  adds[2].innerHTML = composeInner("Love", forLove);
  adds[3].innerHTML = composeInner("Dream", forDream);

  modalBackground.classList.remove('hidden');
  documentElement.style.overflow="hidden";
}

function composeInner(title,rating){
 return `<p>${title}</p><p>+${rating}</p>
        <div class="stars_container">
        ${'<div class="star"></div>'.repeat(rating/100)}
        ${'<div class="star light"></div>'.repeat(5 - rating/100)}
        </div>`;
}
//#endregion

//#region closeModal
modalBackground.addEventListener('click',(event)=>{
  let selected = event.target;
  if (
    selected.classList.contains("close_modal") ||
    selected.classList.contains("modal_background")
  ) {
    modalBackground.classList.add('hidden');
    documentElement.style.overflow="";
  }
}
);

//#endregion closeModal

//#region filter-gifts
const filterTabs = document.querySelectorAll('.tab');

filterTabs.forEach((element) => {
  if (element.className.includes("tab")) {
    element.addEventListener("click", function(e){
      unsetActiveTabs();
      let clicked = e.target;
      if(clicked.className==='action_small'){
        clicked.parentElement.classList.add('active');
      }else{
        clicked.classList.add('active');
      }
      filteringGifts(clicked.innerText);
    }
    );
  }
});

function unsetActiveTabs() {
  filterTabs.forEach(element => {
    element.classList.remove('active');
  });
}

function filteringGifts(parameter){
 if (parameter === "ALL") {
  return cardsContainer.innerHTML = pickRandom(gifts.length)
  .reduce((acc, element) => acc + draftingBlock(element),'');
 }
 return (cardsContainer.innerHTML = gifts
   .filter((gift) => gift.category.toLowerCase() === parameter.toLowerCase())
   .reduce((acc, element) => acc + draftingBlock(element), ''));
}
//#endregion filter

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
