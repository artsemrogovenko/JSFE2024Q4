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

document.addEventListener('DOMContentLoaded',calculateTime);

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
