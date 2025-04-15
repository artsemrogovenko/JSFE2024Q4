import Block from '../../modules/block';

export default class Footer extends Block<'section'> {
  private logo = document.createElement('a');
  private github = document.createElement('a');
  private year = document.createElement('p');
  constructor() {
    super('section', 'footer');
    this.logo.href = 'https://rs.school/';
    this.github.href = 'https://github.com/artsemrogovenko';
    this.year.textContent = '2025';

    this.logo.className = 'logo';
    this.github.className = 'profile';

    this.element.append(this.logo, this.github, this.year);
  }
}
