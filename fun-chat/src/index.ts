import './styles.css';
import App from './app/spa';
import { AppLogic } from './app/logic';
import Messages from './modules/messages';

export const appLogic = new AppLogic();
new Messages();
new App();
