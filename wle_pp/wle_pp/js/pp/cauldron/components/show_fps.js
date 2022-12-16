WL.registerComponent('pp-show-fps', {
    _myRefreshSeconds: { type: WL.Type.Float, default: 0.25 },
    _myTextMaterial: { type: WL.Type.Material }
}, {
    init: function () {
    },
    start() {
        this._myTimer = new PP.Timer(this._myRefreshSeconds);
        this._myTotalDT = 0;
        this._myFrames = 0;

        this._myVisualFPSParent = this.object.pp_addObject();

        let visualParams = new PP.VisualTextParams();
        visualParams.myText = "0";

        visualParams.myTransform.mat4_setPositionRotationScale([-0.115, -0.115, 0.35], [0, 180, 0], [0.3, 0.3, 0.3]);

        if (this._myTextMaterial != null) {
            visualParams.myMaterial = this._myTextMaterial.clone();
        } else {
            visualParams.myMaterial = PP.myDefaultResources.myMaterials.myText.clone();
            visualParams.myMaterial.color = [0, 1, 0, 1];
        }

        visualParams.myParent = this._myVisualFPSParent;

        this._myVisualFPS = new PP.VisualText(visualParams);

        PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("FPS X", -0.25, 0.1, 3));
        PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("FPS Y", -0.130, 0.1, 3));
        PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("FPS Z", 0.35, 0.1, 3));
    },
    update: function () {
        let playerTransformQuat = PP.quat2_create();
        return function update(dt) {
            this._myTotalDT += dt;
            this._myFrames++;

            this._myTimer.update(dt);
            if (this._myTimer.isDone()) {
                this._myTimer.start();

                let fps = Math.round(this._myFrames / this._myTotalDT);

                let visualParams = this._myVisualFPS.getParams();

                if (PP.XRUtils.isSessionActive()) {
                    visualParams.myTransform.mat4_setPositionRotationScale([-0.115, -0.115, 0.35], [0, 180, 0], [0.3, 0.3, 0.3]);
                } else {
                    visualParams.myTransform.mat4_setPositionRotationScale([-0.25, -0.130, 0.35], [0, 180, 0], [0.3, 0.3, 0.3]);
                }

                //visualParams.myTransform.mat4_setPositionRotationScale([PP.myEasyTuneVariables.get("FPS X"), PP.myEasyTuneVariables.get("FPS Y"), PP.myEasyTuneVariables.get("FPS Z")], [0, 180, 0], [0.3, 0.3, 0.3]);

                visualParams.myText = fps.toFixed(0);
                this._myVisualFPS.paramsUpdated();

                this._myTotalDT = 0;
                this._myFrames = 0;
            }

            this._myVisualFPSParent.pp_setTransformQuat(PP.myPlayerObjects.myHead.pp_getTransformQuat(playerTransformQuat));
        };
    }()
});