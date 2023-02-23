WL.registerComponent('pp-grabbable', {
    _myThrowLinearVelocityMultiplier: { type: WL.Type.Float, default: 1 },
    _myThrowAngularVelocityMultiplier: { type: WL.Type.Float, default: 1 },
    _myKinematicValueOnRelease: { type: WL.Type.Enum, values: ['true', 'false', 'own'], default: 'false' },
    _myParentOnRelease: { type: WL.Type.Enum, values: ['null', 'own'], default: 'own' },
}, {
    init: function () {
        this._myIsGrabbed = false;

        this._myGrabber = null;

        this._myGrabCallbacks = new Map();      // Signature: callback(grabber, grabbable)
        this._myThrowCallbacks = new Map();     // Signature: callback(grabber, grabbable)
        this._myReleaseCallbacks = new Map();   // Signature: callback(grabber, grabbable, isThrow)
    },
    start: function () {
        this._myOldParent = this.object.parent;
        this._myPhysX = this.object.pp_getComponent('physx');
        this._myOldKinematicValue = null;
    },
    onDeactivate: function () {
        this.release();
    },
    grab: function (grabber) {
        if (!this.isGrabbed()) {
            this._myOldKinematicValue = this._myPhysX.kinematic;
        }

        this.release();

        this._myPhysX.kinematic = true;

        this._myOldParent = this.object.parent;
        this.object.pp_setParent(grabber);

        this._myIsGrabbed = true;

        this._myGrabCallbacks.forEach(function (callback) { callback(grabber, this); }.bind(this));
    },
    throw: function (linearVelocity, angularVelocity) {
        if (this._myIsGrabbed) {
            let grabber = this._myGrabber;

            this._release();

            //#TODO for now kinematic is not updated instantly, add the if as soon as it is
            //if (!this._myPhysX.kinematic) {
            this._myPhysX.linearVelocity = linearVelocity.vec3_scale(this._myThrowLinearVelocityMultiplier);
            this._myPhysX.angularVelocity = angularVelocity.vec3_scale(this._myThrowAngularVelocityMultiplier);
            //}

            this._myThrowCallbacks.forEach(function (callback) { callback(grabber, this); }.bind(this));
            this._myReleaseCallbacks.forEach(function (callback) { callback(grabber, this, true); }.bind(this));
        }
    },
    release() {
        if (this._myIsGrabbed) {
            let grabber = this._myGrabber;

            this._release();

            this._myReleaseCallbacks.forEach(function (callback) { callback(grabber, this, false); }.bind(this));
        }
    },
    getLinearVelocity() {
        let linearVelocity = PP.vec3_create();

        this._myPhysX.linearVelocity.vec3_clone(linearVelocity);

        return linearVelocity;
    },
    getAngularVelocity() {
        return this.getAngularVelocityDegrees();
    },
    getAngularVelocityDegrees() {
        let angularVelocityDegrees = PP.vec3_create();

        this._myPhysX.angularVelocity.vec3_toDegrees(angularVelocityDegrees);

        return angularVelocityDegrees;
    },
    getAngularVelocityRadians() {
        let angularVelocityRadians = PP.vec3_create();

        this._myPhysX.angularVelocity.vec3_clone(angularVelocityRadians);

        return angularVelocityRadians;
    },
    isGrabbed() {
        return this._myIsGrabbed;
    },
    getGrabber() {
        return this._myGrabber;
    },
    registerGrabEventListener(id, callback) {
        this._myGrabCallbacks.set(id, callback);
    },
    unregisterGrabEventListener(id) {
        this._myGrabCallbacks.delete(id);
    },
    registerThrowEventListener(id, callback) {
        this._myThrowCallbacks.set(id, callback);
    },
    unregisterThrowEventListener(id) {
        this._myThrowCallbacks.delete(id);
    },
    registerReleaseEventListener(id, callback) {
        this._myReleaseCallbacks.set(id, callback);
    },
    unregisterReleaseEventListener(id) {
        this._myReleaseCallbacks.delete(id);
    },
    _release() {
        if (this._myParentOnRelease == 0) {
            this.object.pp_setParent(null);
        } else {
            this.object.pp_setParent(this._myOldParent);
        }

        this._myIsGrabbed = false;
        this._myGrabber = null;

        if (this._myKinematicValueOnRelease == 0) {
            this._myPhysX.kinematic = true;
        } else if (this._myKinematicValueOnRelease == 1) {
            this._myPhysX.kinematic = false;
        } else if (this._myOldKinematicValue != null) {
            this._myPhysX.kinematic = this._myOldKinematicValue;
        }

        if (this._myPhysX.kinematic) {
            this._myPhysX.linearVelocity = PP.vec3_create();
            this._myPhysX.angularVelocity = PP.vec3_create();
        }
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);

        clonedComponent._myThrowLinearVelocityMultiplier = this._myThrowLinearVelocityMultiplier;
        clonedComponent._myThrowAngularVelocityMultiplier = this._myThrowAngularVelocityMultiplier;
        clonedComponent._myKinematicValueOnRelease = this._myKinematicValueOnRelease;

        return clonedComponent;
    },
    pp_clonePostProcess() {
        this.start();
    }
});