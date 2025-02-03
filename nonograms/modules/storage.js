let nonogramGame = { score: null, memory: null };

export function updateLocalStorage() {
  localStorage.artsemrogovenko = JSON.stringify(nonogramGame);
}

export function readStorage() {
  let obj = localStorage.artsemrogovenko;
  if (obj === undefined) {
    updateLocalStorage();
    return false;
  }
  nonogramGame = JSON.parse(localStorage.artsemrogovenko);
}

export function writeScore(...data) {
  readStorage();
  let array = nonogramGame.score || [];
  if (array.length === 5) {
    array.pop();
  }
  array.unshift(data);
  nonogramGame['score'] = array;
  if (nonogramGame['memory']) {
    if (
      nonogramGame['memory']['difficulty'] === data[0] &&
      nonogramGame['memory']['nonogram'] === data[1]
    ) {
      nonogramGame['memory'] = null;
      updateLocalStorage();
      return true;
    }
  }
  updateLocalStorage();
}

export function storageScore() {
  readStorage();
  if (nonogramGame['score']) {
    return nonogramGame['score'].sort((a, b) => {
      return parseInt(a[2].join('')) - parseInt(b[2].join(''));
    });
  }
  return [['no', 'results', 'yet']];
}

export function saveGame(gamelogic) {
  readStorage();
  nonogramGame['memory'] = {
    dark: gamelogic[0],
    isGameStarted: gamelogic[1],
    size: gamelogic[2],
    difficulty: gamelogic[3],
    nonogram: gamelogic[4],
    nonogramIndex: gamelogic[5],
    currentDuration: gamelogic[6],
    crosses: gamelogic[7],
  };
  updateLocalStorage();
}

export function loadGame() {
  readStorage();
  if (nonogramGame['memory']) {
    return nonogramGame['memory'];
  }
  return false;
}
