import csv from '../assets/predefined';
import {atom} from "recoil";

export interface INewsSource {
    title: string,
    region: string,
    icon: string,
    url: string,
    rss: string
}

export const newsSourcesState = atom({
    key: 'sources',
    default: [] as INewsSource[]
});

/**
 * Прочитать список предустановленных СМИ из файла и внести в БД, если их там ещё нет
 */
export async function parseAndAssignSources(): Promise<INewsSource[]> {
    return csv?.split('\n').map((l: string) => {
        const v: string[] = l.trim().split('\t');
        return {
            title: v[0] || v[3] || '',
            region: v[1],
            icon: v[2],
            url: v[3],
            rss: v[4]
        };
    }).filter(s => s.title?.length > 0);
}
