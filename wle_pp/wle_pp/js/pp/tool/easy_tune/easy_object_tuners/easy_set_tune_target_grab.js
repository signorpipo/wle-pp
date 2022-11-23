WL.registerComponent("pp-easy-set-tune-target-grab", {
}, {
    init: function () {
    },
    start: function () {
        this._myGrabber = this.object.pp_getComponent("pp-grabber-hand");
    },
    update: function () {
    },
    _onRelease: function (grabber, grabbable) {
        PP.myEasyTuneTarget = grabbable.object;
    },
    _onGrab: function (grabber, grabbable) {
        //PP.myEasyTuneTarget = null;
    },
    onActivate() {
        this._myGrabber.registerGrabEventListener(this, this._onGrab.bind(this));
        this._myGrabber.registerThrowEventListener(this, this._onRelease.bind(this));
    },
    onDeactivate() {
        this._myGrabber.unregisterGrabEventListener(this);
        this._myGrabber.unregisterThrowEventListener(this);
    }
});