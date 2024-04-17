import { vec3_create } from "../../../../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../../../../pp/globals.js";
import { CollisionCheckTeleport } from "./collision_check_teleport.js";

export class CollisionCheckPosition extends CollisionCheckTeleport {

    positionCheck(allowFix, transformQuat, collisionCheckParams, collisionRuntimeParams) {
        if (this.isCollisionCheckDisabled() && Globals.isDebugEnabled(this._myEngine)) {
            this._setRuntimeParamsForPositionCheckCollisionCheckDisabled(allowFix, transformQuat, collisionCheckParams, collisionRuntimeParams);
            return;
        }

        this._positionCheck(allowFix, transformQuat, collisionCheckParams, collisionRuntimeParams);
    }

    _positionCheck(allowAdjustments, transformQuat, collisionCheckParams, collisionRuntimeParams) {
        // Implemented outside class definition
    }
}



// IMPLEMENTATION

CollisionCheckPosition.prototype._positionCheck = function () {
    let feetPosition = vec3_create();
    return function _positionCheck(allowAdjustments, transformQuat, collisionCheckParams, collisionRuntimeParams) {
        feetPosition = transformQuat.quat2_getPosition(feetPosition);

        this._teleport(feetPosition, transformQuat, collisionCheckParams, collisionRuntimeParams, true);

        collisionRuntimeParams.myIsPositionOk = !collisionRuntimeParams.myTeleportCanceled;
        collisionRuntimeParams.myIsPositionCheck = true;
        collisionRuntimeParams.myOriginalPositionCheckPosition.vec3_copy(collisionRuntimeParams.myOriginalTeleportPosition);
        collisionRuntimeParams.myFixedPositionCheckPosition.vec3_copy(collisionRuntimeParams.myFixedTeleportPosition);
        collisionRuntimeParams.myIsPositionCheckAllowAdjustments = allowAdjustments;

        if (!allowAdjustments) {
            collisionRuntimeParams.myIsPositionOk = collisionRuntimeParams.myIsPositionOk &&
                collisionRuntimeParams.myOriginalPositionCheckPosition.vec_equals(collisionRuntimeParams.myFixedPositionCheckPosition, 0.00001);
        }

        collisionRuntimeParams.myOriginalTeleportPosition.vec3_zero();
        collisionRuntimeParams.myFixedTeleportPosition.vec3_zero();
        collisionRuntimeParams.myTeleportCanceled = false;
        collisionRuntimeParams.myIsTeleport = false;
    };
}();