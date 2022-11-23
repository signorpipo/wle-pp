PP.TimerState = class TimerState extends PP.State {
    constructor(duration = 0, transitionToPerformOnEnd = null, ...transitionArgs) {
        super();

        this._myTransitionToPerformOnEnd = transitionToPerformOnEnd;
        this._myTransitionArgs = transitionArgs;

        this._myTimer = new PP.Timer(duration, false);
    }

    setDuration(duration) {
        this._myTimer.setDuration(duration);
    }

    setTransitionToPerformOnEnd(transitionToPerformOnEnd, ...transitionArgs) {
        this._myTransitionToPerformOnEnd = transitionToPerformOnEnd;
        this._myTransitionArgs = transitionArgs;
    }

    onEnd(callback, id = null) {
        this._myTimer.onEnd(callback, id);
    }

    unregisterOnEnd(id = null) {
        this._myTimer.unregisterOnEnd(id);
    }

    update(dt, fsm) {
        this._myTimer.update(dt);
        if (this._myTimer.isDone()) {
            if (this._myTransitionToPerformOnEnd != null) {
                fsm.perform(this._myTransitionToPerformOnEnd, ...this._myTransitionArgs);
            }
        }
    }

    start(fsm, transition, duration = null, transitionToPerformOnEnd = null, ...transitionArgs) {
        this._myTimer.start(duration);
        if (transitionToPerformOnEnd != null) {
            this._myTransitionToPerformOnEnd = transitionToPerformOnEnd;
            this._myTransitionArgs = transitionArgs;
        }
    }

    init(fsm, state, duration = null, transitionToPerformOnEnd = null, ...transitionArgs) {
        this._myTimer.start(duration);
        if (transitionToPerformOnEnd != null) {
            this._myTransitionToPerformOnEnd = transitionToPerformOnEnd;
            this._myTransitionArgs = transitionArgs;
        }
    }
};