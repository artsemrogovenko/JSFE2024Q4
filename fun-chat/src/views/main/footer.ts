import Block from '../../modules/block';
import { Anchor, Paragraph } from '../../modules/form';

export default class Footer extends Block<'section'> {
  private logo = new Anchor('logo');
  private github = new Anchor('profile');
  private year = new Paragraph('year', '2025');
  constructor() {
    super('section', 'footer');
    this.logo.setAttribute('href', 'https://rs.school/');
    this.github.setAttribute('href', 'https://github.com/artsemrogovenko');

    this.logo.setText('RS School');
    this.github.setText('artsemrogovenko');

    this.addBlocks([this.logo, this.github, this.year]);
    this.setId('footer');
  }
}
