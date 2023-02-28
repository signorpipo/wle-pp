

PP.PlayerLocomotionMovementRuntimeParams = class PlayerLocomotionMovementRuntimeParams {
    constructor() {
        this.myIsFlying = false;
        this.myCollisionRuntimeParams = null;

        this.myIsTeleportDetecting = false;
        this.myIsTeleporting = false;
        this.myTeleportJustPerformed = false;
    }
};

PP.PlayerLocomotionMovement = class PlayerLocomotionMovement {
    constructor(locomotionRuntimeParams) {
        this._myLocomotionRuntimeParams = locomotionRuntimeParams;
    }

    start() {

    }

    stop() {

    }

    canStop() {
        return true;
    }
};