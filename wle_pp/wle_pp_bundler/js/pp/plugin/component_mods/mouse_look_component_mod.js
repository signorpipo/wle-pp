if (_WL && _WL._componentTypes && _WL._componentTypes[_WL._componentTypeIndices["mouse-look"]]) {

    // Modified Functions

    _WL._componentTypes[_WL._componentTypeIndices["mouse-look"]].proto.init = function () {
        document.addEventListener('mousemove', function (e) {
            if (this.active && (this.mouseDown || !this.requireMouseDown)) {

                let viewForward = this.object.pp_getBackward(); // the view "real" forward is actually the backward
                let viewUp = this.object.pp_getUp();

                let referenceUp = [0, 1, 0];
                if (this.object.pp_getParent() != null) {
                    referenceUp = this.object.pp_getParent().pp_getUp();
                }

                let referenceRight = viewForward.vec3_cross(referenceUp);

                let minAngle = 1;
                if (viewForward.vec3_angle(referenceUp) < minAngle) {
                    referenceRight = viewUp.vec3_negate().vec3_cross(referenceUp);
                } else if (viewForward.vec3_angle(referenceUp.vec3_negate()) < minAngle) {
                    referenceRight = viewUp.vec3_cross(referenceUp);
                } else if (!viewUp.vec3_isConcordant(referenceUp)) {
                    referenceRight.vec3_negate(referenceRight);
                }
                referenceRight.vec3_normalize(referenceRight);

                this.rotationX = -this.sensitity * e.movementX;
                this.rotationY = -this.sensitity * e.movementY;

                this.object.pp_rotateAxis(this.rotationY, referenceRight);

                let maxVerticalAngle = 90 - 0.001;
                let newUp = this.object.pp_getUp();
                let angleWithUp = Math.pp_angleClamp(newUp.vec3_angleSigned(referenceUp, referenceRight));
                if (Math.abs(angleWithUp) > maxVerticalAngle) {
                    let fixAngle = (Math.abs(angleWithUp) - maxVerticalAngle) * Math.pp_sign(angleWithUp);
                    this.object.pp_rotateAxis(fixAngle, referenceRight);
                }

                this.object.pp_rotateAxis(this.rotationX, referenceUp);
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
            WL.canvas.addEventListener('mouseleave', function (e) {
                this.mouseDown = false;
                document.body.style.cursor = "initial";
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