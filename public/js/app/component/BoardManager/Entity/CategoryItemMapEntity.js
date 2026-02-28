
export default class CategoryItemMapEntity {
    constructor(data) {
        this.id = Number(data.id);
        this.category_id = Number(data.category_id);
        this.item_id = Number(data.item_id);
    }
}