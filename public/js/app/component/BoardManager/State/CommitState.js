

export default class CommitState {
    constructor() {
        this.isAutoEnabled = false;
    }

    setAutoEnabled(enabled) {
        this.isAutoEnabled = enabled;
    }

    toggleAutoEnabled() {
        this.isAutoEnabled = (!this.isAutoEnabled);
    }

    autoIsEnabled() {
        return this.isAutoEnabled;
    }
}