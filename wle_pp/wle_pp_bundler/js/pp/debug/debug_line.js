PP.DebugLine = class DebugLine {

    constructor(autoRefresh = true) {
        this._myLineRootObject = null;
        this._myLineObject = null;

        this._myStartPosition = [0, 0, 0];
        this._myDirection = [0, 0, 1];
        this._myLength = 0;

        this._myThickness = 0.005;

        this._myColor = [0.7, 0.7, 0.7, 1];

        this._myVisible = true;

        this._myDirty = false;

        this._myAutoRefresh = autoRefresh;

        this._buildLine();
        this.setVisible(false);
    }

    setVisible(visible) {
        if (this._myVisible != visible) {
            this._myVisible = visible;
            this._myLineRootObject.pp_setActive(visible);
        }
    }

    setAutoRefresh(autoRefresh) {
        this._myAutoRefresh = autoRefresh;
    }

    setStartEnd(start, end) {
        let direction = [];
        end.vec3_sub(start, direction);
        let length = direction.vec3_length();
        direction.vec3_normalize(direction);

        this.setStartDirectionLength(start, direction, length);
    }

    setStartDirectionLength(start, direction, length) {
        this._myStartPosition.vec3_copy(start);
        this._myDirection.vec3_copy(direction);
        this._myLength = length;

        this._markDirty();
    }

    setColor(color) {
        this._myColor.vec4_copy(color);

        this._markDirty();
    }

    setThickness(thickness) {
        this._myThickness = thickness;

        this._markDirty();
    }

    update(dt) {
        if (this._myDirty) {
            this._refreshLine(dt);

            this._myDirty = false;
        }
    }

    _refreshLine(dt) {
        this._myLineRootObject.pp_setPosition(this._myStartPosition);

        this._myLineObject.pp_resetTransformLocal();

        this._myLineObject.pp_scaleObject([this._myThickness / 2, this._myThickness / 2, this._myLength / 2]);

        this._myLineObject.pp_lookTo(this._myDirection);
        this._myLineObject.pp_translateObject([0, 0, this._myLength / 2]);

        this._myLineMesh.material.color = this._myColor;
    }

    _buildLine() {
        this._myLineRootObject = WL.scene.addObject(PP.myDebugData.myRootObject);
        this._myLineObject = WL.scene.addObject(this._myLineRootObject);
        this._myLineObject.scale([0.01, 0.01, 0.01]);

        this._myLineMesh = this._myLineObject.addComponent('mesh');
        this._myLineMesh.mesh = PP.myDebugData.myCubeMesh;
        this._myLineMesh.material = PP.myDebugData.myFlatMaterial.clone();
    }

    _markDirty() {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this._refreshLine(0);
        }
    }
};