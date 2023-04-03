import { vec3_create } from "../../../../../plugin/js/extensions/array_extension";

export let EPSILON = Math.PP_EPSILON;
export let EPSILON_DEGREES = Math.PP_EPSILON_DEGREES;

export let computeSurfacePerceivedAngle = function () {
    let forwardOnSurface = vec3_create();
    let verticalDirection = vec3_create();
    return function computeSurfacePerceivedAngle(surfaceNormal, forward, up, isGround = true) {
        let surfacePerceivedAngle = 0;

        verticalDirection.vec3_copy(up);
        if (!isGround) {
            verticalDirection.vec3_negate(verticalDirection);
        }

        let surfaceAngle = surfaceNormal.vec3_angle(verticalDirection);
        if (surfaceAngle <= Math.PP_EPSILON_DEGREES) {
            surfaceAngle = 0;
        } else if (surfaceAngle >= 180 - Math.PP_EPSILON_DEGREES) {
            surfaceAngle = 180;
        }

        forwardOnSurface = forward.vec3_projectOnPlaneAlongAxis(surfaceNormal, up, forwardOnSurface);
        surfacePerceivedAngle = forwardOnSurface.vec3_angle(forward);

        let isFartherOnUp = forwardOnSurface.vec3_isFartherAlongAxis(forward, up);
        if ((!isFartherOnUp && isGround) || (isFartherOnUp && !isGround)) {
            surfacePerceivedAngle *= -1;
        }

        if (Math.abs(surfacePerceivedAngle) >= surfaceAngle) {
            if (surfaceAngle != 0 && surfaceAngle != 180) {
                surfacePerceivedAngle = surfaceAngle * Math.pp_sign(surfacePerceivedAngle);
            } else {
                surfacePerceivedAngle = surfaceAngle;
            }
        }

        return surfacePerceivedAngle;
    };
}();

export let LocomotionUtils = {
    EPSILON,
    EPSILON_DEGREES,
    computeSurfacePerceivedAngle
};