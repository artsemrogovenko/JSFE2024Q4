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
    this.multiButton =document.querySelector(".start");
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
  }

  start(){
    this.gaming=true;
    this.generateSymbols();
    this.position=0;
    this.showSequence();
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
    }
   }

   set validateInput(symbol){
    let currentSymbol=this.required[this.position];

    if(this.dictionary[this.mode].includes(currentSymbol)){
      if(currentSymbol===symbol.toLowerCase()){
        this.position+=1;
      }else{
        this.mistakes+=1;
        this.position=0;
      }
    }
    if(this.mistakes==1){
      repeatSequence();
    }
    if(this.mistakes==2){
      gameOver();
    }
   }

   roundWin(){
    if(this.round===5){
      this.gaming==false;
      congratulate();
    }
    increaseSymbols();
    this.round+=1;
    start();
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
    }, 500*this.required.length);
  }

  repeatSequence(){}
  gameOver(){}
  congratulate(){}
}

export {Game};