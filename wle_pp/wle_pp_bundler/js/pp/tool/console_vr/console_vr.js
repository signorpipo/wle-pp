WL.registerComponent('pp-console-vr', {
    _myHandedness: { type: WL.Type.Enum, values: ['none', 'left', 'right'], default: 'none' },
    _myOverrideBrowserConsole: { type: WL.Type.Bool, default: true },
    _myShowOnStart: { type: WL.Type.Bool, default: false },
    _myShowVisibilityButton: { type: WL.Type.Bool, default: false },
    _myPulseOnNewMessage: { type: WL.Type.Enum, values: ['never', 'always', 'when hidden'], default: 'never' },
    _myPlaneMaterial: { type: WL.Type.Material, default: null },
    _myTextMaterial: { type: WL.Type.Material, default: null }
}, {
    init: function () {
        this._myWidget = new PP.ConsoleVRWidget();
    },
    start: function () {
        let additionalSetup = {};
        additionalSetup.myHandedness = [null, 'left', 'right'][this._myHandedness];
        additionalSetup.myOverrideBrowserConsole = this._myOverrideBrowserConsole;
        additionalSetup.myShowOnStart = this._myShowOnStart;
        additionalSetup.myShowVisibilityButton = this._myShowVisibilityButton;
        additionalSetup.myPulseOnNewMessage = this._myPulseOnNewMessage;
        additionalSetup.myPlaneMaterial = this._myPlaneMaterial;
        additionalSetup.myTextMaterial = this._myTextMaterial;

        this._myWidget.start(this.object, additionalSetup);
    },
    update: function (dt) {
        this._myWidget.update(dt);
    }
});
