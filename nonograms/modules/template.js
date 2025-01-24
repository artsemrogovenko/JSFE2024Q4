class Template {
  #templates = { easy: [], medium: [], hard: [] };
  #currentTemplate;

  getTemplate(){
    return this.#currentTemplate;
  }

  selectTemplate(difficulty="easy",position=null){
   if( position===null){
     let index=Math.floor(Math.random()*this.#templates[difficulty].length);
     this.#currentTemplate=this.#templates.difficulty[index];
    }else{
      this.#currentTemplate=this.#templates.difficulty[position];
    }
  }

  showTemplates(difficulty){
    return this.#templates[difficulty];
  }
  setRandom(){
    let difficulty=  Object.keys(this.#templates)[Math.floor(Math.random()*3)];
    let template= Math.floor(Math.random()*this.#templates[difficulty].length);
    this.#currentTemplate=this.#templates[difficulty][template];
  }
}
