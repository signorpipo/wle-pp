WL.registerComponent('pp-finger-cursor', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myEnableMultipleClicks: { type: WL.Type.Bool, default: true },
    _myCollisionGroup: { type: WL.Type.Int, default: 1 },
    _myCollisionSize: { type: WL.Type.Float, default: 0.0125 },
    _myCursorObject: { type: WL.Type.Object, default: null }
}, {
    init: function () {
        this._myLastTarget = null;
        this._myReferenceSpace = null;
        this._myHandInputSource = null;
        this._myHandednessString = ['left', 'right'][this._myHandedness];

        this._myDoubleClickTimer = 0;
        this._myTripleClickTimer = 0;
        this._myMultipleClickObject = null;
        this._myMultipleClickDelay = 0.3;
    },
    start: function () {
        this._myCursorObjectRoot = WL.scene.addObject(this.object);

        if (this._myCursorObject == null) {
            this._myCursorObject = this._myCursorObjectRoot.pp_addObject();
        } else {
            this._myCursorObject.pp_setParent(this._myCursorObjectRoot);
        }

        this._myCollisionComponent = this._myCursorObject.addComponent('collision');
        this._myCollisionComponent.collider = WL.Collider.Sphere;
        this._myCollisionComponent.group = 1 << this._myCollisionGroup;
        this._myCollisionComponent.extents = PP.vec3_create(this._myCollisionSize, this._myCollisionSize, this._myCollisionSize);

        if (WL.xrSession) {
            this._onXRSessionStart(WL.xrSession);
        }
        WL.onXRSessionStart.push(this._onXRSessionStart.bind(this));
        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));
    },
    update: function (dt) {
        if (this._myDoubleClickTimer > 0) {
            this._myDoubleClickTimer -= dt;
        }

        if (this._myTripleClickTimer > 0) {
            this._myTripleClickTimer -= dt;
        }

        this._myCursorObjectRoot.pp_setTransformQuat(PP.myPlayerObjects.myPlayerPivot.pp_getTransformQuat());
        this._updateHand();

        if (this._myHandInputSource) {
            let overlaps = this._myCollisionComponent.queryOverlaps();
            let overlapTarget = null;
            for (let i = 0; i < overlaps.length; ++i) {
                let object = overlaps[i].object;
                let target = object.getComponent('cursor-target');
                if (target && (overlapTarget == null || !target.isSurface)) {
                    overlapTarget = target;
                    if (!target.isSurface) {
                        break;
                    }
                }
            }

            if (!overlapTarget) {
                this._targetTouchEnd();
            } else if (!overlapTarget.equals(this._myLastTarget)) {
                this._targetTouchEnd();

                this._myLastTarget = overlapTarget;

                this._targetTouchStart();
            }
        } else {
            this._targetTouchEnd();
        }
    },
    _targetTouchStart: function () {
        this._myLastTarget.onHover(this._myLastTarget.object, this);
        this._myLastTarget.onDown(this._myLastTarget.object, this);
    },
    _targetTouchEnd: function () {
        if (this._myLastTarget) {
            if (this._myEnableMultipleClicks && this._myTripleClickTimer > 0 && this._myMultipleClickObject && this._myMultipleClickObject.equals(this._myLastTarget.object)) {
                this._myLastTarget.onTripleClick(this._myLastTarget.object, this);

                this._myTripleClickTimer = 0;
            } else if (this._myEnableMultipleClicks && this._myDoubleClickTimer > 0 && this._myMultipleClickObject && this._myMultipleClickObject.equals(this._myLastTarget.object)) {
                this._myLastTarget.onDoubleClick(this._myLastTarget.object, this);

                this._myTripleClickTimer = this._myMultipleClickDelay;
                this._myDoubleClickTimer = 0;
            } else {
                this._myLastTarget.onClick(this._myLastTarget.object, this);

                this._myTripleClickTimer = 0;
                this._myDoubleClickTimer = this._myMultipleClickDelay;
                this._myMultipleClickObject = this._myLastTarget.object;
            }

            this._myLastTarget.onUp(this._myLastTarget.object, this);
            this._myLastTarget.onUnhover(this._myLastTarget.object, this);

            this._myLastTarget = null;
        }
    },
    onActivate: function () {
        this._myCursorObjectRoot.pp_setActive(true);
    },
    onDeactivate: function () {
        this._myCursorObjectRoot.pp_setActive(false);
    },
    _updateHand() {
        this._myHandInputSource = PP.InputUtils.getInputSource(this._myHandednessString, PP.InputSourceType.TRACKED_HAND);

        if (this._myHandInputSource) {
            let tip = Module['webxr_frame'].getJointPose(this._myHandInputSource.hand.get("index-finger-tip"), this._myReferenceSpace);

            if (tip) {
                this._myCursorObject.pp_setRotationLocalQuat([
                    tip.transform.orientation.x,
                    tip.transform.orientation.y,
                    tip.transform.orientation.z,
                    tip.transform.orientation.w]);

                this._myCursorObject.pp_setPositionLocal([
                    tip.transform.position.x,
                    tip.transform.position.y,
                    tip.transform.position.z]);
            }
        }
    },
    _onXRSessionStart: function (session) {
        session.requestReferenceSpace(WebXR.refSpace).then(function (referenceSpace) { this._myReferenceSpace = referenceSpace; }.bind(this));
    },
    _onXRSessionEnd: function (session) {
        this._myReferenceSpace = null;
    }
});