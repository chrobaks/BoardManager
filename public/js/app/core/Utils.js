export default class Utils
{
    static collectionLength (collection)
    {
        if (Array.isArray(collection)) {
            return collection.length;
        }
        if (collection instanceof Map || collection instanceof Set) {
            return collection.size;
        }
        if (collection && typeof collection === 'object') {
            return Object.keys(collection).length;
        }
        return 0;
    }

    static indexByKey (collection, key, value)
    {
        if (Utils.collectionLength(collection) > 0 ) {
            if (Array.isArray(collection)) {
                return collection.findIndex(obj => obj?.[key] && obj[key] === value);
            }
        }

        if (collection instanceof Map) {
            const valuesArray = Array.from(collection.values());
            return valuesArray.findIndex(obj => obj?.[key] === value);
        }

        return -1;
    }

    static firstCharUpperCase(str, formateToLowerCase = true) {
        if (typeof str !== 'string') return '';
        str = str.trim();
        if (str === '') return '';
        const baseStr = formateToLowerCase ? str.toLowerCase() : str;
        return `${baseStr.charAt(0).toUpperCase()}${baseStr.slice(1)}`;
    }
}
