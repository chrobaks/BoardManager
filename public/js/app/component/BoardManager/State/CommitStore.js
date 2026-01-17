export default class CommitStore {
    constructor() {
        this.queue = [];
    }

    add(entry) {
        this.queue.push(entry);
    }

    all() {
        return this.queue;
    }

    clear() {
        this.queue = [];
    }

    hasChanges() {
        return this.queue.length > 0;
    }
}
