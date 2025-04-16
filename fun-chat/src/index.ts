import './styles.css';
import App from './app/spa';
import { AppLogic } from './app/logic';

export const appLogic = new AppLogic();
new App();
