PP.DebugAxes = class DebugAxes {

    constructor(autoRefresh = true) {
        this._myDebugRight = new PP.DebugLine();
        this._myDebugRight.setColor([1, 0, 0, 1]);
        this._myDebugUp = new PP.DebugLine();
        this._myDebugUp.setColor([0, 1, 0, 1]);
        this._myDebugForward = new PP.DebugLine();
        this._myDebugForward.setColor([0, 0, 1, 1]);

        this._myTransform = glMatrix.mat4.create();
        this._myAxesLength = 0.1;
        this._myPositionOffset = [0, 0, 0];

        this._myVisible = true;
        this._myDirty = false;
        this._myAutoRefresh = autoRefresh;

        this._myDebugRight.setVisible(this._myVisible);
        this._myDebugUp.setVisible(this._myVisible);
        this._myDebugForward.setVisible(this._myVisible);

        this._myDebugRight.setAutoRefresh(false);
        this._myDebugUp.setAutoRefresh(false);
        this._myDebugForward.setAutoRefresh(false);
    }

    setVisible(visible) {
        this._myVisible = visible;
        this._myDebugRight.setVisible(visible);
        this._myDebugUp.setVisible(visible);
        this._myDebugForward.setVisible(visible);
    }

    setAutoRefresh(autoRefresh) {
        this._myAutoRefresh = autoRefresh;
        this._myDebugRight.setAutoRefresh(autoRefresh);
        this._myDebugUp.setAutoRefresh(autoRefresh);
        this._myDebugForward.setAutoRefresh(autoRefresh);
    }

    setTransform(transform) {
        if (transform.length == 8) {
            transform.quat2_toMatrix(this._myTransform);
        } else {
            this._myTransform.mat4_copy(transform);
        }

        this._markDirty();
    }

    setAxesLength(length) {
        this._myAxesLength = length;

        this._markDirty();
    }

    setPositionOffset(offset) {
        this._myPositionOffset.vec3_copy(offset);

        this._markDirty();
    }

    update(dt) {
        if (this._myDirty) {
            this._refreshAxes(dt);

            this._myDebugForward.update(dt);
            this._myDebugUp.update(dt);
            this._myDebugRight.update(dt);

            this._myDirty = false;
        }
    }

    _refreshAxes(dt) {
        let axes = this._myTransform.mat4_getAxes();
        let position = this._myTransform.mat4_getPosition();
        position.vec3_add(this._myPositionOffset, position);
        this._myDebugRight.setStartDirectionLength(position, axes[0], this._myAxesLength);
        this._myDebugUp.setStartDirectionLength(position, axes[1], this._myAxesLength);
        this._myDebugForward.setStartDirectionLength(position, axes[2], this._myAxesLength);
    }

    _markDirty() {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this._refreshAxes(0);
            this._myDebugForward._refreshLine(0);
            this._myDebugUp._refreshLine(0);
            this._myDebugRight._refreshLine(0);
        }
    }
}