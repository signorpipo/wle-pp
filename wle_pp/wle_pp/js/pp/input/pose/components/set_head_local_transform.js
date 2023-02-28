WL.registerComponent('pp-set-head-local-transform', {
    _myNonVRCamera: { type: WL.Type.Object },
    _myFixForward: { type: WL.Type.Bool, default: true },
    _myUpdateOnViewReset: { type: WL.Type.Bool, default: true }
}, {
    init: function () {
        this._myHeadPose = new PP.HeadPose();
        this._myHeadPose.setFixForward(this._myFixForward);
        this._myHeadPose.setUpdateOnViewReset(this._myUpdateOnViewReset);
        this._myHeadPose.registerPoseUpdatedEventListener(this, this.onPoseUpdated.bind(this));
    },
    start: function () {
        this._myHeadPose.start();
        this.update(0);
    },
    update: function () {
        let nonVRCameraRotation = PP.quat_create();
        let nonVRCameraUp = PP.vec3_create();
        let nonVRCameraPosition = PP.vec3_create();
        return function update(dt) {
            if (PP.XRUtils.isSessionActive()) {
                this._myHeadPose.update(dt);
            } else {
                nonVRCameraRotation = this._myNonVRCamera.pp_getRotationLocalQuat(nonVRCameraRotation);
                if (this._myFixForward) {
                    nonVRCameraRotation.quat_rotateAxisRadians(Math.PI, nonVRCameraRotation.quat_getUp(nonVRCameraUp), nonVRCameraRotation);
                }
                this.object.pp_setPositionLocal(this._myNonVRCamera.pp_getPositionLocal(nonVRCameraPosition));
                this.object.pp_setRotationLocalQuat(nonVRCameraRotation);
            }
        };
    }(),
    onPoseUpdated: function () {
        let headPoseTransform = PP.quat2_create();
        return function onPoseUpdated() {
            if (PP.XRUtils.isSessionActive()) {
                this.object.pp_setTransformLocalQuat(this._myHeadPose.getTransformQuat(headPoseTransform));
            }
        }
    }()
});