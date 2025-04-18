import './styles.css';
import App from './app/spa';
import { AppLogic } from './app/logic';
import State from './app/state';

export const appState = new State();
export const appLogic = new AppLogic();
new App();
