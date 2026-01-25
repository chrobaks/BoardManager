

export default class CommitState {
    constructor() {
        this.isAutoEnabled = false;
        this.showErrorAlert = false;
    }

    setAutoEnabled(enabled) {
        this.isAutoEnabled = enabled;
    }

    setShowErrorAlert(show) {
        this.showErrorAlert = show;
    }

    toggleAutoEnabled() {
        this.isAutoEnabled = (!this.isAutoEnabled);
    }

    toggleShowErrorAlert() {
        this.showErrorAlert = (!this.showErrorAlert);
    }

    autoIsEnabled() {
        return this.isAutoEnabled;
    }

    errorAlertIsShown() {
        return this.showErrorAlert;
    }
}