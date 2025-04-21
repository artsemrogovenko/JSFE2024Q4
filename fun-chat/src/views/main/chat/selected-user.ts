import { Container } from '../../../modules/block';

export default class SelectedUser extends Container {
  private selectedName = new Container('selected');
  private isOnline = new Container('status');
  constructor() {
    super('selected-user');
    this.addBlocks([this.selectedName, this.isOnline]);
  }

  public get getName(): string {
    return this.selectedName.getNode().textContent ?? '';
  }

  public set status(online: boolean) {
    switch (online) {
      case true:
        this.isOnline.addClass('online');
        this.isOnline.setText('в сети');
        break;
      default:
        this.isOnline.removeClass('online');
        this.isOnline.setText('не в сети');
        break;
    }
  }

  public set name(name: string) {
    this.selectedName.setText(name);
  }
  public reset(): void {
    this.name = '';
    this.isOnline.removeClass('online');
    this.isOnline.setText('');
  }
}
