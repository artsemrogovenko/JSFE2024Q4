import Block from "./element.js";

export default class PopUp{
  #scoreBlock;
  #messageContainer;
  #messageWindow;
  #table;
  #tbody;
  constructor(){
    this.#initMessage();
    this.#initTable();
  }

  getMsgWindow(){
    return this.#messageContainer.getNode();
  }
  getScoreBlock(){
    return this.#scoreBlock.getNode();
  }

  #initMessage(){
    this.#messageContainer=new Block("div","message_container");

    this.#messageWindow=new Block("div","message_window");
    this.#messageWindow.setId("message_window");
    this.#messageWindow.addBlock(new Block("p"));

    this.#messageContainer.addBlock(this.#messageWindow);
    this.#messageContainer.getNode().addEventListener("click",()=>{
    this.#messageContainer.getNode().classList.remove("visible");
    });
  }

  #initTable(){
    this.#scoreBlock=new Block("div","tablePanel");
    this.#scoreBlock.setId("tablePanel");

    this.#table = new Block("table","tableScore");
    this.#table.addBlock(new Block("caption","titleTable","Top 5 Score"));
    const tableHeader = new Block("thead");
    tableHeader.addBlock(this.#createTR("Level","Nonogram","Time","td"));
    this.#table.addBlock(tableHeader);

    this.#tbody = new Block("tbody");
    this.#table.addBlock(this.#tbody);
    this.#scoreBlock.addBlock(this.#table);
  }

  #createTR(difficulty,nonogramName,time,type="tr"){
    const tr=new Block("tr");
    tr.addBlock(new Block(type,"",difficulty));
    tr.addBlock(new Block(type,"",nonogramName));
    tr.addBlock(new Block(type,"",time));
    return tr;
  }

  saveResult(difficulty,nonogram,timeData){
    let time =(parseInt(timeData[0])*60) + parseInt(timeData[1]);
    let msg = `Great! You have solved the nonogram in ${time} seconds!`;
    // let msg = "Great! You have solved the nonogram in ";
    // if(timeData[0]!=="00"){
    //   msg=msg+` ${timeData[0]} minutes`;
    // }
    // msg= msg+` ${timeData[1]} seconds!`;
    this.#messageWindow.getComponents()[0].getNode().innerText=msg;
    this.#messageContainer.getNode().classList.add("visible");

    this.#tbody.addBlock(this.#createTR(difficulty,nonogram,timeData.join(":"),"td"));
  }

  showScore(bg){
    bg.getNode().classList.add("visible");
    setTimeout(()=>{
      this.#scoreBlock.getNode().classList.add("visible");
      setTimeout(()=>{
        this.#scoreBlock.getNode().classList.add("move_tablePanel");
      },800);
    },0);
  }

  hideScore(bg){
    bg.getNode().classList.remove("visible");
    this.#scoreBlock.getNode().classList.remove("visible");
    this.#scoreBlock.getNode().classList.remove("move_tablePanel");
  }

}

