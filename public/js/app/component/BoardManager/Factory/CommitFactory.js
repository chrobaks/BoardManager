
export default class CommitFactory {
    constructor(config) {
        this.config = config;
    }

    getEventAction(commit) {
        if (
            !commit?.type
            || !commit?.action
            || commit.action && !this.config?.[commit.action]) { return ''; }

        const action = this.config[commit.action];

        return `${commit.type}:${action}`;
    }
}