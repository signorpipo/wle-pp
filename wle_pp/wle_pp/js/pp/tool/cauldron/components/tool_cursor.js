WL.registerComponent('pp-tool-cursor', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myFixForward: { type: WL.Type.Bool, default: true },
    _myApplyDefaultCursorOffset: { type: WL.Type.Bool, default: true },
    _myPulseOnHover: { type: WL.Type.Bool, default: false },
    _myShowFingerCursor: { type: WL.Type.Bool, default: false },
}, {
    init: function () {
        this._myHandednessString = ['left', 'right'][this._myHandedness];

        this._myCursorPositionDefaultOffset = PP.vec3_create(0, -0.035, -0.05);
        this._myCursorRotationDefaultOffset = PP.vec3_create(-30, 0, 0);

        this._myCursorMeshScale = PP.vec3_create(0.0025, 0.0025, 0.0025);
        this._myCursorColor = [255 / 255, 255 / 255, 255 / 255, 1];

        this._myCursorTargetCollisionGroup = 7;
    },
    start: function () {
        this._myToolCursorObject = WL.scene.addObject(this.object);
        this._myFixForwardObject = WL.scene.addObject(this._myToolCursorObject);

        if (this._myFixForward) {
            this._myFixForwardObject.pp_rotateObject(PP.vec3_create(0, 180, 0));
        }

        this._myCursorObjectVR = WL.scene.addObject(this._myFixForwardObject);

        if (this._myApplyDefaultCursorOffset) {
            this._myCursorObjectVR.pp_setPositionLocal(this._myCursorPositionDefaultOffset);
            this._myCursorObjectVR.pp_rotateObject(this._myCursorRotationDefaultOffset);
        }

        {
            this._myCursorMeshobject = WL.scene.addObject(this._myCursorObjectVR);
            this._myCursorMeshobject.pp_setScale(this._myCursorMeshScale);

            let cursorMeshComponent = this._myCursorMeshobject.addComponent("mesh");
            cursorMeshComponent.mesh = PP.myDefaultResources.myMeshes.mySphere;
            cursorMeshComponent.material = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
            cursorMeshComponent.material.color = this._myCursorColor;

            let cursorComponent = this._myCursorObjectVR.addComponent("cursor", { "collisionGroup": this._myCursorTargetCollisionGroup, "handedness": this._myHandedness + 1, "cursorObject": this._myCursorMeshobject });
            cursorComponent.rayCastMode = 0; //collision
            if (this._myPulseOnHover) {
                cursorComponent.globalTarget.addHoverFunction(this._pulseOnHover.bind(this));
            }
        }

        this._myCursorObjectNonVR = WL.scene.addObject(this._myToolCursorObject);

        {
            let cursorComponent = this._myCursorObjectNonVR.addComponent("cursor", { "collisionGroup": this._myCursorTargetCollisionGroup, "handedness": this._myHandedness + 1 });
            cursorComponent.rayCastMode = 0; //collision
            if (this._myPulseOnHover) {
                cursorComponent.globalTarget.addHoverFunction(this._pulseOnHover.bind(this));
            }
            cursorComponent.setViewComponent(PP.myPlayerObjects.myNonVRCamera.getComponent("view"));
        }

        let fingerCursorMeshObject = null;
        let fingerCollisionSize = 0.0125;

        if (this._myShowFingerCursor) {
            fingerCursorMeshObject = this._myToolCursorObject.pp_addObject();

            let meshComponent = fingerCursorMeshObject.addComponent("mesh");
            meshComponent.mesh = PP.myDefaultResources.myMeshes.mySphere;
            meshComponent.material = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
            meshComponent.material.color = this._myCursorColor;

            fingerCursorMeshObject.pp_setScale(fingerCollisionSize);
        }

        this._myFingerCursorObject = WL.scene.addObject(this._myToolCursorObject);
        this._myFingerCursorComponent = this._myFingerCursorObject.addComponent("pp-finger-cursor", {
            "_myHandedness": this._myHandedness,
            "_myEnableMultipleClicks": true,
            "_myCollisionGroup": this._myCursorTargetCollisionGroup,
            "_myCollisionSize": fingerCollisionSize,
            "_myCursorObject": fingerCursorMeshObject
        });

        this._myCursorObjectVR.pp_setActive(false);
        this._myCursorObjectNonVR.pp_setActive(false);
        this._myFingerCursorObject.pp_setActive(false);

    },
    update: function () {
        let transformQuat = PP.quat2_create();
        let transform = PP.mat4_create();
        return function update(dt) {
            let isUsingHand = this._isUsingHand();

            this._myFingerCursorObject.pp_setActive(isUsingHand);

            if (isUsingHand) {
                this._myCursorObjectNonVR.pp_setActive(false);
                this._myCursorObjectVR.pp_setActive(false);
            } else {
                if (PP.XRUtils.isSessionActive()) {
                    this._myCursorObjectVR.pp_setActive(!isUsingHand);
                    this._myCursorObjectNonVR.pp_setActive(false);
                } else {
                    this._myCursorObjectNonVR.pp_setActive(!isUsingHand);
                    this._myCursorObjectVR.pp_setActive(false);

                    this._myCursorObjectNonVR.pp_setTransformQuat(PP.myPlayerObjects.myNonVRCamera.pp_getTransformQuat(transformQuat));
                }
            }
        };
    }(),
    _isUsingHand: function () {
        let isUsingHand = false;

        if (WL.xrSession && WL.xrSession.inputSources) {
            for (let i = 0; i < WL.xrSession.inputSources.length; i++) {
                let input = WL.xrSession.inputSources[i];
                if (input.hand && input.handedness == this._myHandednessString) {
                    isUsingHand = true;
                    break;
                }
            }
        }

        return isUsingHand;
    },
    _pulseOnHover: function (object) {
        let targetComponent = object.getComponent("cursor-target");

        if (targetComponent && !targetComponent.isSurface) {
            if (this._myHandedness == 0) {
                if (PP.myLeftGamepad) {
                    PP.myLeftGamepad.pulse(0.4, 0);
                }
            } else {
                if (PP.myRightGamepad) {
                    PP.myRightGamepad.pulse(0.4, 0);
                }
            }
        }
    }
});