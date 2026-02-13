import Utils from '../../../core/Utils.js';

export default class CommitStore {
    constructor() {
        this.queue = [];
        this.revertList = [];
        this.queueChange = false;
    }

    add(entry) {
        const lengthBefore = this.queue.length;
        this.queue.push(entry);
        this.queueChange =  (lengthBefore < this.queue.length);
        return this.queueChange;
    }

    all() {
        return this.queue;
    }

    length() {
        return this.queue.length;
    }

    clear() {
        this.queue = [];
    }

    hasCommits() {
        return this.queue.length > 0;
    }

    hasChanges() {
        return this.queueChange;
    }

    setRevertList(undoIndexList) {
        this.revertList = [];
        try {
            if (!undoIndexList?.length) {
                return [];
            }
            const newQueue = [];

            this.queue.forEach((entry, index) => {
                if (entry.cache && !Utils.collectionLength(entry.cache)) {return;}
                if (undoIndexList.includes(index)) {
                    newQueue.push(entry);
                }
            });
            this.revertList = [...newQueue].reverse();
        } catch (e) {
            console.error('ERROR:CommitStore:deleteByIndex', e);
        }
        return this.revertList.length;
    }

    getRevertByIndex(index) {
        return this.revertList?.[index] ?? null;
    }

    deleteByIndex(undoIndexList) {
        try {
            if (!undoIndexList?.length) {
                return;
            }
            const newQueue = [];

            this.queue.forEach((entry, index) => {
                if (!undoIndexList.includes(index)) {
                    newQueue.push(entry);
                }
            });
            this.queue = newQueue;
        } catch (e) {
            console.error('ERROR:CommitStore:deleteByIndex', e);
        }
    }
}
