// @ts-ignore
import * as rssParser from 'react-native-rss-parser';
import {atom} from "recoil";

export const newsListState = atom({
    key: 'news',
    default: [] as INewsItem[]
});

export interface INewsSourceMeta {
    title: string,
    image: string
}

export interface INewsItem {
    title: string,
    desc: string,
    url: string,
    image: string,
    date: Date,
    source: INewsSourceMeta
}

export function sortNewsByDate(news: INewsItem[]) {
    if(!news?.length) {
        return news;
    }

    return news.sort((a, b) => {
        const aNum = a.date?.getTime();
        const bNum = b.date?.getTime();

        if(aNum < bNum) {
            return 1;
        } else if (aNum > bNum){
            return -1;
        }

        return 0;
    });
}

/**
 * Получить и распарсить RSS-ленту по ссылке
 * @param url
 */
export async function fetchRSS(url: string): Promise<Array<INewsItem>> {
    const rss = await fetch(url)
        .then((response) => response.text())
        .then((responseData) => rssParser.parse(responseData));

    if(!rss) {
        return [];
    }

    const source = {
        title: rss?.title || url,
        image: rss?.image.url || null,
    };

    // @ts-ignore
    return rss.items?.map((i) => {
        /**
         * Подтягивание наиболее подходящей картинки к новости
         */
        let image = i.imageUrl;
        if(!image && i.enclosures) {
            for(let e of i.enclosures) {
                if(e.mimeType?.includes('image')) {
                    image = e.url;
                    break;
                }
            }
        }

        return (
            {
                title: i.title,
                desc: i.content || i.description || i.title,
                image: image || null,
                url: i.links?.length ? i.links[0].url : null,
                source: source,
                date: i.published ? new Date(i.published) : null
            }
        );
    });
}
