import { Component } from "@wonderlandengine/api";
import { XRUtils } from "../../../cauldron/utils/xr_utils.js";
import { quat2_create, quat_create, vec3_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";
import { BasePose } from "../base_pose.js";

export class SetHeadLocalTransformComponent extends Component {
    public static override TypeName = "pp-set-head-local-transform";

    private _myActivateOnNextUpdate: boolean = false;

    public override update(dt: number): void {
        if (this._myActivateOnNextUpdate) {
            this._onActivate();

            this._myActivateOnNextUpdate = false;
        }
    }

    private static readonly _onPoseUpdatedSV =
        {
            cameraNonXRRotation: quat_create(),
            cameraNonXRUp: vec3_create(),
            cameraNonXRPosition: vec3_create(),
            headPoseTransform: quat2_create()
        };
    private _onPoseUpdated(dt: number, pose: Readonly<BasePose>): void {
        if (!this.active || this._myActivateOnNextUpdate) {
            this.onDeactivate();
            return;
        }

        if (!XRUtils.isSessionActive(this.engine)) {
            const cameraNonXR = Globals.getPlayerObjects(this.engine)!.myCameraNonXR!;

            const cameraNonXRRotation = SetHeadLocalTransformComponent._onPoseUpdatedSV.cameraNonXRRotation;
            cameraNonXR.pp_getRotationLocalQuat(cameraNonXRRotation);

            if (Globals.isPoseForwardFixed(this.engine)) {
                const cameraNonXRUp = SetHeadLocalTransformComponent._onPoseUpdatedSV.cameraNonXRUp;
                cameraNonXRRotation.quat_rotateAxisRadians(Math.PI, cameraNonXRRotation.quat_getUp(cameraNonXRUp), cameraNonXRRotation);
            }

            const cameraNonXRPosition = SetHeadLocalTransformComponent._onPoseUpdatedSV.cameraNonXRPosition;
            this.object.pp_setPositionLocal(cameraNonXR.pp_getPositionLocal(cameraNonXRPosition));
            this.object.pp_setRotationLocalQuat(cameraNonXRRotation);
        } else {
            if (pose.isValid()) {
                const headPoseTransform = SetHeadLocalTransformComponent._onPoseUpdatedSV.headPoseTransform;
                this.object.pp_setTransformLocalQuat(pose.getTransformQuat(headPoseTransform, null));
            }
        }
    }

    public override onActivate(): void {
        this._myActivateOnNextUpdate = true;
    }

    private _onActivate(): void {
        Globals.getHeadPose(this.engine)!.registerPoseUpdatedEventListener(this, this._onPoseUpdated.bind(this));
    }

    public override onDeactivate(): void {
        Globals.getHeadPose(this.engine)?.unregisterPoseUpdatedEventListener(this);
    }
}