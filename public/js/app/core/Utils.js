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
            return collection.findIndex(obj => obj?.[key] && obj[key] === value );
        }

        return -1;
    }
}