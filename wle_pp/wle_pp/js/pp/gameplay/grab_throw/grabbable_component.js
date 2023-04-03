import { Component, Property, PhysXComponent } from "@wonderlandengine/api";
import { vec3_create } from "../../plugin/js/extensions/array_extension";

export class GrabbableComponent extends Component {
    static TypeName = "pp-grabbable";
    static Properties = {
        _myThrowLinearVelocityMultiplier: Property.float(1),
        _myThrowAngularVelocityMultiplier: Property.float(1),
        _myKinematicValueOnRelease: Property.enum(["True", "False", "Own"], "False"),
        _myParentOnRelease: Property.enum(["Root", "Own"], "Own")
    };

    init() {
        this._myIsGrabbed = false;

        this._myGrabber = null;

        this._myGrabCallbacks = new Map();      // Signature: callback(grabber, grabbable)
        this._myThrowCallbacks = new Map();     // Signature: callback(grabber, grabbable)
        this._myReleaseCallbacks = new Map();   // Signature: callback(grabber, grabbable, isThrow)
    }

    start() {
        this._myOldParent = this.object.pp_getParent();
        this._myPhysX = this.object.pp_getComponent(PhysXComponent);
        this._myOldKinematicValue = null;
    }

    onDeactivate() {
        this.release();
    }

    grab(grabber) {
        if (!this.isGrabbed()) {
            this._myOldKinematicValue = this._myPhysX.kinematic;
        }

        this.release();

        this._myPhysX.kinematic = true;

        this._myOldParent = this.object.pp_getParent();
        this.object.pp_setParent(grabber);

        this._myIsGrabbed = true;

        this._myGrabCallbacks.forEach(function (callback) { callback(grabber, this); }.bind(this));
    }

    throw(linearVelocity, angularVelocity) {
        if (this._myIsGrabbed) {
            let grabber = this._myGrabber;

            this._release();

            // #TODO For now kinematic is not updated instantly, add the if as soon as it is
            //if (!this._myPhysX.kinematic) {
            this._myPhysX.linearVelocity = linearVelocity.vec3_scale(this._myThrowLinearVelocityMultiplier);
            this._myPhysX.angularVelocity = angularVelocity.vec3_scale(this._myThrowAngularVelocityMultiplier);
            //}

            this._myThrowCallbacks.forEach(function (callback) { callback(grabber, this); }.bind(this));
            this._myReleaseCallbacks.forEach(function (callback) { callback(grabber, this, true); }.bind(this));
        }
    }

    release() {
        if (this._myIsGrabbed) {
            let grabber = this._myGrabber;

            this._release();

            this._myReleaseCallbacks.forEach(function (callback) { callback(grabber, this, false); }.bind(this));
        }
    }

    getLinearVelocity() {
        let linearVelocity = vec3_create();

        this._myPhysX.linearVelocity.vec3_clone(linearVelocity);

        return linearVelocity;
    }

    getAngularVelocity() {
        return this.getAngularVelocityDegrees();
    }

    getAngularVelocityDegrees() {
        let angularVelocityDegrees = vec3_create();

        this._myPhysX.angularVelocity.vec3_toDegrees(angularVelocityDegrees);

        return angularVelocityDegrees;
    }

    getAngularVelocityRadians() {
        let angularVelocityRadians = vec3_create();

        this._myPhysX.angularVelocity.vec3_clone(angularVelocityRadians);

        return angularVelocityRadians;
    }

    isGrabbed() {
        return this._myIsGrabbed;
    }

    getGrabber() {
        return this._myGrabber;
    }

    registerGrabEventListener(id, callback) {
        this._myGrabCallbacks.set(id, callback);
    }

    unregisterGrabEventListener(id) {
        this._myGrabCallbacks.delete(id);
    }

    registerThrowEventListener(id, callback) {
        this._myThrowCallbacks.set(id, callback);
    }

    unregisterThrowEventListener(id) {
        this._myThrowCallbacks.delete(id);
    }

    registerReleaseEventListener(id, callback) {
        this._myReleaseCallbacks.set(id, callback);
    }

    unregisterReleaseEventListener(id) {
        this._myReleaseCallbacks.delete(id);
    }

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
            this._myPhysX.linearVelocity = vec3_create();
            this._myPhysX.angularVelocity = vec3_create();
        }
    }

    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        clonedComponent.active = this.active;

        clonedComponent._myThrowLinearVelocityMultiplier = this._myThrowLinearVelocityMultiplier;
        clonedComponent._myThrowAngularVelocityMultiplier = this._myThrowAngularVelocityMultiplier;
        clonedComponent._myKinematicValueOnRelease = this._myKinematicValueOnRelease;

        return clonedComponent;
    }

    pp_clonePostProcess() {
        this.start();
    }
}