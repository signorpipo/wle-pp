PP.CharacterControllerUtils = {
    computeGroundPerceivedAngle: function (surfaceNormal, direction, up) {
        return this.computeSurfacePerceivedAngle(surfaceNormal, direction, up, true);
    },
    computeCeilingPerceivedAngle: function (surfaceNormal, direction, up) {
        return this.computeSurfacePerceivedAngle(surfaceNormal, direction, up, false);
    },
    computeSurfacePerceivedAngle: function () {
        let directionOnSurface = PP.vec3_create();
        let verticalDirection = PP.vec3_create();
        return function computeSurfacePerceivedAngle(surfaceNormal, direction, up, isGround) {
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

            directionOnSurface = direction.vec3_projectOnPlaneAlongAxis(surfaceNormal, up, directionOnSurface);
            surfacePerceivedAngle = directionOnSurface.vec3_angle(direction);

            let isFartherOnUp = directionOnSurface.vec3_isFartherAlongAxis(direction, up);
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
    }()
};