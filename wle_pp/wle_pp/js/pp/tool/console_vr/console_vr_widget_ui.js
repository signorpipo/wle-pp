import { CollisionComponent, MeshComponent, TextComponent } from "@wonderlandengine/api";
import { CursorTarget } from "@wonderlandengine/components";
import { XRUtils } from "../../cauldron/utils/xr_utils";
import { getMainEngine } from "../../cauldron/wl/engine_globals";
import { getDefaultResources } from "../../pp/default_resources_global";
import { ToolHandedness } from "../cauldron/tool_types";
import { ConsoleVRWidgetMessageType } from "./console_vr_types";

export class ConsoleVRWidgetUI {

    constructor(engine = getMainEngine()) {
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

    setVisible(visible) {
        this.myPivotObject.pp_setActive(visible);
    }

    // Skeleton
    _createSkeleton() {
        this.myPivotObject = this._myParentObject.pp_addObject();

        this._createMessagesSkeleton();
        this._createButtonsSkeleton();
        this._createPointerSkeleton();
    }

    _createMessagesSkeleton() {
        this.myMessagesPanel = this.myPivotObject.pp_addObject();
        this.myMessagesBackground = this.myMessagesPanel.pp_addObject();
        this.myMessagesTextsPanel = this.myMessagesPanel.pp_addObject();

        this.myMessagesTexts = [];
        for (let key in ConsoleVRWidgetMessageType) {
            this.myMessagesTexts[ConsoleVRWidgetMessageType[key]] = this.myMessagesTextsPanel.pp_addObject();
        }

        this.myNotifyIconPanel = this.myMessagesPanel.pp_addObject();
        this.myNotifyIconBackground = this.myNotifyIconPanel.pp_addObject();
        this.myNotifyIconCursorTarget = this.myNotifyIconPanel.pp_addObject();
    }

    _createButtonsSkeleton() {
        this.myButtonsPanel = this.myPivotObject.pp_addObject();

        this.myFilterButtonsPanels = [];
        this.myFilterButtonsBackgrounds = [];
        this.myFilterButtonsTexts = [];
        this.myFilterButtonsCursorTargets = [];

        for (let key in ConsoleVRWidgetMessageType) {
            this.myFilterButtonsPanels[ConsoleVRWidgetMessageType[key]] = this.myButtonsPanel.pp_addObject();
            this.myFilterButtonsBackgrounds[ConsoleVRWidgetMessageType[key]] = this.myFilterButtonsPanels[ConsoleVRWidgetMessageType[key]].pp_addObject();
            this.myFilterButtonsTexts[ConsoleVRWidgetMessageType[key]] = this.myFilterButtonsPanels[ConsoleVRWidgetMessageType[key]].pp_addObject();
            this.myFilterButtonsCursorTargets[ConsoleVRWidgetMessageType[key]] = this.myFilterButtonsPanels[ConsoleVRWidgetMessageType[key]].pp_addObject();
        }

        this.myClearButtonPanel = this.myButtonsPanel.pp_addObject();
        this.myClearButtonBackground = this.myClearButtonPanel.pp_addObject();
        this.myClearButtonText = this.myClearButtonPanel.pp_addObject();
        this.myClearButtonCursorTarget = this.myClearButtonPanel.pp_addObject();

        this.myUpButtonPanel = this.myButtonsPanel.pp_addObject();
        this.myUpButtonBackground = this.myUpButtonPanel.pp_addObject();
        this.myUpButtonText = this.myUpButtonPanel.pp_addObject();
        this.myUpButtonCursorTarget = this.myUpButtonPanel.pp_addObject();

        this.myDownButtonPanel = this.myButtonsPanel.pp_addObject();
        this.myDownButtonBackground = this.myDownButtonPanel.pp_addObject();
        this.myDownButtonText = this.myDownButtonPanel.pp_addObject();
        this.myDownButtonCursorTarget = this.myDownButtonPanel.pp_addObject();
    }

    _createPointerSkeleton() {
        this.myPointerCursorTarget = this.myPivotObject.pp_addObject();
    }

    // Transforms
    _setTransforms() {
        this.myPivotObject.pp_markDirty();

        this._setMessagesTransforms();
        this._setButtonsTransforms();
        this._setPointerTransform();
    }

    _setMessagesTransforms() {
        this.myMessagesPanel.pp_setPositionLocal(this._mySetup.myMessagesPanelPosition);
        this.myMessagesBackground.pp_scaleObject(this._mySetup.myMessagesBackgroundScale);

        this.myMessagesTextsPanel.pp_setPositionLocal(this._mySetup.myMessagesTextsPanelPosition);
        this.myMessagesTextsPanel.pp_scaleObject(this._mySetup.myMessagesTextsPanelScale);
        for (let key in ConsoleVRWidgetMessageType) {
            this.myMessagesTexts[ConsoleVRWidgetMessageType[key]].pp_setPositionLocal(this._mySetup.myMessagesTextPositions[ConsoleVRWidgetMessageType[key]]);
        }

        this.myNotifyIconPanel.pp_setPositionLocal(this._mySetup.myNotifyIconPanelPositions[this._myAdditionalSetup.myHandedness]);
        this.myNotifyIconBackground.pp_scaleObject(this._mySetup.myNotifyIconBackgroundScale);
        this.myNotifyIconCursorTarget.pp_setPositionLocal(this._mySetup.myNotifyIconCursorTargetPosition);
    }

    _setButtonsTransforms() {
        this.myButtonsPanel.pp_setPositionLocal(this._mySetup.myButtonsPanelPosition);

        // Filter Buttons
        for (let key in ConsoleVRWidgetMessageType) {
            this.myFilterButtonsPanels[ConsoleVRWidgetMessageType[key]].pp_setPositionLocal(this._mySetup.myFilterButtonsPositions[ConsoleVRWidgetMessageType[key]]);

            this.myFilterButtonsBackgrounds[ConsoleVRWidgetMessageType[key]].pp_scaleObject(this._mySetup.myButtonBackgroundScale);

            this.myFilterButtonsTexts[ConsoleVRWidgetMessageType[key]].pp_setPositionLocal(this._mySetup.myButtonTextPosition);
            this.myFilterButtonsTexts[ConsoleVRWidgetMessageType[key]].pp_scaleObject(this._mySetup.myButtonTextScale);

            this.myFilterButtonsCursorTargets[ConsoleVRWidgetMessageType[key]].pp_setPositionLocal(this._mySetup.myButtonCursorTargetPosition);
        }

        // Clear
        {
            this.myClearButtonPanel.pp_setPositionLocal(this._mySetup.myClearButtonPosition);

            this.myClearButtonBackground.pp_scaleObject(this._mySetup.myButtonBackgroundScale);

            this.myClearButtonText.pp_setPositionLocal(this._mySetup.myButtonTextPosition);
            this.myClearButtonText.pp_scaleObject(this._mySetup.myButtonTextScale);

            this.myClearButtonCursorTarget.pp_setPositionLocal(this._mySetup.myButtonCursorTargetPosition);
        }

        // Up
        {
            this.myUpButtonPanel.pp_setPositionLocal(this._mySetup.myUpButtonPosition);

            this.myUpButtonBackground.pp_scaleObject(this._mySetup.myButtonBackgroundScale);

            this.myUpButtonText.pp_setPositionLocal(this._mySetup.myButtonTextPosition);
            this.myUpButtonText.pp_scaleObject(this._mySetup.myButtonTextScale);

            this.myUpButtonCursorTarget.pp_setPositionLocal(this._mySetup.myButtonCursorTargetPosition);
        }

        // Down
        {
            this.myDownButtonPanel.pp_setPositionLocal(this._mySetup.myDownButtonPosition);

            this.myDownButtonBackground.pp_scaleObject(this._mySetup.myButtonBackgroundScale);

            this.myDownButtonText.pp_setPositionLocal(this._mySetup.myButtonTextPosition);
            this.myDownButtonText.pp_scaleObject(this._mySetup.myButtonTextScale);

            this.myDownButtonCursorTarget.pp_setPositionLocal(this._mySetup.myButtonCursorTargetPosition);
        }
    }

    _setPointerTransform() {
        this.myPointerCursorTarget.pp_setPositionLocal(this._mySetup.myPointerCursorTargetPosition);
    }

    // Components
    _addComponents() {
        this._addMessagesComponents();
        this._addButtonsComponents();
        this._addPointerComponents();
    }

    _addMessagesComponents() {
        let messagesBackgroundMeshComp = this.myMessagesBackground.pp_addComponent(MeshComponent);
        messagesBackgroundMeshComp.mesh = this._myPlaneMesh;
        messagesBackgroundMeshComp.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        messagesBackgroundMeshComp.material.color = this._mySetup.myBackgroundColor;

        this.myMessagesTextComponents = [];
        for (let key in ConsoleVRWidgetMessageType) {
            let textComp = this.myMessagesTexts[ConsoleVRWidgetMessageType[key]].pp_addComponent(TextComponent);

            textComp.alignment = this._mySetup.myMessagesTextAlignment;
            textComp.justification = this._mySetup.myMessagesTextJustification;
            textComp.material = this._myAdditionalSetup.myTextMaterial.clone();
            textComp.material.color = this._mySetup.myMessagesTextColors[ConsoleVRWidgetMessageType[key]];
            textComp.lineSpacing = 1.2;
            textComp.text = this._mySetup.myMessagesTextStartString;

            this.myMessagesTextComponents[ConsoleVRWidgetMessageType[key]] = textComp;
        }

        this.myNotifyIconBackgroundComponent = this.myNotifyIconBackground.pp_addComponent(MeshComponent);
        this.myNotifyIconBackgroundComponent.mesh = this._myPlaneMesh;
        this.myNotifyIconBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myNotifyIconBackgroundComponent.material.color = this._mySetup.myNotifyIconColor;

        this.myNotifyIconCursorTargetComponent = this.myNotifyIconCursorTarget.pp_addComponent(CursorTarget);

        this.myNotifyIconCollisionComponent = this.myNotifyIconCursorTarget.pp_addComponent(CollisionComponent);
        this.myNotifyIconCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myNotifyIconCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myNotifyIconCollisionComponent.extents = this._mySetup.myNotifyIconCollisionExtents;
    }

    _addButtonsComponents() {
        // Worship the code copy pasteness

        this.myFilterButtonsBackgroundComponents = [];
        this.myFilterButtonsTextComponents = [];
        this.myFilterButtonsCursorTargetComponents = [];
        this.myFilterButtonsCollisionComponents = [];

        // Filter Buttons
        for (let key in ConsoleVRWidgetMessageType) {
            let buttonBackgroundMeshComp = this.myFilterButtonsBackgrounds[ConsoleVRWidgetMessageType[key]].pp_addComponent(MeshComponent);
            buttonBackgroundMeshComp.mesh = this._myPlaneMesh;
            buttonBackgroundMeshComp.material = this._myAdditionalSetup.myPlaneMaterial.clone();
            buttonBackgroundMeshComp.material.color = this._mySetup.myBackgroundColor;

            let buttonTextComp = this.myFilterButtonsTexts[ConsoleVRWidgetMessageType[key]].pp_addComponent(TextComponent);
            this._setupButtonTextComponent(buttonTextComp);
            buttonTextComp.material.color = this._mySetup.myFilterButtonsTextColors[ConsoleVRWidgetMessageType[key]];
            buttonTextComp.text = this._mySetup.myFilterButtonsTextLabel[ConsoleVRWidgetMessageType[key]];

            let buttonCursorTargetComp = this.myFilterButtonsCursorTargets[ConsoleVRWidgetMessageType[key]].pp_addComponent(CursorTarget);

            let buttonCollisionComp = this.myFilterButtonsCursorTargets[ConsoleVRWidgetMessageType[key]].pp_addComponent(CollisionComponent);
            buttonCollisionComp.collider = this._mySetup.myButtonsCollisionCollider;
            buttonCollisionComp.group = 1 << this._mySetup.myButtonsCollisionGroup;
            buttonCollisionComp.extents = this._mySetup.myButtonsCollisionExtents;

            this.myFilterButtonsBackgroundComponents[ConsoleVRWidgetMessageType[key]] = buttonBackgroundMeshComp;
            this.myFilterButtonsTextComponents[ConsoleVRWidgetMessageType[key]] = buttonTextComp;
            this.myFilterButtonsCursorTargetComponents[ConsoleVRWidgetMessageType[key]] = buttonCursorTargetComp;
            this.myFilterButtonsCollisionComponents[ConsoleVRWidgetMessageType[key]] = buttonCollisionComp;
        }

        // Clear 
        {
            let buttonBackgroundMeshComp = this.myClearButtonBackground.pp_addComponent(MeshComponent);
            buttonBackgroundMeshComp.mesh = this._myPlaneMesh;
            buttonBackgroundMeshComp.material = this._myAdditionalSetup.myPlaneMaterial.clone();
            buttonBackgroundMeshComp.material.color = this._mySetup.myBackgroundColor;

            let buttonTextComp = this.myClearButtonText.pp_addComponent(TextComponent);
            this._setupButtonTextComponent(buttonTextComp);
            buttonTextComp.text = this._mySetup.myClearButtonTextLabel;

            let buttonCursorTargetComp = this.myClearButtonCursorTarget.pp_addComponent(CursorTarget);

            let buttonCollisionComp = this.myClearButtonCursorTarget.pp_addComponent(CollisionComponent);
            buttonCollisionComp.collider = this._mySetup.myButtonsCollisionCollider;
            buttonCollisionComp.group = 1 << this._mySetup.myButtonsCollisionGroup;
            buttonCollisionComp.extents = this._mySetup.myButtonsCollisionExtents;

            this.myClearButtonBackgroundComponent = buttonBackgroundMeshComp;
            this.myClearButtonTextComponent = buttonTextComp;
            this.myClearButtonCursorTargetComponent = buttonCursorTargetComp;
            this.myClearButtonCollisionComponent = buttonCollisionComp;
        }

        // Up 
        {
            let buttonBackgroundMeshComp = this.myUpButtonBackground.pp_addComponent(MeshComponent);
            buttonBackgroundMeshComp.mesh = this._myPlaneMesh;
            buttonBackgroundMeshComp.material = this._myAdditionalSetup.myPlaneMaterial.clone();
            buttonBackgroundMeshComp.material.color = this._mySetup.myBackgroundColor;

            let buttonTextComp = this.myUpButtonText.pp_addComponent(TextComponent);
            this._setupButtonTextComponent(buttonTextComp);
            buttonTextComp.text = this._mySetup.myUpButtonTextLabel;

            let buttonCursorTargetComp = this.myUpButtonCursorTarget.pp_addComponent(CursorTarget);

            let buttonCollisionComp = this.myUpButtonCursorTarget.pp_addComponent(CollisionComponent);
            buttonCollisionComp.collider = this._mySetup.myButtonsCollisionCollider;
            buttonCollisionComp.group = 1 << this._mySetup.myButtonsCollisionGroup;
            buttonCollisionComp.extents = this._mySetup.myButtonsCollisionExtents;

            this.myUpButtonBackgroundComponent = buttonBackgroundMeshComp;
            this.myUpButtonTextComponent = buttonTextComp;
            this.myUpButtonCursorTargetComponent = buttonCursorTargetComp;
            this.myUpButtonCollisionComponent = buttonCollisionComp;
        }

        // Down 
        {
            let buttonBackgroundMeshComp = this.myDownButtonBackground.pp_addComponent(MeshComponent);
            buttonBackgroundMeshComp.mesh = this._myPlaneMesh;
            buttonBackgroundMeshComp.material = this._myAdditionalSetup.myPlaneMaterial.clone();
            buttonBackgroundMeshComp.material.color = this._mySetup.myBackgroundColor;

            let buttonTextComp = this.myDownButtonText.pp_addComponent(TextComponent);
            this._setupButtonTextComponent(buttonTextComp);
            buttonTextComp.text = this._mySetup.myDownButtonTextLabel;

            let buttonCursorTargetComp = this.myDownButtonCursorTarget.pp_addComponent(CursorTarget);

            let buttonCollisionComp = this.myDownButtonCursorTarget.pp_addComponent(CollisionComponent);
            buttonCollisionComp.collider = this._mySetup.myButtonsCollisionCollider;
            buttonCollisionComp.group = 1 << this._mySetup.myButtonsCollisionGroup;
            buttonCollisionComp.extents = this._mySetup.myButtonsCollisionExtents;

            this.myDownButtonBackgroundComponent = buttonBackgroundMeshComp;
            this.myDownButtonTextComponent = buttonTextComp;
            this.myDownButtonCursorTargetComponent = buttonCursorTargetComp;
            this.myDownButtonCollisionComponent = buttonCollisionComp;
        }
    }

    _addPointerComponents() {
        this.myPointerCursorTargetComponent = this.myPointerCursorTarget.pp_addComponent(CursorTarget);
        this.myPointerCursorTargetComponent.isSurface = true;

        let collisionComp = this.myPointerCursorTarget.pp_addComponent(CollisionComponent);
        collisionComp.collider = this._mySetup.myPointerCollisionCollider;
        collisionComp.group = 1 << this._mySetup.myPointerCollisionGroup;
        collisionComp.extents = this._mySetup.myPointerCollisionExtents;

        this.myPointerCollisionComponent = collisionComp;
    }

    _setupButtonTextComponent(textComponent) {
        textComponent.alignment = this._mySetup.myTextAlignment;
        textComponent.justification = this._mySetup.myTextJustification;
        textComponent.material = this._myAdditionalSetup.myTextMaterial.clone();
        textComponent.material.color = this._mySetup.myTextColor;
        textComponent.text = "";
    }

    _onXRSessionStart() {
        this._setTransformForVR();
    }

    _onXRSessionEnd() {
        this._setTransformForNonVR();
    }

    _setTransformForVR() {
        this.myNotifyIconPanel.pp_setPositionLocal(this._mySetup.myNotifyIconPanelPositions[this._myAdditionalSetup.myHandedness]);
    }

    _setTransformForNonVR() {
        this.myNotifyIconPanel.pp_setPositionLocal(this._mySetup.myNotifyIconPanelPositions[ToolHandedness.NONE]);
    }
}