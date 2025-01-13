class Game{
  mode=null;
  symbols=null;
  round=null;
  pressed=null;
  required=null;
digits=null;
alphabet=null;
gaming=null;
buttons = document.querySelectorAll("button");
globalStyles=document.documentElement.style;
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
    this.inputAvailable=true;
    this.easy();
    this.highlight();
    this.win=false;
  }

  resetGame(){
    this.enableSelectors();
    this.symbols=2;
    this.round=1;
    this.pressed=null;
    this.required=null;
    this.mistakes=0;
    this.gaming=false;
    this.helped=false;
    this.multiButton.textContent==="New game";
    this.multiButton.textContent="START";
    this.globalStyles.setProperty("--misc-display","none");
    this.area.textContent="";
    this.inputAvailable=true;
    this.win=false;
  }

  start(){
    if(this.inputAvailable){
    this.disableSelectors();
    this.highlight();
    this.inputAvailable=false;
    this.repeatBtn.classList.remove("invisible");
    this.globalStyles.setProperty("--misc-display","flex");
    this.roundInfo.classList.remove("invisible");
    this.roundInfo.textContent=`ROUND ${this.round}`;
    this.multiButton.textContent="New game";
    this.repeatBtn.textContent="Repeat the sequence";
    this.helped=false;
    this.goNext=false;
    this.mistakes=0;
    this.gaming=true;
    this.generateSymbols();
    this.position=0;
    setTimeout(() => {
      this.showSequence();
    }, 500);
    }
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

  get inputIsAvailable(){
    return this.inputAvailable;
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
    if(symbol==="start"){
      if(this.inputAvailable){
      if(this.multiButton.textContent==="New game"){
        this.resetGame();
        return;
      }else{
        this.start();
      }
    }else{
      if(this.win || this.goNext){
        this.resetGame();
        return;
      }
      if(this.mistakes > 0){
        this.resetGame();
      }
    }
    }

    if(this.gaming && symbol==="repeat" && !this.inputAvailable){
      if(!this.goNext){
        this.repeatSequence();
      }else{
        this.inputAvailable=true;
        this.start();
      }
    }

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

    if(this.dictionary[this.mode].includes(symbol) && !this.goNext){
      this.area.textContent=this.area.textContent+symbol;
      if(currentSymbol===symbol.toLowerCase()){
        this.position+=1;

        if(this.position===this.required.length){
          setTimeout(() => {
            this.area.textContent="";
            this.roundWin();
          }, 500);
        }
        return;
      }else{
        this.mistakes+=1;
        this.position=0;
      }
      
    if((this.mistakes===2 && !this.goNext)||(this.mistakes===1 && !this.goNext && this.helped)){
      this.gameOver();
      return;
    }
    if(this.mistakes===1 && !this.goNext){
        this.inputAvailable=false;
        this.area.textContent="~ERROR~";
    }

    }
    }
   }

   roundWin(){
     this.inputAvailable=false;
    if(this.round===5){
      this.repeatBtn.classList.add("invisible");
      this.win=true;
      this.congratulate();
      return;
    }
    this.area.textContent="well done";
    this.goNext=true;
    this.increaseSymbols();
    this.repeatBtn.textContent="Next";
    this.repeatBtn.classList.remove("invisible");
    this.round+=1;
    this.mistakes=0;
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
    console.log(this.required);
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
      this.position=0;
      this.helped=true;
      this.repeatBtn.classList.add("invisible");
    }
  }
  gameOver(){
    this.gaming=false;
    this.area.textContent="Game Over";
    this.repeatBtn.classList.add("invisible");
    this.inputAvailable=false;
  }
  congratulate(){
    this.area.textContent="You Win!";
    // this.resetGame();
  }

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

  disableSelectors(){
    this.buttons[0].style="pointer-events: none";
    this.buttons[1].style="pointer-events: none";
    this.buttons[2].style="pointer-events: none";
  }

  enableSelectors(){
    this.buttons[0].style="pointer-events: all";
    this.buttons[1].style="pointer-events: all";
    this.buttons[2].style="pointer-events: all";
  }
}

export {Game};