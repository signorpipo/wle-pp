if (_WL && _WL._componentTypes && _WL._componentTypes[_WL._componentTypeIndices["mouse-look"]]) {

    // Modified Functions

    _WL._componentTypes[_WL._componentTypeIndices["mouse-look"]].prototype.init = function () {
        WL.canvas.addEventListener('mousemove', function () {
            let viewForward = PP.vec3_create();
            let viewUp = PP.vec3_create();

            let referenceUp = PP.vec3_create();
            let referenceUpNegate = PP.vec3_create();
            let referenceRight = PP.vec3_create();

            let newUp = PP.vec3_create();
            return function (e) {
                if (this.active && (this.mouseDown || !this.requireMouseDown)) {

                    viewForward = this.object.pp_getBackward(viewForward); // the view "real" forward is actually the backward
                    viewUp = this.object.pp_getUp(viewUp);

                    referenceUp.vec3_set(0, 1, 0);
                    if (this.object.pp_getParent() != null) {
                        referenceUp = this.object.pp_getParent().pp_getUp(referenceUp);
                    }

                    referenceRight = viewForward.vec3_cross(referenceUp, referenceRight);

                    let minAngle = 1;
                    if (viewForward.vec3_angle(referenceUp) < minAngle) {
                        referenceRight = viewUp.vec3_negate(referenceRight).vec3_cross(referenceUp, referenceRight);
                    } else if (viewForward.vec3_angle(referenceUp.vec3_negate(referenceUpNegate)) < minAngle) {
                        referenceRight = viewUp.vec3_cross(referenceUp, referenceRight);
                    } else if (!viewUp.vec3_isConcordant(referenceUp)) {
                        referenceRight.vec3_negate(referenceRight);
                    }
                    referenceRight.vec3_normalize(referenceRight);

                    this.rotationX = -this.sensitity * e.movementX;
                    this.rotationY = -this.sensitity * e.movementY;

                    this.object.pp_rotateAxis(this.rotationY, referenceRight);

                    let maxVerticalAngle = 90 - 0.001;
                    newUp = this.object.pp_getUp(newUp);
                    let angleWithUp = Math.pp_angleClamp(newUp.vec3_angleSigned(referenceUp, referenceRight));
                    if (Math.abs(angleWithUp) > maxVerticalAngle) {
                        let fixAngle = (Math.abs(angleWithUp) - maxVerticalAngle) * Math.pp_sign(angleWithUp);
                        this.object.pp_rotateAxis(fixAngle, referenceRight);
                    }

                    this.object.pp_rotateAxis(this.rotationX, referenceUp);
                }
            };
        }().bind(this));

        if (this.requireMouseDown) {
            if (this.mouseButtonIndex == 2) {
                WL.canvas.addEventListener("contextmenu", function (e) {
                    e.preventDefault();
                }, false);
            }
            WL.canvas.addEventListener('mousedown', function (e) {
                if (e.button == this.mouseButtonIndex) {
                    this.mouseDown = true;
                    WL.canvas.style.cursor = "grabbing";
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
                    WL.canvas.style.cursor = "initial";
                }
            }.bind(this));
            WL.canvas.addEventListener('mouseleave', function (e) {
                this.mouseDown = false;
                WL.canvas.style.cursor = "initial";
            }.bind(this));

            WL.canvas.addEventListener('touchstart', function (e) {
                this.mouseDown = true;
                WL.canvas.style.cursor = "grabbing";
            }.bind(this));
            WL.canvas.addEventListener('touchend', function (e) {
                this.mouseDown = false;
                WL.canvas.style.cursor = "initial";
            }.bind(this));
        }
    };
} else {
    console.error("Wonderland Engine \"mouse-look\" component not found.\n Add the component to your project to avoid any issue with the PP bundle.");
}