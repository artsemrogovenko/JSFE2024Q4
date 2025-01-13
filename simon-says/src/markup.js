function createMenu() {
  let menu = document.createElement('div');
  menu.classList.add('menu');

  menu.append(...createButtons(null, null, ['easy', 'medium', 'hard', 'start']));

  let miscPanel = document.createElement('div');
  miscPanel.classList.add('invisible');
  miscPanel.id='misc';

  let repeatButton = document.createElement('button');
  repeatButton.classList.add('button','repeat','invisible');
  repeatButton.id = 'repeat';
  repeatButton.textContent = 'Repeat the sequence';

  let round = document.createElement('div');
  round.classList.add('invisible');
  round.id = 'round';

  document.body.append(menu);
  miscPanel.append(repeatButton,round);
  document.body.append(miscPanel);
}

function createKeyboard() {
  let keyboard = document.createElement('div');
  keyboard.classList.add('keyboard');

  let numbers = document.createElement('div');
  numbers.classList.add('numbers');
  numbers.append(...createButtons(48, 57));

  let letters = document.createElement('div');
  letters.classList.add('letters');

  let firstline = document.createElement('div');
  let secondtline = document.createElement('div');
  let thirdline = document.createElement('div');

  firstline.classList.add('line_letter');
  secondtline.classList.add('line_letter');
  thirdline.classList.add('line_letter');

  firstline.append(
    ...createButtons(null, null, ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'])
  );
  secondtline.append(
    ...createButtons(null, null, ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'])
  );
  thirdline.append(...createButtons(null, null, ['z', 'x', 'c', 'v', 'b', 'n', 'm']));

  letters.append(firstline, secondtline, thirdline);
  keyboard.append(numbers, letters);
  // document.body.append(keyboard);
  return keyboard;
}

function createButtons(start, end, arrNames = null) {
  let buttons = [];
  if (arrNames === null) {
    for (let i = start; i <= end; i++) {
      let button = document.createElement('button');
      button.classList.add('button');
      button.textContent = String.fromCharCode(i);
      button.id = String.fromCharCode(i);
      buttons.push(button);
    }
  } else {
    for (let i = 0; i < arrNames.length; i++) {
      let button = document.createElement('button');
      button.classList.add('button');
      button.textContent = arrNames[i].toUpperCase();
      button.id = arrNames[i];
      buttons.push(button);
    }
  }
  return buttons;
}

function init() {
  createMenu();

  let area = document.createElement('div');
  area.classList.add('panel');

  let wrapper = document.createElement('div');
  wrapper.classList.add('wrapper');
  wrapper.append(area,createKeyboard());

  document.body.append(wrapper);

}

export { init as initGame };
