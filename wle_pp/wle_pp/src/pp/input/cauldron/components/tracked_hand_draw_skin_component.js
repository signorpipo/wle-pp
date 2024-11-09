import { Component, Property } from "@wonderlandengine/api";
import { ObjectUtils } from "../../../cauldron/wl/utils/object_utils.js";
import { quat2_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";
import { InputUtils } from "../input_utils.js";

export class TrackedHandDrawSkinComponent extends Component {
    static TypeName = "pp-tracked-hand-draw-skin";
    static Properties = {
        _myHandedness: Property.enum(["Left", "Right"], "Left"),
        _myHandSkin: Property.skin(null),
        _myIsHandSkinForwardFixed: Property.bool(false) // Should become true when I can manage to create a tracked hand skin with the forward fixed
    };

    start() {
        this._myHandednessType = InputUtils.getHandednessByIndex(this._myHandedness);

        this._prepareJoints();
    }

    update(dt) {
        // Implemented outside class definition
    }

    _prepareJoints() {
        this._myJoints = [];

        let skinJointIDs = this._myHandSkin.jointIds;

        for (let i = 0; i < skinJointIDs.length; i++) {
            this._myJoints[i] = ObjectUtils.wrapObject(skinJointIDs[i], this.engine);
        }
    }
}



// IMPLEMENTATION

TrackedHandDrawSkinComponent.prototype.update = function () {
    let transformQuat = quat2_create();
    return function update(dt) {
        for (let i = 0; i < this._myJoints.length; i++) {
            let jointObject = this._myJoints[i];

            let jointID = jointObject.pp_getName(); // Joint name must match the TrackedHandJointID enum value
            let jointPose = Globals.getTrackedHandPose(this._myHandednessType, this.engine).getJointPose(jointID);

            let jointTransformQuat = jointPose.getTransformQuat(transformQuat, null);
            if (jointPose.isForwardFixed() != this._myIsHandSkinForwardFixed) {
                jointTransformQuat.quat2_rotateAxis(180, jointTransformQuat.quat2_getUp(), jointTransformQuat);
            }
            jointObject.pp_setTransformLocalQuat(jointTransformQuat);
        }
    };
}();