export default abstract class Block<T extends keyof HTMLElementTagNameMap> {
  protected components: Block<keyof HTMLElementTagNameMap>[] = [];
  protected listeners: Record<string, EventListener[]> = {};
  protected element: HTMLElementTagNameMap[T];

  constructor(tag: T, classN: string = '', text: string = '') {
    const element = document.createElement(tag);
    if (classN) {
      element.className = classN;
    }
    if (text) {
      element.textContent = text;
    }
    this.element = element;
  }

  public addBlocks(collection: Block<keyof HTMLElementTagNameMap>[]): void {
    collection.forEach((block) => this.addBlock(block));
  }

  public addBlock(block: Block<keyof HTMLElementTagNameMap>): void {
    this.components.push(block);
    this.element.append(block.getNode());
  }

  public deleteBlock(block: Block<keyof HTMLElementTagNameMap>): number {
    const index = this.components.indexOf(block);
    if (index !== -1) {
      const element = this.components[index];
      this.components.slice(index, 1);
      element.destroy();
    }
    return index;
  }

  protected setId(_id: string): void {
    this.element.id = _id;
  }

  public setText(text: string): void {
    this.element.textContent = text;
  }

  public deleteAllBlocks(): void {
    this.components.forEach((child) => {
      child.destroy();
    });
    this.components = [];
  }

  public getNode(): HTMLElement {
    return this.element;
  }

  public addListener(
    event: string,
    listener: EventListener,
    option: boolean = false,
  ): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
    this.element.addEventListener(event, listener, option);
  }

  public removeListener(
    event: string,
    listener: EventListener,
    option: boolean = false,
  ): void {
    this.element.removeEventListener(event, listener, option);
    this.listeners[event] = this.listeners[event].filter(
      (l: EventListener) => l !== listener,
    );
  }

  public removeAllListeners(): void {
    for (const event in this.listeners) {
      this.listeners[event].forEach((listener) => {
        this.element.removeEventListener(event, listener);
      });
    }
    this.listeners = {};
  }

  public getComponents(): Block<keyof HTMLElementTagNameMap>[] {
    return this.components;
  }

  protected destroy(): void {
    this.deleteAllBlocks();
    this.removeAllListeners();
    this.element.remove();
  }
}

export class Container extends Block<'div'> {
  constructor(className: string) {
    super('div', className);
  }
}
