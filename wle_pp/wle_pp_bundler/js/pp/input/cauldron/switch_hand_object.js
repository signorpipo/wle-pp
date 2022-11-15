WL.registerComponent('pp-switch-hand-object', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myGamepad: { type: WL.Type.Object },
    _myTrackedHand: { type: WL.Type.Object }
}, {
    init: function () {
    },
    start: function () {
        this._myHandednessType = PP.InputUtils.getHandednessByIndex(this._myHandedness);
        this._myFirstUpdate = true;

        this._myCurrentInputSourceType = null;
    },
    onActivate() {
        this._myFirstUpdate = true;
    },
    update: function (dt) {
        if (this._myFirstUpdate) {
            this._myFirstUpdate = false;
            this._start();
        }

        let inputSourceType = PP.InputUtils.getInputSourceTypeByHandedness(this._myHandednessType);
        if (inputSourceType != null && this._myCurrentInputSourceType != inputSourceType) {
            this._myCurrentInputSourceType = inputSourceType;

            if (inputSourceType == PP.InputSourceType.TRACKED_HAND) {
                if (this._myGamepad != null) {
                    this._myGamepad.pp_setActive(false);
                }
                if (this._myTrackedHand != null) {
                    this._myTrackedHand.pp_setActive(true);
                }
            } else if (inputSourceType == PP.InputSourceType.GAMEPAD) {
                if (this._myTrackedHand != null) {
                    this._myTrackedHand.pp_setActive(false);
                }
                if (this._myGamepad != null) {
                    this._myGamepad.pp_setActive(true);
                }
            }
        }
    },
    _start() {
        if (this._myGamepad != null) {
            this._myGamepad.pp_setActive(false);
        }

        if (this._myTrackedHand != null) {
            this._myTrackedHand.pp_setActive(false);
        }

        this._myCurrentInputSourceType = null;
    }
});