import { vec3_create } from "../../../../../../plugin/js/extensions/array/vec_create_extension.js";
import { CollisionCheckParams } from "./collision_params.js";

export function generate360TeleportParamsFromMovementParams(movementParams: Readonly<CollisionCheckParams>, outTeleportParams = new CollisionCheckParams()): CollisionCheckParams {
    outTeleportParams.copy(movementParams);

    outTeleportParams.myHalfConeAngle = 180;
    outTeleportParams.myHalfConeSliceAmount = Math.round((outTeleportParams.myHalfConeAngle / movementParams.myHalfConeAngle) * movementParams.myHalfConeSliceAmount);

    outTeleportParams.myCheckHorizontalFixedForwardEnabled = true;
    outTeleportParams.myCheckHorizontalFixedForward = vec3_create(0, 0, 1);

    return outTeleportParams;
}

export const CollisionCheckUtils = {
    generate360TeleportParamsFromMovementParams
} as const;