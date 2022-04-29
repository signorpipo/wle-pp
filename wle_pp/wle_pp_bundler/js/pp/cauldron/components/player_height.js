WL.registerComponent("pp-player-height", {
    _myEyesHeight: { type: WL.Type.Float, default: 1.65 }
}, {
    start: function () {
        let localPosition = this.object.pp_getPositionLocal();
        this.object.setPositionLocal([localPosition[0], this._myEyesHeight, localPosition[2]]);

        if (WL.xrSession) {
            this._onXRSessionStart(WL.xrSession);
        }
        WL.onXRSessionStart.push(this._onXRSessionStart.bind(this));
        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));
    },
    _onXRSessionStart: function () {
        if (this.active) {
            let localPosition = this.object.pp_getPositionLocal();
            if (PP.XRUtils.isReferenceSpaceLocalFloor()) {
                this.object.setPositionLocal([localPosition[0], 0, localPosition[2]]);
            } else {
                this.object.setPositionLocal([localPosition[0], this._myEyesHeight, localPosition[2]]);
            }
        }
    },
    _onXRSessionEnd: function () {
        if (this.active) {
            let localPosition = this.object.pp_getPositionLocal();
            this.object.setPositionLocal([localPosition[0], this._myEyesHeight, localPosition[2]]);
        }
    }
});