import Block from '../modules/block';

export default class View extends Block<'main'> {
  constructor(className: string) {
    super('main', className);
  }
}
