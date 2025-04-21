import { Container } from '../../modules/block';
import { Button } from '../../modules/buttons';
import { Form } from '../../modules/form';
import { InputPassword, InputText } from '../../modules/inputs';
import View from '../view';
import { checkForm } from './functions';

export default class Login extends View {
  private form: FormAuth = new FormAuth('auth');
  constructor() {
    super('login');
    this.addBlock(this.form);
  }
}

class FormAuth extends Container {
  private name = new Form(
    'login-name',
    'name',
    new InputText('name-input'),
    'off',
    true,
    'Имя',
  );
  private password = new Form(
    'login-password',
    'password',
    new InputPassword('password-input'),
    'off',
    true,
    'Пароль',
  );
  private submitButton = new Button('btn-login', 'Войти');
  private aboutButton = new Button('about', 'Инфо');

  constructor(className: string) {
    super(className);
    const name = this.name.getInput;
    if (name) {
      name.setAttribute('minlength', '4');
      name.setAttribute('maxlength', '16');
      name.setAttribute('placeholder', 'Введите имя');
    }

    const password = this.password.getInput;
    if (password) {
      password.setAttribute('minlength', '4');
      password.setAttribute('maxlength', '16');
      password.setAttribute('placeholder', 'Введите пароль');
    }
    this.init();
  }

  private init(): void {
    this.addBlocks([
      this.name,
      this.password,
      this.submitButton,
      this.aboutButton,
    ]);
    this.submitButton.addListener('click', (event) =>
      checkForm(event, this.name.getInput, this.password.getInput),
    );
    this.addListener('submit', () => this.submitButton.getNode().click());
  }
}
