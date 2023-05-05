import { vec3_create } from "../../../plugin/js/extensions/array_extension";

export function computeGroundPerceivedAngle(surfaceNormal, direction, up) {
    return this.computeSurfacePerceivedAngle(surfaceNormal, direction, up, true);
}

export function computeCeilingPerceivedAngle(surfaceNormal, direction, up) {
    return this.computeSurfacePerceivedAngle(surfaceNormal, direction, up, false);
}

export let computeSurfacePerceivedAngle = function () {
    let directionOnSurface = vec3_create();
    let verticalDirection = vec3_create();
    return function computeSurfacePerceivedAngle(surfaceNormal, direction, up, ground) {
        let surfacePerceivedAngle = 0;

        verticalDirection.vec3_copy(up);
        if (!ground) {
            verticalDirection.vec3_negate(verticalDirection);
        }

        let surfaceAngle = surfaceNormal.vec3_angle(verticalDirection);
        if (surfaceAngle <= Math.PP_EPSILON_DEGREES) {
            surfaceAngle = 0;
        } else if (surfaceAngle >= 180 - Math.PP_EPSILON_DEGREES) {
            surfaceAngle = 180;
        }

        directionOnSurface = direction.vec3_projectOnPlaneAlongAxis(surfaceNormal, up, directionOnSurface);
        surfacePerceivedAngle = directionOnSurface.vec3_angle(direction);

        let fartherOnUp = directionOnSurface.vec3_isFartherAlongAxis(direction, up);
        if ((!fartherOnUp && ground) || (fartherOnUp && !ground)) {
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
}()

export let CharacterControllerUtils = {
    computeGroundPerceivedAngle,
    computeCeilingPerceivedAngle,
    computeSurfacePerceivedAngle
};