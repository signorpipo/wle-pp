import { CollisionComponent, MeshComponent, TextComponent } from "@wonderlandengine/api";
import { CursorTarget } from "@wonderlandengine/components";
import { XRUtils } from "../../cauldron/utils/xr_utils";
import { InputUtils } from "../../input/cauldron/input_utils";
import { vec3_create } from "../../plugin/js/extensions/array_extension";
import { Globals } from "../../pp/globals";
import { ToolHandedness, ToolInputSourceType } from "../cauldron/tool_types";

export class WidgetFrameUI {

    constructor(engine = Globals.getMainEngine()) {
        this._myInputSourceType = null;

        this._myParentObject = null;
        this._myPinned = false;

        this._myWidgetVisible = true;
        this._myVisibilityButtonVisible = true;

        this._myEngine = engine;

        this._myDestroyed = false;
    }

    build(parentObject, config, params) {
        this._myParentObject = parentObject;
        this._myConfig = config;
        this._myParams = params;
        this._myPlaneMesh = Globals.getDefaultMeshes(this._myEngine).myDoubleSidedPlane;

        this._createSkeleton();
        this._setTransforms();
        this._addComponents();

        this._setTransformForNonXR();

        XRUtils.registerSessionStartEndEventListeners(this, this._onXRSessionStart.bind(this), this._onXRSessionEnd.bind(this), true, false, this._myEngine);
    }

    setWidgetVisible(visible) {
        this._myWidgetVisible = visible;
        this.myFlagsButtonPanel.pp_setActive(visible);
        if (visible) {
            this._updateObjectsTransforms(true);
        }
    }

    setVisibilityButtonVisible(visible) {
        this._myVisibilityButtonVisible = visible;
        this.myVisibilityButtonPanel.pp_setActive(visible);
    }

    setPinned(pinned) {
        if (pinned != this._myPinned) {
            this._myPinned = pinned;
            if (this._myPinned) {
                this.myPivotObject.pp_setParent(Globals.getSceneObjects(this._myEngine).myTools);
            } else {
                this.myPivotObject.pp_setParent(this.myFixForwardObject);

                if (!XRUtils.isSessionActive(this._myEngine)) {
                    this._setTransformForNonXR();
                }

                this._updateObjectsTransforms(true);
            }
        }
    }

    update(dt) {
        this._updateObjectsTransforms(false);
    }

    _updateObjectsTransforms(forceRefreshObjectsTransforms) {
        if (XRUtils.isSessionActive(this._myEngine)) {
            let inputSourceType = InputUtils.getInputSourceTypeByHandedness(this._myParams.myHandedness, this._myEngine);

            if (inputSourceType != this._myInputSourceType || forceRefreshObjectsTransforms) {
                this._myInputSourceType = inputSourceType;

                if (!this._myPinned) {
                    this.myPivotObject.pp_setPositionLocal(this._myConfig.myPivotObjectTransforms[this._myInputSourceType][this._myParams.myHandedness].myPosition);
                    this.myPivotObject.pp_resetRotationLocal();
                    this.myPivotObject.pp_rotateObjectQuat(this._myConfig.myPivotObjectTransforms[this._myInputSourceType][this._myParams.myHandedness].myRotation);

                    this.myWidgetObject.pp_setPositionLocal(this._myConfig.myWidgetObjectTransforms[this._myInputSourceType][this._myParams.myHandedness].myPosition);
                    this.myWidgetObject.pp_resetRotationLocal();
                    this.myWidgetObject.pp_rotateObjectQuat(this._myConfig.myWidgetObjectTransforms[this._myInputSourceType][this._myParams.myHandedness].myRotation);

                    this.myVisibilityButtonPanel.pp_setPositionLocal(this._myConfig.myVisibilityButtonPosition[this._myParams.myHandedness].myPosition);
                    this.myPinButtonPanel.pp_setPositionLocal(this._myConfig.myPinButtonPosition[this._myParams.myHandedness].myPosition);
                }
            }
        } else {
            this.myVisibilityButtonPanel.pp_setActive(this._myWidgetVisible || this._myVisibilityButtonVisible);
        }
    }

