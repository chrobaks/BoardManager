export default class IdService {
    constructor(importDataJson) {
        this.index = this.getMaxId(importDataJson);
    }

    next() {
        this.index += 1;
        return this.index;
    }

    set(index) {
        this.index = index;
    }

    current() {
        return this.index;
    }

    getMaxId(list = []) {
        return list.reduce(
            (max, obj) => (obj.id > max ? obj.id : max),
            0
        );
    }
}
