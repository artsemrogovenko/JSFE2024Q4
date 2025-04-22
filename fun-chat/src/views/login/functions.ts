import { appLogic } from '../..';
import { Form, Paragraph } from '../../modules/form';
import type { Input, InputPassword, InputText } from '../../modules/inputs';

export function checkForm(
  event: Event,
  formName: Form<InputText>,
  formPassword: Form<InputPassword>,
): void {
  const target = event.target;
  const name = formName.getInput;
  const password = formPassword.getInput;
  if (checkPasswordInput(password) && checkNameInput(name)) {
    if (target instanceof HTMLButtonElement) {
      appLogic.createSocket(name.getValue(), password.getValue());
    }
  }
}

export const minlength = 4;
export const maxlength = 16;

export const emptyChars = '^\\S(.*\\S)?$';
export const specialChars = '!@#$%^&*';
const specialPattern = new RegExp(`.*[${specialChars}].*`);

function hasEmptySymbol(value: string): boolean {
  const pattern = new RegExp('[\\s\\t]');
  return pattern.test(value);
}

function noEmptySide(value: string): boolean {
  const pattern = new RegExp('^\\S(.*\\S)?$');
  return pattern.test(value);
}

function includeSpecial(value: string, passwordHint?: Paragraph): boolean {
  const result = specialPattern.test(value);
  if (!result) {
    passwordHint?.setText(
      'Пароль должен содержать cпецсимвол. Доступны !@#$%^&*',
    );
  }
  return specialPattern.test(value);
}

function checkLength(input: Input, Hint?: Paragraph): boolean {
  const value = input.getValue();
  if (value.length >= minlength && value.length <= maxlength) {
    Hint?.setText('');
    return true;
  } else {
    Hint?.setText(
      `Количество символов от ${minlength} до ${maxlength}. Сейчас ${value.length}`,
    );
  }
  return false;
}

export function checkNameInput(
  input: InputText,
  nameHint?: Paragraph,
): boolean {
  const inputValue = input.getValue();
  if (noEmptySide(inputValue)) {
    return checkLength(input, nameHint);
  } else {
    nameHint?.setText('Не должно быть пустых симполов в начале и/или в конце');
  }
  return false;
}

export function checkPasswordInput(
  input: InputPassword,
  passwordHint?: Paragraph,
): boolean {
  const inputValue = input.getValue();
  if (!hasEmptySymbol(inputValue)) {
    if (checkLength(input, passwordHint)) {
      return includeSpecial(inputValue, passwordHint);
    }
  } else {
    passwordHint?.setText('Не должно быть пустых симполов');
  }
  return false;
}
