import { appLogic } from '../..';
import type { Input } from '../../modules/inputs';

export function checkForm(event: Event, name: Input, password: Input): void {
  const target = event.target;
  const nameLength = name.getValue().length;
  const passwordLength = name.getValue().length;
  const minlength = 4;
  const maxlength = 16;
  if (target instanceof HTMLButtonElement) {
    if (nameLength >= minlength && nameLength <= maxlength) {
      if (passwordLength >= minlength && passwordLength <= maxlength) {
        if (
          name.getValue().trim() !== '' &&
          password.getValue().trim() !== ''
        ) {
          appLogic.createSocket(name.getValue(), password.getValue());
        }
      }
    }
  }
}
