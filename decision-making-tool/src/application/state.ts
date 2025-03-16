export default class State {
  private keyStorage = 'artsemrogovenko-JSFE2024Q4';
  private state: Map<string, string>;
  constructor() {
    this.state = this.readStorage();
    window.addEventListener('beforeunload', this.saveState.bind(this));
  }

  public setValue(name: string, value: string): void {
    this.state.set(name, value);
  }

  public getValue(name: string): string {
    if (this.state.has(name)) {
      const result = this.state.get(name) ?? '';
      return result;
    }
    return '';
  }

  private saveState(): void {
    const obj = Object.fromEntries(this.state.entries());
    localStorage.setItem(this.keyStorage, JSON.stringify(obj));
  }

  private readStorage(): Map<string, string> {
    const storageData = localStorage.getItem(this.keyStorage);
    if (storageData) {
      const parsedObj = JSON.parse(storageData);
      return new Map(Object.entries(parsedObj));
    }
    return new Map();
  }
}
