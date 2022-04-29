WL.registerComponent("pp-audio-listener", {
    _mySpatial: { type: WL.Type.Bool, default: true },
}, {
    init: function () {
        this._myOrigin = new Float32Array(3);
        this._myForward = new Float32Array(3);
        this._myUp = new Float32Array(3);
    },
    update: function () {
        if (!this._mySpatial) return;

        this.object.pp_getPosition(this._myOrigin);
        this.object.pp_getForward(this._myForward);
        this.object.pp_getUp(this._myUp);

        Howler.pos(this._myOrigin[0], this._myOrigin[1], this._myOrigin[2]);
        Howler.orientation(this._myForward[0], this._myForward[1], this._myForward[2],
            this._myUp[0], this._myUp[1], this._myUp[2]);
    },
});