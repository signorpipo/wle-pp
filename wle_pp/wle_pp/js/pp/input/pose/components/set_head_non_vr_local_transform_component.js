import { Component, Property } from "@wonderlandengine/api";
import { quat_create, vec3_create } from "../../../plugin/js/extensions/array_extension";

export class SetHeadNonVRLocalTransformComponent extends Component {
    static TypeName = "pp-set-head-non-vr-local-transform";
    static Properties = {
        _myCameraNonVR: Property.object(),
        _myFixForward: Property.bool(true)
    };

    start() {
        this.update(0);
    }

    update(dt) {
        // Implemented outside class definition
    }
}



// IMPLEMENTATION

SetHeadNonVRLocalTransformComponent.prototype.update = function () {
    let cameraNonVRRotation = quat_create();
    let cameraNonVRUp = vec3_create();
    let cameraNonVRPosition = vec3_create();
    return function update(dt) {
        cameraNonVRRotation = this._myCameraNonVR.pp_getRotationLocalQuat(cameraNonVRRotation);
        if (this._myFixForward) {
            cameraNonVRRotation.quat_rotateAxisRadians(Math.PI, cameraNonVRRotation.quat_getUp(cameraNonVRUp), cameraNonVRRotation);
        }
        this.object.pp_setPositionLocal(this._myCameraNonVR.pp_getPositionLocal(cameraNonVRPosition));
        this.object.pp_setRotationLocalQuat(cameraNonVRRotation);
    };
}();