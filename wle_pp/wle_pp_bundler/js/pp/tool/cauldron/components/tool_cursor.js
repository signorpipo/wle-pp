WL.registerComponent('pp-tool-cursor', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myPulseOnHover: { type: WL.Type.Bool, default: false },
    _myShowFingerCursor: { type: WL.Type.Bool, default: false },
    _myCursorMesh: { type: WL.Type.Mesh, default: null },
    _myCursorMaterial: { type: WL.Type.Material, default: null }
}, {
    init: function () {
        this._myHandednessString = ['left', 'right'][this._myHandedness];

        if (this._myHandedness == 0) {
            this._myCursorPosition = [-0.01, -0.024, -0.05];
        } else {
            this._myCursorPosition = [0.01, -0.024, -0.05];
        }

        this._myCursorRotation = [-0.382, 0, 0, 0.924];
        this._myCursorRotation.quat_normalize(this._myCursorRotation);
        this._myCursorMeshScale = [0.0025, 0.0025, 0.0025];

        this._myCursorColor = [255 / 255, 255 / 255, 255 / 255, 1];

        this._myCursorTargetCollisionGroup = 7;
    },
    start: function () {
        this._myFixForwardObject = WL.scene.addObject(this.object);
        this._myFixForwardObject.pp_rotateObject([0, 180, 0]);
        this._myCursorObject = WL.scene.addObject(this._myFixForwardObject);
        this._myCursorObject.setTranslationLocal(this._myCursorPosition);
        this._myCursorObject.rotateObject(this._myCursorRotation);

        this._myCursorMeshObject = WL.scene.addObject(this._myCursorObject);
        this._myCursorMeshObject.scale(this._myCursorMeshScale);

        this._myCursorMeshComponent = this._myCursorMeshObject.addComponent("mesh");
        this._myCursorMeshComponent.mesh = this._myCursorMesh;
        this._myCursorMeshComponent.material = this._myCursorMaterial.clone();
        this._myCursorMeshComponent.material.color = this._myCursorColor;

        this._myCursorComponent = this._myCursorObject.addComponent("cursor", { "collisionGroup": this._myCursorTargetCollisionGroup, "handedness": this._myHandedness + 1, "cursorObject": this._myCursorMeshObject });
        this._myCursorComponent.rayCastMode = 0; //collision
        if (this._myPulseOnHover) {
            this._myCursorComponent.globalTarget.addHoverFunction(this._pulseOnHover.bind(this));
        }

        this._myFingerCursorComponent = this.object.addComponent("pp-finger-cursor", {
            "_myHandedness": this._myHandedness,
            "_myEnableMultipleClicks": true,
            "_myCollisionGroup": this._myCursorTargetCollisionGroup,
            "_myCursorMesh": (this._myShowFingerCursor ? this._myCursorMesh : null),
            "_myCursorMaterial": this._myCursorMeshComponent.material
        });
        this._myFingerCursorComponent.setActive(false);
    },
    update: function (dt) {
        let isUsingHand = this._isUsingHand();

        this._myFingerCursorComponent.setActive(isUsingHand);

        this._myCursorComponent.active = !isUsingHand;
        if (!this._myCursorComponent.active) {
            this._myCursorComponent._setCursorVisibility(false);
        }
    },
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