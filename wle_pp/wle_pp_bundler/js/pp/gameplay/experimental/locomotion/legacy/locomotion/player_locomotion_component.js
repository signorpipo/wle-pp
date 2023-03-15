WL.registerComponent('pp-player-locomotion', {
    _myPhysicsBlockLayerFlags: { type: WL.Type.String, default: "1, 0, 0, 0, 0, 0, 0, 0" },
    _myMaxSpeed: { type: WL.Type.Float, default: 2 },
    _myMaxRotationSpeed: { type: WL.Type.Float, default: 100 },
    _myCharacterRadius: { type: WL.Type.Float, default: 0.3 },
    _myIsSnapTurn: { type: WL.Type.Bool, default: true },
    _mySnapTurnOnlyVR: { type: WL.Type.Bool, default: true },
    _mySnapTurnAngle: { type: WL.Type.Float, default: 30 },
    _mySnapTurnSpeedDegrees: { type: WL.Type.Float, default: 0 },
    _myFlyEnabled: { type: WL.Type.Bool, default: false },
    _myMinAngleToFlyUpNonVR: { type: WL.Type.Float, default: 30 },
    _myMinAngleToFlyDownNonVR: { type: WL.Type.Float, default: 50 },
    _myMinAngleToFlyUpVR: { type: WL.Type.Float, default: 60 },
    _myMinAngleToFlyDownVR: { type: WL.Type.Float, default: 1 },
    _myMinAngleToFlyRight: { type: WL.Type.Float, default: 60 },
    _myMainHand: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myVRDirectionReferenceType: { type: WL.Type.Enum, values: ['head', 'hand', 'custom object'], default: 'hand' },
    _myVRDirectionReferenceObject: { type: WL.Type.Object },
    _myTeleportParableStartReferenceObject: { type: WL.Type.Object },
    _myTeleportPositionObject: { type: WL.Type.Object },
    _myUseCleanedVersion: { type: WL.Type.Bool, default: true },
    _myMoveThroughCollisionShortcutEnabled: { type: WL.Type.Bool, default: false },
    _myMoveHeadShortcutEnabled: { type: WL.Type.Bool, default: false },
}, {
    init() {
    },
    start() {
        PP.myCollisionCheck = new PP.CollisionCheck();
        let params = new PP.PlayerLocomotionParams();
        params.myMaxSpeed = this._myMaxSpeed;
        params.myMaxRotationSpeed = this._myMaxRotationSpeed;

        params.myCharacterRadius = this._myCharacterRadius;

        params.myIsSnapTurn = this._myIsSnapTurn;
        params.mySnapTurnOnlyVR = this._mySnapTurnOnlyVR;
        params.mySnapTurnAngle = this._mySnapTurnAngle;
        params.mySnapTurnSpeedDegrees = this._mySnapTurnSpeedDegrees;

        params.myFlyEnabled = this._myFlyEnabled;
        params.myMinAngleToFlyUpNonVR = this._myMinAngleToFlyUpNonVR;
        params.myMinAngleToFlyDownNonVR = this._myMinAngleToFlyDownNonVR;
        params.myMinAngleToFlyUpVR = this._myMinAngleToFlyUpVR;
        params.myMinAngleToFlyDownVR = this._myMinAngleToFlyDownVR;
        params.myMinAngleToFlyRight = this._myMinAngleToFlyRight;

        params.myMainHand = PP.InputUtils.getHandednessByIndex(this._myMainHand);

        params.myVRDirectionReferenceType = this._myVRDirectionReferenceType;
        params.myVRDirectionReferenceObject = this._myVRDirectionReferenceObject;

        params.myTeleportParableStartReferenceObject = this._myTeleportParableStartReferenceObject;

        params.myForeheadExtraHeight = 0.1;

        params.myTeleportPositionObject = this._myTeleportPositionObject;

        params.myMoveThroughCollisionShortcutEnabled = this._myMoveThroughCollisionShortcutEnabled;
        params.myMoveHeadShortcutEnabled = this._myMoveHeadShortcutEnabled;

        params.myPhysicsBlockLayerFlags.copy(this._getPhysicsBlockLayersFlags());

        if (this._myUseCleanedVersion) {
            this._myPlayerLocomotion = new PP.CleanedPlayerLocomotion(params);
        } else {
            this._myPlayerLocomotion = new PP.PlayerLocomotion(params);
        }

        this._myStartCounter = 1;
    },
    update(dt) {
        if (this._myStartCounter > 0) {
            this._myStartCounter--;
            if (this._myStartCounter == 0) {
                this._myPlayerLocomotion.start();

                this._myPlayerLocomotion._myPlayerTransformManager.resetReal(true, false, false, true);
                this._myPlayerLocomotion._myPlayerTransformManager.resetHeadToReal();
            }

            this._myPlayerLocomotion._myPlayerHeadManager.update(dt);
        } else {
            PP.myCollisionCheck._myTotalRaycasts = 0; // #TODO debug stuff, remove later

            this._myPlayerLocomotion.update(dt);
        }

        //PP.myCollisionCheck._myTotalRaycastsMax = Math.max(PP.myCollisionCheck._myTotalRaycasts, PP.myCollisionCheck._myTotalRaycastsMax);
        //console.error(PP.myCollisionCheck._myTotalRaycastsMax);
        //console.error(PP.myCollisionCheck._myTotalRaycasts);
    },
    onActivate() {
        if (this._myStartCounter == 0) {
            if (this._myPlayerLocomotion != null) {
                this._myPlayerLocomotion.setActive(true);
            }
        }
    },
    onDeactivate() {
        if (this._myStartCounter == 0) {
            if (this._myPlayerLocomotion != null) {
                this._myPlayerLocomotion.setActive(false);
            }
        }
    },
    _getPhysicsBlockLayersFlags() {
        let physicsFlags = new PP.PhysicsLayerFlags();

        let flags = [...this._myPhysicsBlockLayerFlags.split(",")];
        for (let i = 0; i < flags.length; i++) {
            physicsFlags.setFlagActive(i, flags[i].trim() == "1");
        }

        return physicsFlags;
    }
});

PP.myCollisionCheck = null;