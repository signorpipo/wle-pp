export class PlayerLocomotionMovementRuntimeParams {

    constructor() {
        this.myIsFlying = false;
        this.myGravitySpeed = 0;

        this.myIsTeleportDetecting = false;
        this.myIsTeleporting = false;
        this.myTeleportJustPerformed = false;
    }
}

export class PlayerLocomotionMovement {

    constructor(locomotionRuntimeParams) {
        this._myLocomotionRuntimeParams = locomotionRuntimeParams;

        this._myActive = false;
    }

    getRuntimeParams() {
        return this._myLocomotionRuntimeParams;
    }

    start() {

    }

    stop() {

    }

    setActive(active) {
        this._myActive = active;
    }

    isActive() {
        return this._myActive;
    }

    canStop() {
        return true;
    }
}