import './news.css';

type newsItem = {
    author: string | null;
    content: string;
    description: string;
    publishedAt: string;
    source: {
        id: string;
        name: string;
    };
    title: string;
    url: string;
    urlToImage: string;
};
class News {
    draw(data: newsItem[]): void {
        const news = data.length >= 10 ? data.filter((_item: newsItem, idx: number) => idx < 10) : data;

        const fragment: DocumentFragment = document.createDocumentFragment();
        const newsItemTemp = document.querySelector('#newsItemTemp') as HTMLTemplateElement;

        news.forEach((item: newsItem, idx: number) => {
            const newsClone = newsItemTemp.content.cloneNode(true) as HTMLTemplateElement;
            if (idx % 2) {
                const newsItem = newsClone.querySelector('.news__item') as HTMLElement;
                newsItem.classList.add('alt');
            }

            const photo = newsClone.querySelector('.news__meta-photo') as HTMLElement;
            photo.style.backgroundImage = `url(
                ${item.urlToImage || 'img/news_placeholder.jpg'})`;

            const author = newsClone.querySelector('.news__meta-author') as HTMLElement;
            author.textContent = item.author || item.source.name;

            const date = newsClone.querySelector('.news__meta-date') as HTMLElement;
            date.textContent = item.publishedAt.slice(0, 10).split('-').reverse().join('-');

            const title = newsClone.querySelector('.news__description-title') as HTMLElement;
            title.textContent = item.title;

            const source = newsClone.querySelector('.news__description-source') as HTMLElement;
            source.textContent = item.source.name;

            const description = newsClone.querySelector('.news__description-content') as HTMLElement;
            description.textContent = item.description;

            const more = newsClone.querySelector('.news__read-more a') as HTMLElement;
            more.setAttribute('href', item.url);

            fragment.append(newsClone);
        });

        const newsBlock = document.querySelector('.news') as HTMLElement;
        newsBlock.innerHTML = '';
        newsBlock.appendChild(fragment);
    }
}

export default News;
