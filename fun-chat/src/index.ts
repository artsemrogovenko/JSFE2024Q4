import './styles.css';
import App from './app/spa';
import { AppLogic } from './app/logic';
import { Chat } from './views/main/chat';
import MessagesDB from './views/main/chat/messages-base';
import { UserList } from './views/main/chat/users-block';
import State from './app/state';

export const appState = new State();
export const appLogic = new AppLogic();
new MessagesDB();
new UserList();
new Chat();
new App();
