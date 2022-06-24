if (_WL && _WL._componentTypes && _WL._componentTypes[_WL._componentTypeIndices["mouse-look"]]) {

    // Modified Functions

    _WL._componentTypes[_WL._componentTypeIndices["mouse-look"]].proto.init = function () {
        document.addEventListener('mousemove', function (e) {
            if (this.active && (this.mouseDown || !this.requireMouseDown)) {

                let viewForward = this.object.pp_getForward();
                let viewUp = this.object.pp_getUp();

                let referenceUp = [0, 1, 0];
                if (this.object.pp_getParent() != null) {
                    referenceUp = this.object.pp_getParent().pp_getUp();
                }

                let referenceRight = viewForward.vec3_cross(referenceUp);
                let minAngle = 1;
                if (viewForward.vec3_angle(referenceUp) < minAngle) {
                    referenceRight = viewUp.vec3_negate().vec3_cross(referenceUp);
                } else if (referenceRight.vec3_angle(referenceUp.vec3_negate()) < minAngle) {
                    referenceRight = viewUp.vec3_cross(referenceUp);
                } else if (!viewUp.vec3_isConcordant(referenceUp)) {
                    referenceRight = viewForward.vec3_negate().vec3_cross(referenceUp);
                }
                referenceRight.vec3_normalize(referenceRight);

                this.rotationY = -this.sensitity * e.movementX;
                this.rotationX = -this.sensitity * e.movementY;

                this.object.pp_rotateAxis(-this.rotationX, referenceRight);
                this.object.pp_rotateAxis(this.rotationY, referenceUp);

                // remove X tilt
                {
                    let newForward = this.object.pp_getForward();
                    let newRight = this.object.pp_getRight();
                    let newUp = this.object.pp_getUp();

                    let fixedRight = newForward.vec3_cross(referenceUp);
                    if (!newUp.vec3_isConcordant(referenceUp)) {
                        fixedRight.vec3_negate(fixedRight);
                    }
                    fixedRight.vec3_normalize(fixedRight);
                    if (fixedRight.vec3_length() == 0) {
                        fixedRight = newRight;
                    }

                    let fixedUp = fixedRight.vec3_cross(newForward);
                    fixedUp.vec3_normalize(fixedUp);
                    let fixedForward = fixedUp.vec3_cross(fixedRight);
                    fixedForward.vec3_normalize(fixedForward);

                    let fixedRotation = PP.quat_create();
                    fixedRotation.quat_fromAxes(fixedRight.vec3_negate(), fixedUp, fixedForward);

                    this.object.pp_setRotationQuat(fixedRotation);
                }

                // fix upside down
                {
                    let newRight = this.object.pp_getRight();
                    let newUp = this.object.pp_getUp();

                    if (!newUp.vec3_isConcordant(referenceUp)) {
                        let signedAngle = newUp.vec3_angleSigned(referenceUp, newRight);
                        if (signedAngle > 0) {
                            signedAngle -= 89.995;
                        } else {
                            signedAngle += 89.995;
                        }

                        let fixedUp = newUp.vec3_rotateAxis(signedAngle, newRight);
                        fixedUp.vec3_normalize(fixedUp);
                        let fixedForward = fixedUp.vec3_cross(newRight);
                        fixedForward.vec3_normalize(fixedForward);
                        let fixedRight = fixedForward.vec3_cross(fixedUp);
                        fixedRight.vec3_normalize(fixedRight);

                        let fixedRotation = PP.quat_create();
                        fixedRotation.quat_fromAxes(fixedRight.vec3_negate(), fixedUp, fixedForward);

                        this.object.pp_setRotationQuat(fixedRotation);
                    }
                }
            }
        }.bind(this));

        if (this.requireMouseDown) {
            if (this.mouseButtonIndex == 2) {
                WL.canvas.addEventListener("contextmenu", function (e) {
                    e.preventDefault();
                }, false);
            }
            WL.canvas.addEventListener('mousedown', function (e) {
                if (e.button == this.mouseButtonIndex) {
                    this.mouseDown = true;
                    document.body.style.cursor = "grabbing";
                    if (e.button == 1) {
                        e.preventDefault();
                        /* Prevent scrolling */
                        return false;
                    }
                }
            }.bind(this));
            WL.canvas.addEventListener('mouseup', function (e) {
                if (e.button == this.mouseButtonIndex) {
                    this.mouseDown = false;
                    document.body.style.cursor = "initial";
                }
            }.bind(this));

            WL.canvas.addEventListener('touchstart', function (e) {
                this.mouseDown = true;
                document.body.style.cursor = "grabbing";
            }.bind(this));
            WL.canvas.addEventListener('touchend', function (e) {
                this.mouseDown = false;
                document.body.style.cursor = "initial";
            }.bind(this));
        }
    };
} else {
    console.error("Wonderland Engine \"mouse-look\" component not found.\n Add the component to your project to avoid any issue with the PP bundle.");
}