let nonogramGame={score:null};

export function updateLocalStorage(){
  localStorage.nonogramGame=JSON.stringify(nonogramGame);
}

export function readStorage(){
  let obj= localStorage.nonogramGame;
  if(obj===undefined){
    updateLocalStorage();
    return false;
  }
  nonogramGame=JSON.parse(localStorage.nonogramGame);
  return nonogramGame;
}

export function writeScore(...data){
  readStorage();
  let array = nonogramGame.score || [];
  if (array.length===5){
    array.pop();
  }
  array.unshift(data);
  nonogramGame["score"]=array;
  updateLocalStorage();
}

export function storageScore() {
  readStorage();
  if(Boolean(nonogramGame["score"])){
    return nonogramGame["score"].sort((a,b)=> {
        return parseInt( a[2].join("")) - parseInt( b[2].join("")) });
  }
  return [["no", "results", "yet"]];
}

export function saveGame(gamelogic){
console.log(JSON.stringify(gamelogic));
}

export function loadGame(gameLogic){

}