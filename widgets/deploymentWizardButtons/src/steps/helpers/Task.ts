/**
 * Created by jakub.niezgoda on 09/08/2018.
 */

export default class Task {
    static Status = {
        pending: 0,
        inProgress: 1,
        finished: 2,
        failed: 3
    };

    constructor(name, promise, status = Task.Status.pending, error = null) {
        this.name = name;
        this.promise = promise;
        this.status = status;
        this.error = error;
    }

    changeToInProgress() {
        this.status = Task.Status.inProgress;
    }

    changeToFinished() {
        this.status = Task.Status.finished;
    }

    changeToFailed(error) {
        this.status = Task.Status.failed;
        this.error = error;
    }

    isPending() {
        return this.status === Task.Status.pending;
    }

    isInProgress() {
        return this.status === Task.Status.inProgress;
    }

    isFinished() {
        return this.status === Task.Status.finished;
    }

    isFailed() {
        return this.status === Task.Status.failed;
    }

    run() {
        return this.promise();
    }
}
