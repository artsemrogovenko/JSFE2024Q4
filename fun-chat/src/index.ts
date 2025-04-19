import './styles.css';
import App from './app/spa';
import { AppLogic } from './app/logic';
import { Chat } from './views/main/chat';
import MessagesDB from './views/main/chat/messages-base';

export const appLogic = new AppLogic();
new MessagesDB();
new Chat();
new App();
