import Block from "./element.js";

export default class Layout{
  #mainBlock= new Block("div","main");
  #imageBlock=new Block("div","image");
  #menuBlock=new Block("div","menu");
  #topTips=new Block("div","top_tips");
  #leftTips=new Block("div","left_tips");
  #cells=new Block("div","cell_container");

  constructor(){
    this.#mainBlock.addBlock(this.#imageBlock);
    this.#mainBlock.addBlock(this.#topTips);
    this.#mainBlock.addBlock(this.#leftTips);
    this.#mainBlock.addBlock(this.#cells);

    document.body.append(this.#menuBlock.getNode());
    document.body.append(this.#mainBlock.getNode());
    this.#mainBlock.addListener('contextmenu', function noContext(event){event.preventDefault()});
  }

  createRowsAndColumns(size){
    this.#createRow(size);
    this.#createCol(size);
    this.#createCells(size);
  }

  #createRow(size){
    for (let index = 0; index < size; index++) {
      const element= new Block("div","left_tip");
      if((index+1)%5===0 && index!==(size-1)){
        element.getNode().classList.add("horizontal_bold_line");
      }
      element.setId(`row${index}`);
      this.#leftTips.addBlock(element);
    }
  }

  #createCol(size){
    for (let index = 0; index < size; index++) {
      const element= new Block("div","top_tip");
      if((index+1)%5===0 && index!==(size-1)){
        element.getNode().classList.add("vertical_bold_line");
      }
      element.setId(`col${index}`);
      this.#topTips.addBlock(element);
    }
  }

  #createCells(size){
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const element = new Block("div","cell");

        if((j+1)%5===0 && j!==(size-1)){
          element.getNode().classList.add("vertical_bold_line");
        }

        if((i+1)%5===0 && i!==(size-1)){
          element.getNode().classList.add("horizontal_bold_line");
        }
        element.setId(`${i},${j}`);

        const elementClasslist= element.getNode().classList;
        element.addListener('click',()=>{elementClasslist.toggle("dark_cell");
        elementClasslist.remove("cross_cell")});

        element.addListener('contextmenu',()=>{elementClasslist.toggle("cross_cell");
        elementClasslist.remove("dark_cell")});

        this.#cells.addBlock(element);
      }
    }
  }
}