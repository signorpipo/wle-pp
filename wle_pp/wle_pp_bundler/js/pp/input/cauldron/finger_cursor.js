WL.registerComponent('pp-finger-cursor', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myEnableMultipleClicks: { type: WL.Type.Bool, default: true },
    _myCollisionGroup: { type: WL.Type.Int, default: 1 },
    _myCursorMesh: { type: WL.Type.Mesh, default: null },
    _myCursorMaterial: { type: WL.Type.Material, default: null },
    _myCursorSize: { type: WL.Type.Float, default: 0.0125 }
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
        this._myCursorObject = WL.scene.addObject(this.object.parent);
        this._myCursorObject.scale([this._myCursorSize, this._myCursorSize, this._myCursorSize]);

        if (this._myCursorMesh) {
            this._myCursorMeshComponent = this._myCursorObject.addComponent("mesh");
            this._myCursorMeshComponent.mesh = this._myCursorMesh;
            this._myCursorMeshComponent.material = this._myCursorMaterial.clone();
        }

        this._myCollisionComponent = this._myCursorObject.addComponent('collision');
        this._myCollisionComponent.collider = 0; //sphere
        this._myCollisionComponent.group = 1 << this._myCollisionGroup;
        this._myCollisionComponent.extents = [this._myCursorSize, this._myCursorSize, this._myCursorSize];

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
    setActive: function (active) {
        this._myCursorObject.pp_setActiveHierarchy(active);
        this.active = active;
    },
    _updateHand() {
        this._myHandInputSource = PP.InputUtils.getInputSource(this._myHandednessString, PP.InputSourceType.HAND);

        if (this._myHandInputSource) {
            let tip = Module['webxr_frame'].getJointPose(this._myHandInputSource.hand.get("index-finger-tip"), this._myReferenceSpace);

            if (tip) {
                this._myCursorObject.resetTransform();
                this._myCursorObject.transformLocal.set([
                    tip.transform.orientation.x,
                    tip.transform.orientation.y,
                    tip.transform.orientation.z,
                    tip.transform.orientation.w]);
                this._myCursorObject.translate([
                    tip.transform.position.x,
                    tip.transform.position.y,
                    tip.transform.position.z]);
                this._myCursorObject.scale([this._myCursorSize, this._myCursorSize, this._myCursorSize]);
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