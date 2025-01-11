class Game{
  mode=null;
  symbols=null;
  round=null;
  pressed=null;
  required=null;
digits=null;
alphabet=null;
gaming=null;
constructor(){
    this.mode="easy";
    this.symbols=2;
    this.round=1;
    this.alphabet=Array.from({length:26},(v,i)=>String.fromCharCode(i+97));
    this.digits=Array.from({length:10},(v,i)=>`${i}`);
    this.mixed=this.digits.concat(this.alphabet);
    this.dictionary={"easy":this.digits,"medium":this.alphabet,"hard":this.mixed}
    this.letters=document.querySelector(".letters");
    this.numbers=document.querySelector(".numbers");
    this.multiButton =document.getElementById("start");
    this.repeatBtn =document.getElementById("repeat");
    this.roundInfo =document.getElementById("round");
    this.misc =document.getElementById("misc");
    this.area=document.querySelector(".panel");
    this.mistakes=0;
    this.easy();
  }

  resetGame(){
    this.symbols=2;
    this.round=1;
    this.pressed=null;
    this.required=null;
    this.mistakes=0;
    this.gaming=false;
    this.helped=false;
  }

  start(){
    this.highlight();
    this.inputAvailable=false;
    this.repeatBtn.classList.remove("invisible");
    this.misc.classList.remove("invisible");
    this.roundInfo.classList.remove("invisible");
    this.roundInfo.textContent=`ROUND ${this.round}`;
    this.multiButton.textContent="New game";
    this.repeatBtn.textContent="Repeat the sequence";
    this.gaming=true;
    this.generateSymbols();
    this.position=0;
    setTimeout(() => {
      this.showSequence();
    }, 500);
  }

  increaseSymbols(){
    this.symbols=this.symbols+2;
  }

  generateSymbols(){
    this.required=new Array(this.symbols).fill();
    const randomElement=(arr)=>{
      let index=Math.floor(Math.random()*arr.length);
     return arr[index];
    }
    switch (this.mode) {
      case "easy":this.required=this.required.map((v)=>randomElement(this.digits));  break;
        case "medium":this.required=this.required.map((v)=>randomElement(this.alphabet));  break;
        case "hard":this.required=this.required.map((v)=>randomElement(this.mixed));  break;
      default:  break;
    }
  }

  get getRequired(){
    return this.required;
  }

  set setMode(input){
    if(!this.gaming){
      this.mode=input;
      switch (input) {
        case "easy": this.easy();break;
        case "medium":this.medium();break;
        case "hard":this.hard();break;
        default: break;
      }
      this.highlight();
    }
   }

   set validateInput(symbol){
    if(this.gaming && this.inputAvailable){
    let currentSymbol=this.required[this.position];

    if(symbol==="repeat"){
      if(this.goNext){
        this.start();
      }else{
        this.repeatSequence();
        return;
      }
    }

    if(this.dictionary[this.mode].includes(symbol)){
      this.area.textContent=this.area.textContent+symbol;
      if(currentSymbol===symbol.toLowerCase()){
        this.position+=1;
      }else{
        this.mistakes+=1;
        this.position=0;
      }
    }
    if(this.mistakes===1){
      setTimeout(() => {
        this.inputAvailable=false;
        this.area.textContent="~ERROR~";
      }, 0);
      setTimeout(() => {
        this.inputAvailable=true;
        this.area.textContent="";
        }, 1000);
    }
    if(this.mistakes===2){
      this.gameOver();
    }
    if(this.position===this.required.length){
      setTimeout(() => {
        this.area.textContent="";
        this.roundWin();
      }, 500);
    }
    }
   }

   roundWin(){
    if(this.round===5){
      this.gaming==false;
      this.congratulate();
      return;
    }
    this.goNext=true;
    this.increaseSymbols();
    this.repeatBtn.textContent="Next";
    this.repeatBtn.classList.remove("invisible");
    this.round+=1;
    // this.start();
   }

  easy(){
    this.letters.classList.add("invisible");
    this.numbers.classList.remove("invisible");
  }
  medium(){
    this.letters.classList.remove("invisible");
    this.numbers.classList.add("invisible");
  }
  hard(){
    this.letters.classList.remove("invisible");
    this.numbers.classList.remove("invisible");
  }

  showSequence(){
    this.inputAvailable=false;
    setTimeout(() => {
    this.area.textContent="";
    }, 0);
    for (let index = 0; index < this.required.length; index++) {
      const element = this.required[index];
      const button=document.getElementById(element);
      setTimeout(() => {
        button.classList.add("pressed");
        setTimeout(() => {
          button.classList.remove("pressed");
        },500);
        this.area.textContent=this.area.textContent+element;
      }, 500*index+1);
    }
    setTimeout(() => {
      this.area.textContent="";
      this.inputAvailable=true;
    }, 500*this.required.length);
  }

  repeatSequence(){
    if(!this.helped){
      this.showSequence();
      this.helped=true;
      this.repeatBtn.classList.add("invisible");
    }
  }
  gameOver(){
    this.resetGame();
    this.area.textContent="Game Over";
  }
  congratulate(){}

  highlight(){
    let [easy,medium,hard]=document.querySelector(".menu").childNodes;
    switch (this.mode) {
      case 'easy':
        easy.classList.add("active");
        medium.classList.remove("active");
        hard.classList.remove("active");
        break;
      case 'medium':
        easy.classList.remove("active");
        medium.classList.add("active");
        hard.classList.remove("active");
        break;
      case 'hard':
        easy.classList.remove("active");
        medium.classList.remove("active");
        hard.classList.add("active");
        break;
      default:
        break;
    }
  }
}

export {Game};