    // Skeleton
    _createSkeleton() {
        this.myFixForwardObject = this._myParentObject.pp_addObject();

        if (Globals.isPoseForwardFixed(this._myEngine)) {
            this.myFixForwardObject.pp_rotateObject(vec3_create(0, 180, 0));
        }

        this.myPivotObject = this.myFixForwardObject.pp_addObject();
        this.myWidgetObject = this.myPivotObject.pp_addObject();

        this.myVisibilityButtonPanel = this.myPivotObject.pp_addObject();
        this.myVisibilityButtonBackground = this.myVisibilityButtonPanel.pp_addObject();
        this.myVisibilityButtonText = this.myVisibilityButtonPanel.pp_addObject();
        this.myVisibilityButtonCursorTarget = this.myVisibilityButtonPanel.pp_addObject();

        this.myFlagsButtonPanel = this.myPivotObject.pp_addObject();

        this.myPinButtonPanel = this.myFlagsButtonPanel.pp_addObject();
        this.myPinButtonBackground = this.myPinButtonPanel.pp_addObject();
        this.myPinButtonText = this.myPinButtonPanel.pp_addObject();
        this.myPinButtonCursorTarget = this.myPinButtonPanel.pp_addObject();

        this.myNonXRParentObject = Globals.getPlayerObjects(this._myEngine).myCameraNonXR.pp_addObject();
        this.myNonXRParentObject.pp_translateLocal(vec3_create(0, 0, -this._myConfig._myPivotObjectDistanceFromHeadNonXR));
        this.myNonXRParentObject.pp_lookToLocal(vec3_create(0, 0, 1), vec3_create(0, 1, 0));

    }

    // Transforms
    _setTransforms() {
        this.myPivotObject.pp_markDirty();

        this.myVisibilityButtonPanel.pp_setPositionLocal(this._myConfig.myVisibilityButtonPosition[this._myParams.myHandedness].myPosition);
        this.myVisibilityButtonBackground.pp_scaleObject(this._myConfig.myVisibilityButtonBackgroundScale);
        this.myVisibilityButtonText.pp_setPositionLocal(this._myConfig.myVisibilityButtonTextPosition);
        this.myVisibilityButtonText.pp_scaleObject(this._myConfig.myVisibilityButtonTextScale);
        this.myVisibilityButtonCursorTarget.pp_setPositionLocal(this._myConfig.myVisibilityButtonCursorTargetPosition);

        this.myPinButtonPanel.pp_setPositionLocal(this._myConfig.myPinButtonPosition[this._myParams.myHandedness].myPosition);

        this.myPinButtonBackground.pp_scaleObject(this._myConfig.myFlagButtonBackgroundScale);
        this.myPinButtonText.pp_setPositionLocal(this._myConfig.myFlagButtonTextPosition);
        this.myPinButtonText.pp_scaleObject(this._myConfig.myFlagButtonTextScale);
        this.myPinButtonCursorTarget.pp_setPositionLocal(this._myConfig.myPinButtonCursorTargetPosition);
    }

