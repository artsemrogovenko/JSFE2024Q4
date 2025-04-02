export default abstract class Block<T extends keyof HTMLElementTagNameMap> {
  protected components: Block<keyof HTMLElementTagNameMap>[] = [];
  protected listeners: Record<string, EventHandler[]> = {};
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
  public get getId(): string {
    return this.element.id;
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
    if (index >= 0) {
      const element = this.components[index];
      this.components.slice(index, 1);
      element.destroy();
    }
    return index;
  }

  public setText(text: string): void {
    this.element.textContent = text;
  }

  public setClass(className: string): void {
    this.getNode().className = className;
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
    event: keyof HTMLElementEventMap | string,
    listener: EventListener | EventListenerObject,
    option: boolean = false,
  ): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
    this.element.addEventListener(event, listener, option);
  }

  public removeListener(
    event: keyof HTMLElementEventMap,
    listener: EventListener | EventListenerObject,
    option: boolean = false,
  ): void {
    this.element.removeEventListener(event, listener, option);
    this.listeners[event] = this.listeners[event].filter(
      (listener: EventListener | EventListenerObject) => listener !== listener,
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

  public destroy(): void {
    this.deleteAllBlocks();
    this.removeAllListeners();
    this.element.remove();
  }

  protected setId(_id: string): void {
    this.element.id = _id;
  }
}

export class Container extends Block<'div'> {
  constructor(className: string) {
    super('div', className);
  }
}

export type EventHandler = EventListener | EventListenerObject;
