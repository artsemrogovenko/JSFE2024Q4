import App from './components/app/app';
import './global.css';
import './bootstrap.scss';
import { IRequestParameters } from './types/index';
import 'bootstrap';
// import * as bootstrap from 'bootstrap';

const params: IRequestParameters = { endpoint: 'everything', options: {}, apiKey: process.env.API_KEY as string };
const app = new App(params);
app.start();

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('filters') as HTMLFormElement;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const arrayOfValues = Object.entries(data);
        const request: Record<string, string> = {};
        arrayOfValues.forEach((element) => {
            const key = element[0] as string;
            if (key === 'endpoints') {
                params.endpoint = data.endpoints as 'everything' | 'top-headlines' | 'sources';
            } else if (key === 'searchIn') {
                if ((data['q'] as string).trim() !== '') {
                    const searchInValues = formData.getAll('searchIn') as string[];
                    request[key] = searchInValues.join(',');
                }
            } else {
                const value = element[1];
                if (value) {
                    request[key] = element
                        .filter((value, index) => index !== 0)
                        .map((value) => value.toString().trim())
                        .toString();
                }
            }
        });

        const result: Record<string, string> = {};
        Object.entries(request).forEach(([key, value]) => {
            const trimmed = value.toString().trim();
            if (key !== 'endpoints') {
                result[key] = trimmed;
            }
        });

        params.options = result;
        update(params);
    });
});

function update(request: IRequestParameters) {
    app.updateNews(request);
}

const toTopButtons = document.querySelectorAll('.toUp') as NodeListOf<HTMLButtonElement>;
const closeMenu = document.querySelector('[data-bs-dismiss="offcanvas"]') as HTMLButtonElement;
toTopButtons.forEach((button) => button.addEventListener('click', () => clickElement(closeMenu)));

window.addEventListener('scroll', (): void => {
    const navbar = document.querySelector('.navbar') as HTMLElement;
    if (window.scrollY > 300) {
        navbar.classList.add('fixed-top');
        toTopButtons.forEach((button) => button.classList.remove('invisible'));
    } else {
        toTopButtons.forEach((button) => button.classList.add('invisible'));
        navbar.classList.remove('fixed-top');
    }
});

function clickElement(called: HTMLElement): void {
    called.click();
}

window.addEventListener('submit', () => {
    if (window.innerWidth < 530) {
        clickElement(closeMenu);
    }
});
