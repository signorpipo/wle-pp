/*
let visualParams = new PP.VisualTextParams();
visualParams.myText = text;
visualParams.myTransform.mat4_copy(transform);
visualParams.myMaterial = PP.myDefaultResources.myMaterials.myText.clone();
visualParams.myMaterial.color = PP.vec4_create(1, 1, 1, 1);
PP.myVisualManager.draw(visualParams);

or

let visualText = new PP.VisualText(visualParams);
*/

PP.VisualTextParams = class VisualTextParams {

    constructor() {
        this.myText = "";
        this.myAlignment = WL.Alignment.Center;
        this.myJustification = WL.Justification.Middle;

        this.myTransform = PP.mat4_create();

        this.myMaterial = null;     // null means it will default on PP.myDefaultResources.myMaterials.myDefaultTextMaterial

        this.myColor = null;        // if this is set and material is null, it will use the default text material with this color

        this.myParent = PP.myVisualData.myRootObject;
        this.myIsLocal = false;

        this.myType = PP.VisualElementType.TEXT;
    }

    copy(other) {
        // implemented outside class definition
    }
};

PP.VisualText = class VisualText {

    constructor(params = new PP.VisualTextParams()) {
        this._myParams = params;

        this._myVisible = false;
        this._myAutoRefresh = true;

        this._myDirty = false;

        this._myTextObject = null;
        this._myTextComponent = null;

        this._myTextMaterial = null;

        this._build();
        this.forceRefresh();

        this.setVisible(true);
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

    copyParams(params) {
        this._myParams.copy(params);
        this._markDirty();
    }

    paramsUpdated() {
        this._markDirty();
    }

    refresh() {
        this.update(0);
    }

    forceRefresh() {
        this._refresh();
    }

    update(dt) {
        if (this._myDirty) {
            this._refresh();

            this._myDirty = false;
        }
    }

    _refresh() {
        this._myTextObject.pp_setParent(this._myParams.myParent, false);

        if (this._myParams.myIsLocal) {
            this._myTextObject.pp_setTransformLocal(this._myParams.myTransform);
        } else {
            this._myTextObject.pp_setTransform(this._myParams.myTransform);
        }

        if (this._myParams.myMaterial == null) {
            if (this._myParams.myColor == null) {
                this._myTextComponent.material = PP.myVisualData.myDefaultMaterials.myDefaultTextMaterial;
            } else {
                if (this._myTextMaterial == null) {
                    this._myTextMaterial = PP.myDefaultResources.myMaterials.myText.clone();
                }
                this._myTextComponent.material = this._myTextMaterial;
                this._myTextMaterial.color = this._myParams.myColor;
            }
        } else {
            this._myTextComponent.material = this._myParams.myMaterial;
        }

        this._myTextComponent.text = this._myParams.myText;
        this._myTextComponent.alignment = this._myParams.myAlignment;
        this._myTextComponent.justification = this._myParams.myJustification;

        this._myDirty = false;
    }

    _build() {
        this._myTextObject = WL.scene.addObject(null);
        this._myTextComponent = this._myTextObject.addComponent('text');
    }

    _markDirty() {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this.update(0);
        }
    }

    clone() {
        let clonedParams = new PP.VisualTextParams();
        clonedParams.copy(this._myParams);

        let clone = new PP.VisualText(clonedParams);
        clone.setAutoRefresh(this._myAutoRefresh);
        clone.setVisible(this._myVisible);
        clone._myDirty = this._myDirty;

        return clone;
    }
};

PP.VisualTextParams.prototype.copy = function copy(other) {
    this.myText = other.myText;
    this.myAlignment = other.myAlignment;
    this.myJustification = other.myJustification;

    this.myTransform.mat4_copy(other.myTransform);

    if (other.myMaterial != null) {
        this.myMaterial = other.myMaterial.clone();
    } else {
        this.myMaterial = null;
    }

    if (other.myColor != null) {
        if (this.myColor != null) {
            this.myColor.vec4_copy(other.myColor);
        } else {
            this.myColor = other.myColor.vec4_clone();
        }
    } else {
        this.myColor = null;
    }

    this.myParent = other.myParent;
    this.myIsLocal = other.myIsLocal;

    this.myType = other.myType;
};



Object.defineProperty(PP.VisualTextParams.prototype, "copy", { enumerable: false });