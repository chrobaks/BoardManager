export default class CommitView {
    /**
     *
     * @param container
     * @param templateService
     */
    constructor(container, templateService) {
        this.container = container;
        this.templateService = templateService;
    }

    init () {
        this.listBoard = this.container.querySelector('.commit-list-board');
        this.btnCommitCtrl = this.container.querySelectorAll('.btn-commit-ctrl');
        this.alertBoard = this.container.querySelector('.commit-alert-board');
        this.autoCommitSwitch = this.container.querySelector('#switchAutoCommit');
    }

    showCommitCtrl(hasChanges) {
        if (this.btnCommitCtrl) {
            if (hasChanges) {
                this.btnCommitCtrl.forEach(btn => btn.removeAttribute('disabled'));
            } else {
                this.btnCommitCtrl.forEach(btn => {
                    if (!btn.hasAttribute('disabled')) {
                        btn.setAttribute('disabled',true);
                    }
                });
            }
        }
    }

    showListBoard (show) {
        this.showBoard(this.listBoard, show);
    }

    showAlertBoard(show) {
        this.showBoard(this.alertBoard, show, 'show-not');
    }

    showBoard (board, show, selector = 'd-none') {
        if (!board) return;
        if (!show) {
            board.classList.add(selector);
        } else if (show && board.classList.contains(selector)) {
            board.classList.remove(selector);
        }
    }

    autoCommitSwitchIsChecked() {
        return this.autoCommitSwitch ? this.autoCommitSwitch.checked : false;
    }

    changeDeleteAllSwitchCheck(check) {
        this.listBoard.querySelector('#selectAllCommitItems').checked = check;
    }

    changeUndoCommitSwitch(check) {
        try {
            const commitSwitchList = this.container.querySelectorAll('.commit-list-item input[type="checkbox"]');
            if (commitSwitchList) {
                commitSwitchList.forEach(el => el.checked = check);
            }
        } catch (e) {
            console.error('ERROR:CommitView:changeUndoCommitSwitch', e);
        }
    }

    getUndoCommitList () {
        const commitSwitchList = this.container.querySelectorAll('.commit-list-item input[type="checkbox"]');
        const undoList = commitSwitchList ? Array.from(commitSwitchList).filter(el => el.checked) : [];
        const idList = [];
        undoList.forEach(input=> {
            idList.push(input.dataset.commitIndex*1)
        });
        return idList;
    }

    renderCommitCount() {
        this.renderDataItemKeyValue(this.container, 'commitLength', this.getCommitItemListLength());
    }

    renderDataItemKeyValue (node, key, value) {
        const element = node.querySelector('[data-item-key="' + key + '"]');
        if (!element) return;
        element.innerText = value;
    }

    renderActiveCommitItem () {
        try {
            const itemList = this.getCommitItemList();
            let isChecked = false;
            if (itemList.length) {
                itemList.forEach((li, index) => {
                    const checked = li.querySelector('input').checked;
                    if (!isChecked && checked) {isChecked = true;}
                    if (isChecked && !li.classList.contains('active')) {
                        li.classList.add('active');
                        if (!checked) {li.querySelector('input').checked = true;}
                    } else if (!checked && li.classList.contains('active')) {
                        li.classList.remove('active');
                        this.resetCheckUpFromIndex(index, itemList);
                    }
                });
            }
        } catch (e) {
            console.error('ERROR:CommitView:renderActiveCommitItem', e);
        }
    }

    resetCheckUpFromIndex(indexStop, itemList) {
        try {
            itemList.forEach((li, index) => {
                if (indexStop >= index) {
                    li.querySelector('input').checked = false;
                    li.classList.remove('active');
                }
            });
        } catch (e) {
            console.error('ERROR:CommitView:resetCheckUpFromIndex', e);
        }
    }

    removeCommitListItem (undoIndexList) {
        try {
            undoIndexList.forEach(index => {
                const commitInput = this.listBoard.querySelector(`li.commit-list-item input[data-commit-index="${index}"]`);
                const commitItem = commitInput.closest('li.commit-list-item');

                if (commitItem) {
                    commitItem.remove();
                }
            });
        } catch (e) {
            console.error('ERROR:CommitView:removeCommitListItem', e);
        }
    }

    renderCommitList (commits) {
        try {
            const ul = this.listBoard.querySelector('ul');
            const btn = ul.querySelector('.commit-list-btn-wrapper');
            let cloneLi = this.templateService.clone('commitListItemTemplate');
            ul.querySelectorAll('li.commit-list-item ').forEach(li => ul.removeChild(li));
            if (!cloneLi) return;
            commits.forEach((commit, index) => {
                cloneLi.querySelector('.commit-query-data').textContent = JSON.stringify(commit);
                const clnInput = cloneLi.querySelector('input');
                const clnForInput = cloneLi.querySelector('label');
                clnInput.id = `commit-${index}`;
                clnInput.setAttribute('data-commit-index', index);
                clnForInput.setAttribute('for', `commit-${index}`);
                btn.before(cloneLi.cloneNode(true));
            });
            this.renderCommitCount();
        } catch (e) {
            console.error('ERROR:CommitView:renderCommitList', e);
        }
    }

    getCommitItemList () {
        return this.listBoard.querySelectorAll('li.commit-list-item');
    }

    getCommitItemListLength () {
        return this.listBoard.querySelectorAll('li.commit-list-item').length;
    }
}