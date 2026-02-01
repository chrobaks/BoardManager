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

    renderActiveCommitItem () {
        const itemList = this.getCommitItemList();
        if (itemList.length) {
            itemList.forEach(li => {
                const checked = li.querySelector('input').checked;
                if (checked && !li.classList.contains('active')) {
                    li.classList.add('active');
                } else if (!checked && li.classList.contains('active')) {
                    li.classList.remove('active');
                }
            });
        }
    }

    removeCommitListItem (undoIndexList) {
        try {
            undoIndexList.forEach(index => {
                const commitInput = this.listBoard.querySelector(`li.commit-list-item input[data-commit-index="${index}"]`);
                const commitItem = commitInput.closest('li.commit-list-item');

                console.log('removeCommitListItem', commitItem);
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
            const btn = ul.querySelector('.commit-list-btn');
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
        } catch (e) {
            console.error('ERROR:CommitView:renderCommitList', e);
        }
    }

    getCommitItemList () {
        return this.listBoard.querySelectorAll('li.commit-list-item');
    }
}