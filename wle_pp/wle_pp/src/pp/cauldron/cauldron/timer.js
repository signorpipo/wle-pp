import { Emitter } from "@wonderlandengine/api";

export class Timer {

    constructor(duration, autoStart = true) {
        this._myDuration = duration;
        this._myOnEndEmitter = new Emitter();     // Signature: listener()

        this._myDone = false;
        this._myJustDone = false;
        this._myStarted = false;

        if (autoStart) {
            this.start();
        } else {
            this.reset();
        }
    }

    start(duration = null) {
        this.reset(duration);
        this._myStarted = true;
    }

    end() {
        this._done();
    }

    reset(duration = null) {
        if (duration != null) {
            this._myDuration = Math.max(0, duration);
        }

        this._myTimeLeft = this._myDuration;
        this._myDone = false;
        this._myJustDone = false;
        this._myStarted = false;
    }

    update(dt) {
        this._myJustDone = false;

        if (this.isRunning()) {
            this._myTimeLeft = Math.max(0, this._myTimeLeft - dt);
            if (this._myTimeLeft == 0) {
                this._done();
            }
        }
    }

    isDone() {
        return this._myDone;
    }

    isJustDone() {
        return this._myJustDone;
    }

    isStarted() {
        return this._myStarted;
    }

    isRunning() {
        return this.isStarted() && !this.isDone();
    }

    getDuration() {
        return this._myDuration;
    }

    setDuration(duration) {
        const newDuration = Math.max(0, duration);

        if (this.isRunning()) {
            const timeElapsed = Math.max(0, this._myDuration - this._myTimeLeft);
            this._myTimeLeft = Math.max(0, newDuration - timeElapsed);
        }

        this._myDuration = newDuration;
    }

    getTimeLeft() {
        return this._myTimeLeft;
    }

    setTimeLeft(timeLeft) {
        if (this.isRunning()) {
            this._myTimeLeft = Math.max(0, timeLeft);

            if (this._myTimeLeft > this._myDuration) {
                this._myDuration = this._myTimeLeft;
            }
        }
    }

    getTimeElapsed() {
        let timeElapsed = 0;
        if (this.isRunning()) {
            timeElapsed = this._myDuration - this._myTimeLeft;
        }
        return Math.max(0, timeElapsed);
    }

    setTimeElapsed(timeElapsed) {
        this.setTimeLeft(this._myDuration - Math.max(0, timeElapsed));
    }

    getPercentage() {
        let percentage = 1;
        if (this._myTimeLeft > 0 && this._myDuration > 0) {
            percentage = (this._myDuration - this._myTimeLeft) / this._myDuration;
        }
        return Math.pp_clamp(percentage, 0, 1);
    }

    setPercentage(percentage) {
        if (this.isRunning()) {
            let durationPercentage = Math.pp_clamp(1 - percentage, 0, 1);
            this._myTimeLeft = this._myDuration * durationPercentage;
        }
    }

    onEnd(listener, id = null) {
        this._myOnEndEmitter.add(listener, { id: id });
    }

    unregisterOnEnd(id = null) {
        this._myOnEndEmitter.remove(id);
    }

    _done() {
        this._myTimeLeft = 0;
        this._myDone = true;
        this._myJustDone = true;

        this._myOnEndEmitter.notify();
    }
}