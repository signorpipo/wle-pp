import { CollisionComponent, MeshComponent, TextComponent } from "@wonderlandengine/api";
import { CursorTarget } from "@wonderlandengine/components";
import { XRUtils } from "../../cauldron/utils/xr_utils";
import { Globals } from "../../pp/globals";
import { ToolHandedness } from "../cauldron/tool_types";
import { ConsoleVRWidgetMessageType } from "./console_vr_types";

export class ConsoleVRWidgetUI {

    constructor(engine = Globals.getMainEngine()) {
        this._myEngine = engine;

        this._myDestroyed = false;
    }

    build(parentObject, config, params) {
        this._myParentObject = parentObject;
        this._myConfig = config;
        this._myParams = params;

        this._myPlaneMesh = Globals.getDefaultMeshes(this._myEngine).myPlane;

        this._createSkeleton();
        this._setTransforms();
        this._addComponents();

        this._setTransformForNonXR();

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
        this.myMessagesPanel.pp_setPositionLocal(this._myConfig.myMessagesPanelPosition);
        this.myMessagesBackground.pp_scaleObject(this._myConfig.myMessagesBackgroundScale);

        this.myMessagesTextsPanel.pp_setPositionLocal(this._myConfig.myMessagesTextsPanelPosition);
        this.myMessagesTextsPanel.pp_scaleObject(this._myConfig.myMessagesTextsPanelScale);
        for (let key in ConsoleVRWidgetMessageType) {
            this.myMessagesTexts[ConsoleVRWidgetMessageType[key]].pp_setPositionLocal(this._myConfig.myMessagesTextPositions[ConsoleVRWidgetMessageType[key]]);
        }

        this.myNotifyIconPanel.pp_setPositionLocal(this._myConfig.myNotifyIconPanelPositions[this._myParams.myHandedness]);
        this.myNotifyIconBackground.pp_scaleObject(this._myConfig.myNotifyIconBackgroundScale);
        this.myNotifyIconCursorTarget.pp_setPositionLocal(this._myConfig.myNotifyIconCursorTargetPosition);
    }

    _setButtonsTransforms() {
        this.myButtonsPanel.pp_setPositionLocal(this._myConfig.myButtonsPanelPosition);

        // Filter Buttons
        for (let key in ConsoleVRWidgetMessageType) {
            this.myFilterButtonsPanels[ConsoleVRWidgetMessageType[key]].pp_setPositionLocal(this._myConfig.myFilterButtonsPositions[ConsoleVRWidgetMessageType[key]]);

            this.myFilterButtonsBackgrounds[ConsoleVRWidgetMessageType[key]].pp_scaleObject(this._myConfig.myButtonBackgroundScale);

            this.myFilterButtonsTexts[ConsoleVRWidgetMessageType[key]].pp_setPositionLocal(this._myConfig.myButtonTextPosition);
            this.myFilterButtonsTexts[ConsoleVRWidgetMessageType[key]].pp_scaleObject(this._myConfig.myButtonTextScale);

            this.myFilterButtonsCursorTargets[ConsoleVRWidgetMessageType[key]].pp_setPositionLocal(this._myConfig.myButtonCursorTargetPosition);
        }

        // Clear
        {
            this.myClearButtonPanel.pp_setPositionLocal(this._myConfig.myClearButtonPosition);

            this.myClearButtonBackground.pp_scaleObject(this._myConfig.myButtonBackgroundScale);

            this.myClearButtonText.pp_setPositionLocal(this._myConfig.myButtonTextPosition);
            this.myClearButtonText.pp_scaleObject(this._myConfig.myButtonTextScale);

            this.myClearButtonCursorTarget.pp_setPositionLocal(this._myConfig.myButtonCursorTargetPosition);
        }

        // Up
        {
            this.myUpButtonPanel.pp_setPositionLocal(this._myConfig.myUpButtonPosition);

            this.myUpButtonBackground.pp_scaleObject(this._myConfig.myButtonBackgroundScale);

            this.myUpButtonText.pp_setPositionLocal(this._myConfig.myButtonTextPosition);
            this.myUpButtonText.pp_scaleObject(this._myConfig.myButtonTextScale);

            this.myUpButtonCursorTarget.pp_setPositionLocal(this._myConfig.myButtonCursorTargetPosition);
        }

        // Down
        {
            this.myDownButtonPanel.pp_setPositionLocal(this._myConfig.myDownButtonPosition);

            this.myDownButtonBackground.pp_scaleObject(this._myConfig.myButtonBackgroundScale);

            this.myDownButtonText.pp_setPositionLocal(this._myConfig.myButtonTextPosition);
            this.myDownButtonText.pp_scaleObject(this._myConfig.myButtonTextScale);

            this.myDownButtonCursorTarget.pp_setPositionLocal(this._myConfig.myButtonCursorTargetPosition);
        }
    }

