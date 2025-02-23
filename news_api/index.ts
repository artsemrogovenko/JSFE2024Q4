import App from './components/app/app';
import './global.css';
import './bootstrap.scss';
import { IRequestParameters } from './types/index';
import 'bootstrap';
// import * as bootstrap from 'bootstrap';

const params: IRequestParameters = { apiKey: process.env.API_KEY as string };
const app = new App(params);
app.start();
