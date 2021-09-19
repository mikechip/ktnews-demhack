export function stripTags(text: string): string {
    if(!text?.length) {
        return '';
    }

    const regex = /(<([^>]+)>)/ig;

    return text
        .replace(/(<br>)|(<p><\/p>)/g, '\n\n')
        .replace(/<a\b[^>]*>(.*?)<\/a>/i,'')
        .replace(regex, '').trim();
}