    _setPointerTransform() {
        this.myPointerCursorTarget.pp_setPositionLocal(this._myConfig.myPointerCursorTargetPosition);
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
        messagesBackgroundMeshComp.material = this._myParams.myPlaneMaterial.clone();
        messagesBackgroundMeshComp.material.color = this._myConfig.myBackgroundColor;

        this.myMessagesTextComponents = [];
        for (let key in ConsoleVRWidgetMessageType) {
            let textComp = this.myMessagesTexts[ConsoleVRWidgetMessageType[key]].pp_addComponent(TextComponent);

            textComp.alignment = this._myConfig.myMessagesTextAlignment;
            textComp.justification = this._myConfig.myMessagesTextJustification;
            textComp.material = this._myParams.myTextMaterial.clone();
            textComp.material.color = this._myConfig.myMessagesTextColors[ConsoleVRWidgetMessageType[key]];
            textComp.lineSpacing = 1.2;
            textComp.text = this._myConfig.myMessagesTextStartString;

            this.myMessagesTextComponents[ConsoleVRWidgetMessageType[key]] = textComp;
        }

        this.myNotifyIconBackgroundComponent = this.myNotifyIconBackground.pp_addComponent(MeshComponent);
        this.myNotifyIconBackgroundComponent.mesh = this._myPlaneMesh;
        this.myNotifyIconBackgroundComponent.material = this._myParams.myPlaneMaterial.clone();
        this.myNotifyIconBackgroundComponent.material.color = this._myConfig.myNotifyIconColor;

        this.myNotifyIconCursorTargetComponent = this.myNotifyIconCursorTarget.pp_addComponent(CursorTarget);

        this.myNotifyIconCollisionComponent = this.myNotifyIconCursorTarget.pp_addComponent(CollisionComponent);
        this.myNotifyIconCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myNotifyIconCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myNotifyIconCollisionComponent.extents = this._myConfig.myNotifyIconCollisionExtents;
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
            buttonBackgroundMeshComp.material = this._myParams.myPlaneMaterial.clone();
            buttonBackgroundMeshComp.material.color = this._myConfig.myBackgroundColor;

            let buttonTextComp = this.myFilterButtonsTexts[ConsoleVRWidgetMessageType[key]].pp_addComponent(TextComponent);
            this._setupButtonTextComponent(buttonTextComp);
            buttonTextComp.material.color = this._myConfig.myFilterButtonsTextColors[ConsoleVRWidgetMessageType[key]];
            buttonTextComp.text = this._myConfig.myFilterButtonsTextLabel[ConsoleVRWidgetMessageType[key]];

            let buttonCursorTargetComp = this.myFilterButtonsCursorTargets[ConsoleVRWidgetMessageType[key]].pp_addComponent(CursorTarget);

            let buttonCollisionComp = this.myFilterButtonsCursorTargets[ConsoleVRWidgetMessageType[key]].pp_addComponent(CollisionComponent);
            buttonCollisionComp.collider = this._myConfig.myButtonsCollisionCollider;
            buttonCollisionComp.group = 1 << this._myConfig.myButtonsCollisionGroup;
            buttonCollisionComp.extents = this._myConfig.myButtonsCollisionExtents;

            this.myFilterButtonsBackgroundComponents[ConsoleVRWidgetMessageType[key]] = buttonBackgroundMeshComp;
            this.myFilterButtonsTextComponents[ConsoleVRWidgetMessageType[key]] = buttonTextComp;
            this.myFilterButtonsCursorTargetComponents[ConsoleVRWidgetMessageType[key]] = buttonCursorTargetComp;
            this.myFilterButtonsCollisionComponents[ConsoleVRWidgetMessageType[key]] = buttonCollisionComp;
        }