    // Components
    _addComponents() {
        this.myVisibilityButtonBackgroundComponent = this.myVisibilityButtonBackground.pp_addComponent(MeshComponent);
        this.myVisibilityButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myVisibilityButtonBackgroundComponent.material = this._myParams.myPlaneMaterial.clone();
        this.myVisibilityButtonBackgroundComponent.material.color = this._myConfig.myBackgroundColor;

        this.myVisibilityButtonTextComponent = this.myVisibilityButtonText.pp_addComponent(TextComponent);
        this._setupButtonTextComponent(this.myVisibilityButtonTextComponent);
        this.myVisibilityButtonTextComponent.text = this._myConfig.myVisibilityButtonText;

        this.myVisibilityButtonCursorTargetComponent = this.myVisibilityButtonCursorTarget.pp_addComponent(CursorTarget);
        this.myVisibilityButtonCollisionComponent = this.myVisibilityButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myVisibilityButtonCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myVisibilityButtonCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myVisibilityButtonCollisionComponent.extents = this._myConfig.myVisibilityButtonCollisionExtents;

        this.myPinButtonBackgroundComponent = this.myPinButtonBackground.pp_addComponent(MeshComponent);
        this.myPinButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myPinButtonBackgroundComponent.material = this._myParams.myPlaneMaterial.clone();
        this.myPinButtonBackgroundComponent.material.color = this._myConfig.myButtonDisabledBackgroundColor;

        this.myPinButtonTextComponent = this.myPinButtonText.pp_addComponent(TextComponent);
        this._setupButtonTextComponent(this.myPinButtonTextComponent);
        this.myPinButtonTextComponent.material.color = this._myConfig.myButtonDisabledTextColor;
        this.myPinButtonTextComponent.text = this._myConfig.myPinButtonText;

        this.myPinButtonCursorTargetComponent = this.myPinButtonCursorTarget.pp_addComponent(CursorTarget);

        this.myPinButtonCollisionComponent = this.myPinButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myPinButtonCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myPinButtonCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myPinButtonCollisionComponent.extents = this._myConfig.myPinButtonCollisionExtents;
    }

    _setupButtonTextComponent(textComponent) {
        textComponent.alignment = this._myConfig.myTextAlignment;
        textComponent.justification = this._myConfig.myTextJustification;
        textComponent.material = this._myParams.myTextMaterial.clone();
        textComponent.material.color = this._myConfig.myTextColor;
        textComponent.text = "";
    }

    _onXRSessionStart() {
        this.myVisibilityButtonPanel.pp_setActive(this._myVisibilityButtonVisible);

        this._setTransformForXR();
    }

    _onXRSessionEnd() {
        this._setTransformForNonXR();
    }

    _setTransformForXR() {
        this.myFixForwardObject.pp_setParent(this._myParentObject);

        this.myFixForwardObject.pp_resetTransformLocal();

        if (Globals.isPoseForwardFixed(this._myEngine)) {
            this.myFixForwardObject.pp_rotateObject(vec3_create(0, 180, 0));
        }

        this._updateObjectsTransforms(true);
    }

    _setTransformForNonXR() {
        if (!this._myPinned) {
            this.myFixForwardObject.pp_setParent(this.myNonXRParentObject);
            this.myFixForwardObject.pp_resetTransformLocal();

            this.myPivotObject.pp_setPositionLocal(this._myConfig.myPivotObjectTransforms[ToolInputSourceType.NONE][ToolHandedness.NONE].myPosition);
            this.myPivotObject.pp_resetRotationLocal();
            this.myPivotObject.pp_rotateObjectQuat(this._myConfig.myPivotObjectTransforms[ToolInputSourceType.NONE][ToolHandedness.NONE].myRotation);

            this.myWidgetObject.pp_setPositionLocal(this._myConfig.myWidgetObjectTransforms[ToolInputSourceType.NONE][ToolHandedness.NONE].myPosition);
            this.myWidgetObject.pp_resetRotationLocal();
            this.myWidgetObject.pp_rotateObjectQuat(this._myConfig.myWidgetObjectTransforms[ToolInputSourceType.NONE][ToolHandedness.NONE].myRotation);

            this.myVisibilityButtonPanel.pp_setPositionLocal(this._myConfig.myVisibilityButtonPosition[ToolHandedness.NONE].myPosition);
            this.myPinButtonPanel.pp_setPositionLocal(this._myConfig.myPinButtonPosition[ToolHandedness.NONE].myPosition);
        }
    }

    destroy() {
        this._myDestroyed = true;

        XRUtils.unregisterSessionStartEndEventListeners(this, this._myEngine);
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}