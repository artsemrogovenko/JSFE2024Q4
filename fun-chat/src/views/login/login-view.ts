import { pushState } from '../../app/router';
import { Container } from '../../modules/block';
import { Button } from '../../modules/buttons';
import { Form, Paragraph } from '../../modules/form';
import { disableClick, preventDefault } from '../../modules/functions';
import { InputPassword, InputText } from '../../modules/inputs';
import View from '../view';
import { checkForm, maxlength, minlength, specialChars } from './functions';

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
  private nameHint = new Paragraph('name-Hint');
  private passwordHint = new Paragraph('password-Hint');
  private nameInput = this.name.getInput;
  private passwordInput = this.password.getInput;

  private submitButton = new Button('btn-login', 'Войти');
  private aboutButton = new Button('about', 'Инфо');

  constructor(className: string) {
    super(className);
    const name = this.name.getInput;
    if (name) {
      name.setAttribute('minlength', `${minlength}`);
      name.setAttribute('maxlength', `${maxlength}`);
      name.setAttribute('placeholder', 'Введите имя');
    }

    const password = this.password.getInput;
    if (password) {
      password.setAttribute('minlength', `${minlength}`);
      password.setAttribute('maxlength', `${maxlength}`);
      password.setAttribute('placeholder', 'Введите пароль');
      password.setAttribute('pattern', `.*[${specialChars}].*`);
    }
    this.addBlocks([
      this.name,
      this.nameHint,
      this.password,
      this.passwordHint,
      this.submitButton,
      this.aboutButton,
    ]);
    this.aboutButton.addListener('click', () => pushState('about'));
    disableClick(this.submitButton);
    this.addListener('submit', (event) => {
      preventDefault(event);
      this.submitButton.getNode().click();
    });
    this.init();
  }

  private init(): void {
    this.submitButton.addListener('click', (event) =>
      checkForm(
        event,
        this.name,
        this.password,
        this.nameHint,
        this.passwordHint,
        this.submitButton,
      ),
    );
    this.nameInput.addListener('input', (event) => {
      checkForm(
        event,
        this.name,
        this.password,
        this.nameHint,
        this.passwordHint,
        this.submitButton,
      );
      if (this.nameInput.getValue() === '') {
        this.nameHint.setText('');
      }
    });
    this.passwordInput.addListener('input', (event) => {
      checkForm(
        event,
        this.name,
        this.password,
        this.nameHint,
        this.passwordHint,
        this.submitButton,
      );
      if (this.passwordInput.getValue() === '') {
        this.passwordHint.setText('');
      }
    });
  }
}
