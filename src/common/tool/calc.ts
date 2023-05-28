export function parseUrlQuery(url: string) {
    const query: { [key: string]: string } = {};
    if (url.indexOf('?') > -1) {
        const queryStr = url.split('?')[1];
        queryStr.split('&').forEach(q => {
            const [key, value] = q.split('=');
            query[key] = value;
        });
    }
    return query;
}