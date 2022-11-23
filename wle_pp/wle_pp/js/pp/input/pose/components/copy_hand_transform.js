WL.registerComponent('pp-copy-hand-transform', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
}, {
    init: function () {
        this._myHandednessType = (this._myHandedness == 0) ? PP.Handedness.LEFT : PP.Handedness.RIGHT;
    },
    update: function (dt) {
        let hand = PP.myPlayerObjects.myHands[this._myHandednessType];
        this.object.pp_setTransformQuat(hand.pp_getTransformQuat());
        this.object.pp_setScale(hand.pp_getScale());
    },
});