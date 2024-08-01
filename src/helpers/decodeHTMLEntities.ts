import he from 'he';

export default function decodeHTMLEntities(text: string): string {
    return he.decode(text);
}
