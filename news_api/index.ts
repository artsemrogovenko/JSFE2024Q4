import App from './components/app/app';
import './global.css';
import { IRequestParameters } from './types/index';

const params: IRequestParameters = { apiKey: process.env.API_KEY as string };
const app = new App(params);
app.start();
