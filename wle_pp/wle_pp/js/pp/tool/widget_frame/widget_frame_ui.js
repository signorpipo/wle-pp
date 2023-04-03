import { XRUtils } from "../../cauldron/utils/xr_utils";
import { InputUtils } from "../../input/cauldron/input_utils";
import { getMainEngine } from "../../cauldron/wl/engine_globals";
import { getPlayerObjects } from "../../pp/player_objects_global";
import { MeshComponent, CollisionComponent, TextComponent } from "@wonderlandengine/api";
import { CursorTarget } from "@wonderlandengine/components";
import { vec3_create } from "../../plugin/js/extensions/array_extension";
import { ToolHandedness, ToolInputSourceType } from "../cauldron/tool_types";
import { getDefaultResources } from "../../pp/default_resources_global";

export class WidgetFrameUI {

    constructor(engine = getMainEngine()) {
        this._myInputSourceType = null;

        this._myParentObject = null;
        this._myIsPinned = false;

        this._myWidgetVisible = true;
        this._myVisibilityButtonVisible = true;

        this._myEngine = engine;
    }

    build(parentObject, setup, additionalSetup) {
        this._myParentObject = parentObject;
        this._mySetup = setup;
        this._myAdditionalSetup = additionalSetup;
        this._myPlaneMesh = getDefaultResources(this._myEngine).myMeshes.myPlane;

        this._createSkeleton();
        this._setTransforms();
        this._addComponents();

        this._setTransformForNonVR();

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
        if (pinned != this._myIsPinned) {
            this._myIsPinned = pinned;
            if (this._myIsPinned) {
                this.myPivotObject.pp_setParent(null);
            } else {
                this.myPivotObject.pp_setParent(this.myFixForwardObject);

                if (!XRUtils.isSessionActive(this._myEngine)) {
                    this._setTransformForNonVR();
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
            let inputSourceType = InputUtils.getInputSourceTypeByHandedness(this._myAdditionalSetup.myHandedness, this._myEngine);

            if (inputSourceType != this._myInputSourceType || forceRefreshObjectsTransforms) {
                this._myInputSourceType = inputSourceType;

                if (!this._myIsPinned) {
                    this.myPivotObject.pp_setPositionLocal(this._mySetup.myPivotObjectTransforms[this._myInputSourceType][this._myAdditionalSetup.myHandedness].myPosition);
                    this.myPivotObject.pp_resetRotationLocal();
                    this.myPivotObject.pp_rotateObjectQuat(this._mySetup.myPivotObjectTransforms[this._myInputSourceType][this._myAdditionalSetup.myHandedness].myRotation);

                    this.myWidgetObject.pp_setPositionLocal(this._mySetup.myWidgetObjectTransforms[this._myInputSourceType][this._myAdditionalSetup.myHandedness].myPosition);
                    this.myWidgetObject.pp_resetRotationLocal();
                    this.myWidgetObject.pp_rotateObjectQuat(this._mySetup.myWidgetObjectTransforms[this._myInputSourceType][this._myAdditionalSetup.myHandedness].myRotation);

                    this.myVisibilityButtonPanel.pp_setPositionLocal(this._mySetup.myVisibilityButtonPosition[this._myAdditionalSetup.myHandedness].myPosition);
                    this.myPinButtonPanel.pp_setPositionLocal(this._mySetup.myPinButtonPosition[this._myAdditionalSetup.myHandedness].myPosition);
                }
            }
        } else {
            this.myVisibilityButtonPanel.pp_setActive(this._myWidgetVisible || this._myVisibilityButtonVisible);
        }
    }

    // Skeleton
    _createSkeleton() {
        this.myFixForwardObject = this._myParentObject.pp_addObject();
        this.myFixForwardObject.pp_rotateObject(vec3_create(0, 180, 0));
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

        this.myNonVRParentObject = getPlayerObjects(this._myEngine).myCameraNonVR.pp_addObject();
        this.myNonVRParentObject.pp_translateLocal(vec3_create(0, 0, -this._mySetup._myPivotObjectDistanceFromHeadNonVR));
        this.myNonVRParentObject.pp_lookToLocal(vec3_create(0, 0, 1), vec3_create(0, 1, 0));

    }

    // Transforms
    _setTransforms() {
        this.myPivotObject.pp_markDirty();

        this.myVisibilityButtonPanel.pp_setPositionLocal(this._mySetup.myVisibilityButtonPosition[this._myAdditionalSetup.myHandedness].myPosition);
        this.myVisibilityButtonBackground.pp_scaleObject(this._mySetup.myVisibilityButtonBackgroundScale);
        this.myVisibilityButtonText.pp_setPositionLocal(this._mySetup.myVisibilityButtonTextPosition);
        this.myVisibilityButtonText.pp_scaleObject(this._mySetup.myVisibilityButtonTextScale);
        this.myVisibilityButtonCursorTarget.pp_setPositionLocal(this._mySetup.myVisibilityButtonCursorTargetPosition);

        this.myPinButtonPanel.pp_setPositionLocal(this._mySetup.myPinButtonPosition[this._myAdditionalSetup.myHandedness].myPosition);

        this.myPinButtonBackground.pp_scaleObject(this._mySetup.myFlagButtonBackgroundScale);
        this.myPinButtonText.pp_setPositionLocal(this._mySetup.myFlagButtonTextPosition);
        this.myPinButtonText.pp_scaleObject(this._mySetup.myFlagButtonTextScale);
        this.myPinButtonCursorTarget.pp_setPositionLocal(this._mySetup.myPinButtonCursorTargetPosition);
    }

    // Components
    _addComponents() {
        this.myVisibilityButtonBackgroundComponent = this.myVisibilityButtonBackground.pp_addComponent(MeshComponent);
        this.myVisibilityButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myVisibilityButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myVisibilityButtonBackgroundComponent.material.color = this._mySetup.myBackgroundColor;

        this.myVisibilityButtonTextComponent = this.myVisibilityButtonText.pp_addComponent(TextComponent);
        this._setupButtonTextComponent(this.myVisibilityButtonTextComponent);
        this.myVisibilityButtonTextComponent.text = this._mySetup.myVisibilityButtonText;

        this.myVisibilityButtonCursorTargetComponent = this.myVisibilityButtonCursorTarget.pp_addComponent(CursorTarget);
        this.myVisibilityButtonCollisionComponent = this.myVisibilityButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myVisibilityButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myVisibilityButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myVisibilityButtonCollisionComponent.extents = this._mySetup.myVisibilityButtonCollisionExtents;

        this.myPinButtonBackgroundComponent = this.myPinButtonBackground.pp_addComponent(MeshComponent);
        this.myPinButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myPinButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myPinButtonBackgroundComponent.material.color = this._mySetup.myButtonDisabledBackgroundColor;

        this.myPinButtonTextComponent = this.myPinButtonText.pp_addComponent(TextComponent);
        this._setupButtonTextComponent(this.myPinButtonTextComponent);
        this.myPinButtonTextComponent.material.color = this._mySetup.myButtonDisabledTextColor;
        this.myPinButtonTextComponent.text = this._mySetup.myPinButtonText;

        this.myPinButtonCursorTargetComponent = this.myPinButtonCursorTarget.pp_addComponent(CursorTarget);

        this.myPinButtonCollisionComponent = this.myPinButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myPinButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myPinButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myPinButtonCollisionComponent.extents = this._mySetup.myPinButtonCollisionExtents;
    }

    _setupButtonTextComponent(textComponent) {
        textComponent.alignment = this._mySetup.myTextAlignment;
        textComponent.justification = this._mySetup.myTextJustification;
        textComponent.material = this._myAdditionalSetup.myTextMaterial.clone();
        textComponent.material.color = this._mySetup.myTextColor;
        textComponent.text = "";
    }

    _onXRSessionStart() {
        this.myVisibilityButtonPanel.pp_setActive(this._myVisibilityButtonVisible);

        this._setTransformForVR();
    }

    _onXRSessionEnd() {
        this._setTransformForNonVR();
    }

    _setTransformForVR() {
        this.myFixForwardObject.pp_setParent(this._myParentObject);

        this.myFixForwardObject.pp_resetTransformLocal();
        this.myFixForwardObject.pp_rotateObject(vec3_create(0, 180, 0));

        this._updateObjectsTransforms(true);
    }

    _setTransformForNonVR() {
        if (!this._myIsPinned) {
            this.myFixForwardObject.pp_setParent(this.myNonVRParentObject);
            this.myFixForwardObject.pp_resetTransformLocal();

            this.myPivotObject.pp_setPositionLocal(this._mySetup.myPivotObjectTransforms[ToolInputSourceType.NONE][ToolHandedness.NONE].myPosition);
            this.myPivotObject.pp_resetRotationLocal();
            this.myPivotObject.pp_rotateObjectQuat(this._mySetup.myPivotObjectTransforms[ToolInputSourceType.NONE][ToolHandedness.NONE].myRotation);

            this.myWidgetObject.pp_setPositionLocal(this._mySetup.myWidgetObjectTransforms[ToolInputSourceType.NONE][ToolHandedness.NONE].myPosition);
            this.myWidgetObject.pp_resetRotationLocal();
            this.myWidgetObject.pp_rotateObjectQuat(this._mySetup.myWidgetObjectTransforms[ToolInputSourceType.NONE][ToolHandedness.NONE].myRotation);

            this.myVisibilityButtonPanel.pp_setPositionLocal(this._mySetup.myVisibilityButtonPosition[ToolHandedness.NONE].myPosition);
            this.myPinButtonPanel.pp_setPositionLocal(this._mySetup.myPinButtonPosition[ToolHandedness.NONE].myPosition);
        }
    }
}