WL.registerComponent("pp-easy-set-tune-target-child-number", {
    _myVariableName: { type: WL.Type.String, default: "" },
    _mySetAsDefault: { type: WL.Type.Bool, default: false },
}, {
    init: function () {
    },
    start: function () {
        this._myEasyTuneVariableName = "Target Child ";

        if (this._myVariableName == "") {
            this._myEasyTuneVariableName = this._myEasyTuneVariableName.concat(this.object.objectId);
        } else {
            this._myEasyTuneVariableName = this._myEasyTuneVariableName.concat(this._myVariableName);
        }

        let childrenCount = this.object.pp_getChildren().length;
        let min = 1;
        let max = childrenCount;
        if (childrenCount == 0) {
            min = 0;
            max = 0;
        }

        PP.myEasyTuneVariables.add(new PP.EasyTuneInt(this._myEasyTuneVariableName, 0, 10, min, max));
        if (this._mySetAsDefault) {
            PP.setEasyTuneWidgetActiveVariable(this._myEasyTuneVariableName);
        }

        this._myCurrentChildIndex = -1;
        this._myCurrentChildrenCount = childrenCount;
    },
    update: function () {
        if (PP.myEasyTuneVariables.isActive(this._myEasyTuneVariableName)) {
            let childrenCount = this.object.pp_getChildren().length;
            if (childrenCount != this._myCurrentChildrenCount) {
                this._myCurrentChildrenCount = childrenCount;

                let min = 1;
                let max = childrenCount;
                if (childrenCount == 0) {
                    min = 0;
                    max = 0;
                }

                let easyTuneVariable = PP.myEasyTuneVariables.getEasyTuneVariable(this._myEasyTuneVariableName);
                easyTuneVariable.setMin(min);
                easyTuneVariable.setMax(max);
            }

            let childIndex = PP.myEasyTuneVariables.get(this._myEasyTuneVariableName);
            if (childIndex != this._myCurrentChildIndex) {
                if (childIndex == 0 && this._myCurrentChildIndex != -1) {
                    PP.myEasyTuneTarget = null;
                } else if (childIndex > 0) {
                    PP.myEasyTuneTarget = this.object.pp_getChildren()[childIndex - 1];
                }

                this._myCurrentChildIndex = childIndex;
            }
        }
    }
});