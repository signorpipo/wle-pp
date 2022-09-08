WL.registerComponent('pp-easy-tune', {
    _myHandedness: { type: WL.Type.Enum, values: ['none', 'left', 'right'], default: 'none' },
    _myShowOnStart: { type: WL.Type.Bool, default: false },
    _myShowVisibilityButton: { type: WL.Type.Bool, default: false },
    _myEnableGamepadScrollVariable: { type: WL.Type.Bool, default: true }
}, {
    init: function () {
        //Examples
        //Number:       PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Float", 1.00, 0.01, 3));
        //Number Array: PP.myEasyTuneVariables.add(new PP.EasyTuneNumberArray("Float Array", [1.00,2.00,3.00], 0.01, 3));
        //Int:          PP.myEasyTuneVariables.add(new PP.EasyTuneInt("Int", 1, 1));
        //Int Array:    PP.myEasyTuneVariables.add(new PP.EasyTuneIntArray("Int Array", [1,2,3], 1));
        //Bool:         PP.myEasyTuneVariables.add(new PP.EasyTuneBool("Bool", false));
        //Bool Array:   PP.myEasyTuneVariables.add(new PP.EasyTuneBoolArray("Bool Array", [false, true, false]));
        //Transform:    PP.myEasyTuneVariables.add(new PP.EasyTuneTransform("Transform", PP.mat4_create(), true));

        PP.myEasyTuneVariables = new PP.EasyTuneVariables();

        this._myWidget = new PP.EasyTuneWidget();
        PP.setEasyTuneWidgetActiveVariable = function (variableName) {
            this._myWidget.setActiveVariable(variableName);
        }.bind(this);
        PP.refreshEasyTuneWidget = function () {
            this._myWidget.refresh();
        }.bind(this);
    },
    start: function () {

        let additionalSetup = {};
        additionalSetup.myHandedness = [null, 'left', 'right'][this._myHandedness];
        additionalSetup.myShowOnStart = this._myShowOnStart;
        additionalSetup.myShowVisibilityButton = this._myShowVisibilityButton;
        additionalSetup.myEnableAdditionalButtons = true;
        additionalSetup.myEnableGamepadScrollVariable = this._myEnableGamepadScrollVariable;
        additionalSetup.myPlaneMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque;
        additionalSetup.myTextMaterial = PP.myDefaultResources.myMaterials.myText;

        this._myWidget.start(this.object, additionalSetup, PP.myEasyTuneVariables._getInternalMap());
    },
    update: function (dt) {
        this._myWidget.update(dt);
    }
});

PP.myEasyTuneVariables = null;

PP.myEasyTuneTarget = null;

PP.setEasyTuneWidgetActiveVariable = function () {
    console.log("setEasyTuneWidgetActiveVariable function not initialized yet");
};

PP.refreshEasyTuneWidget = function () {
    console.log("refreshEasyTuneWidget function not initialized yet");
};