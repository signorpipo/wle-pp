PP.DebugTextParams = class DebugTextParams {

    constructor() {
        this.myText = "";
        this.myAlignment = WL.Alignment.Center;
        this.myJustification = WL.Justification.Middle;
        this.myColor = [0, 1, 0, 1];

        this.myPosition = [0, 0, 0];
        this.myForward = [0, 0, 1];
        this.myUp = [0, 1, 0];
        this.myScale = [1, 1, 1];

        this.myType = PP.DebugDrawObjectType.TEXT;
    }
};

PP.DebugText = class DebugText {

    constructor(params = new PP.DebugTextParams()) {
        this._myParams = params;

        this._myTextObject = null;

        this._myVisible = true;
        this._myDirty = false;
        this._myAutoRefresh = true;

        this._build();
        this._refresh();
        this.setVisible(false);
    }

    setVisible(visible) {
        if (this._myVisible != visible) {
            this._myVisible = visible;
            this._myTextObject.pp_setActive(visible);
        }
    }

    setAutoRefresh(autoRefresh) {
        this._myAutoRefresh = autoRefresh;
    }

    getParams() {
        return this._myParams;
    }

    setParams(params) {
        this._myParams = params;
        this._markDirty();
    }

    setText(text) {
        this._myParams.myText = text;
        this._markDirty();
    }

    setAlignment(alignment) {
        this._myParams.myAlignment = alignment;
        this._markDirty();
    }

    setJustification(justification) {
        this._myParams.myJustification = justification;
        this._markDirty();
    }

    setPosition(position) {
        this._myParams.myPosition.vec3_copy(position);
        this._markDirty();
    }

    setForward(forward) {
        this._myParams.myForward.vec3_copy(forward);
        this._markDirty();
    }

    setUp(up) {
        this._myParams.myUp.vec3_copy(up);
        this._markDirty();
    }

    setScale(scale) {
        this._myParams.myScale.vec3_copy(scale);
        this._markDirty();
    }

    setColor(color) {
        this._myParams.myColor.vec4_copy(color);
        this._markDirty();
    }

    refresh() {
        this.update(0);
    }

    update(dt) {
        if (this._myDirty) {
            this._refresh();
            this._myDirty = false;
        }
    }

    _refresh() {
        this._myTextObject.pp_setPosition(this._myParams.myPosition);
        this._myTextObject.pp_setForward(this._myParams.myForward, this._myParams.myUp);
        this._myTextObject.pp_setScale(this._myParams.myScale);

        this._myTextComponent.text = this._myParams.myText;
        this._myTextComponent.alignment = this._myParams.myAlignment;
        this._myTextComponent.justification = this._myParams.myJustification;
        this._myTextComponent.material.color = this._myParams.myColor;

        this._myDirty = false;
    }

    _build() {
        this._myTextObject = WL.scene.addObject(PP.myDebugData.myRootObject);
        this._myTextComponent = this._myTextObject.addComponent('text');

        this._myTextComponent.material = PP.myDebugData.myTextMaterial.clone();
    }

    _markDirty() {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this.update(0);
        }
    }

    clone() {
        let clonedParams = new PP.DebugTextParams();

        clonedParams.myText = this._myParams.myText.slice(0);
        clonedParams.myAlignment = this._myParams.myAlignment;
        clonedParams.myJustification = this._myParams.myJustification;

        clonedParams.myPosition.pp_copy(this._myParams.myPosition);
        clonedParams.myForward.pp_copy(this._myParams.myForward);
        clonedParams.myUp.pp_copy(this._myParams.myUp);
        clonedParams.myScale.pp_copy(this._myParams.myScale);
        clonedParams.myColor.pp_copy(this._myParams.myColor);

        let clone = new PP.DebugText(clonedParams);
        clone.setAutoRefresh(this._myAutoRefresh);
        clone.setVisible(this._myVisible);
        clone._myDirty = this._myDirty;

        return clone;
    }
};