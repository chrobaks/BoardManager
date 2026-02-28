

export default class CategoryEntity {
    constructor(data) {
        this.id = Number(data.id);
        this.name = data.name;
        this.description = data.description;
        this.version = data.version;
    }
}