        // Clear 
        {
            let buttonBackgroundMeshComp = this.myClearButtonBackground.pp_addComponent(MeshComponent);
            buttonBackgroundMeshComp.mesh = this._myPlaneMesh;
            buttonBackgroundMeshComp.material = this._myParams.myPlaneMaterial.clone();
            buttonBackgroundMeshComp.material.color = this._myConfig.myBackgroundColor;

            let buttonTextComp = this.myClearButtonText.pp_addComponent(TextComponent);
            this._setupButtonTextComponent(buttonTextComp);
            buttonTextComp.text = this._myConfig.myClearButtonTextLabel;

            let buttonCursorTargetComp = this.myClearButtonCursorTarget.pp_addComponent(CursorTarget);

            let buttonCollisionComp = this.myClearButtonCursorTarget.pp_addComponent(CollisionComponent);
            buttonCollisionComp.collider = this._myConfig.myButtonsCollisionCollider;
            buttonCollisionComp.group = 1 << this._myConfig.myButtonsCollisionGroup;
            buttonCollisionComp.extents = this._myConfig.myButtonsCollisionExtents;

            this.myClearButtonBackgroundComponent = buttonBackgroundMeshComp;
            this.myClearButtonTextComponent = buttonTextComp;
            this.myClearButtonCursorTargetComponent = buttonCursorTargetComp;
            this.myClearButtonCollisionComponent = buttonCollisionComp;
        }

        // Up 
        {
            let buttonBackgroundMeshComp = this.myUpButtonBackground.pp_addComponent(MeshComponent);
            buttonBackgroundMeshComp.mesh = this._myPlaneMesh;
            buttonBackgroundMeshComp.material = this._myParams.myPlaneMaterial.clone();
            buttonBackgroundMeshComp.material.color = this._myConfig.myBackgroundColor;

            let buttonTextComp = this.myUpButtonText.pp_addComponent(TextComponent);
            this._setupButtonTextComponent(buttonTextComp);
            buttonTextComp.text = this._myConfig.myUpButtonTextLabel;

            let buttonCursorTargetComp = this.myUpButtonCursorTarget.pp_addComponent(CursorTarget);

            let buttonCollisionComp = this.myUpButtonCursorTarget.pp_addComponent(CollisionComponent);
            buttonCollisionComp.collider = this._myConfig.myButtonsCollisionCollider;
            buttonCollisionComp.group = 1 << this._myConfig.myButtonsCollisionGroup;
            buttonCollisionComp.extents = this._myConfig.myButtonsCollisionExtents;

            this.myUpButtonBackgroundComponent = buttonBackgroundMeshComp;
            this.myUpButtonTextComponent = buttonTextComp;
            this.myUpButtonCursorTargetComponent = buttonCursorTargetComp;
            this.myUpButtonCollisionComponent = buttonCollisionComp;
        }

        // Down 
        {
            let buttonBackgroundMeshComp = this.myDownButtonBackground.pp_addComponent(MeshComponent);
            buttonBackgroundMeshComp.mesh = this._myPlaneMesh;
            buttonBackgroundMeshComp.material = this._myParams.myPlaneMaterial.clone();
            buttonBackgroundMeshComp.material.color = this._myConfig.myBackgroundColor;

            let buttonTextComp = this.myDownButtonText.pp_addComponent(TextComponent);
            this._setupButtonTextComponent(buttonTextComp);
            buttonTextComp.text = this._myConfig.myDownButtonTextLabel;

            let buttonCursorTargetComp = this.myDownButtonCursorTarget.pp_addComponent(CursorTarget);

            let buttonCollisionComp = this.myDownButtonCursorTarget.pp_addComponent(CollisionComponent);
            buttonCollisionComp.collider = this._myConfig.myButtonsCollisionCollider;
            buttonCollisionComp.group = 1 << this._myConfig.myButtonsCollisionGroup;
            buttonCollisionComp.extents = this._myConfig.myButtonsCollisionExtents;

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
        collisionComp.collider = this._myConfig.myPointerCollisionCollider;
        collisionComp.group = 1 << this._myConfig.myPointerCollisionGroup;
        collisionComp.extents = this._myConfig.myPointerCollisionExtents;

        this.myPointerCollisionComponent = collisionComp;
    }

    _setupButtonTextComponent(textComponent) {
        textComponent.alignment = this._myConfig.myTextAlignment;
        textComponent.justification = this._myConfig.myTextJustification;
        textComponent.material = this._myParams.myTextMaterial.clone();
        textComponent.material.color = this._myConfig.myTextColor;
        textComponent.text = "";
    }

    _onXRSessionStart() {
        this._setTransformForXR();
    }

    _onXRSessionEnd() {
        this._setTransformForNonXR();
    }

    _setTransformForXR() {
        this.myNotifyIconPanel.pp_setPositionLocal(this._myConfig.myNotifyIconPanelPositions[this._myParams.myHandedness]);
    }

    _setTransformForNonXR() {
        this.myNotifyIconPanel.pp_setPositionLocal(this._myConfig.myNotifyIconPanelPositions[ToolHandedness.NONE]);
    }

    destroy() {
        this._myDestroyed = true;

        XRUtils.unregisterSessionStartEndEventListeners(this, this._myEngine);
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}