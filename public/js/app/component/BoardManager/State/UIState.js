export default class UIState {
    constructor(config) {
        this.mode = config.mode;
        this.activeId = config.activeId;
    }

    showBoard(modeId) {
        this.mode[modeId] = 'board';
        this.activeId[modeId] = null;
    }

    showCategory(id) {
        this.mode['category'] =  'category';
        this.activeId['category'] = id * 1;
    }

    showItem(id) {
        this.mode['item'] =  'item';
        this.activeId['item'] = id * 1;
    }

    isBoardView(modeId) {
        return this.mode[modeId] === 'board';
    }

    isCategoryView() {
        return this.mode['category'] === 'category';
    }

    isItemView() {
        return this.mode['item'] === 'item';
    }

    getActiveId(modeId) {
        return this.activeId[modeId];
    }
}
