import { Component, MeshComponent, Object3D, TextComponent } from "@wonderlandengine/api";
import { property } from "@wonderlandengine/api/decorators.js";
import { Cursor, CursorTarget } from "@wonderlandengine/components";
import { AudioPlayer } from "../../../../audio/audio_player.js";
import { AudioSetup } from "../../../../audio/audio_setup.js";
import { Vector3, Vector4 } from "../../../../cauldron/type_definitions/array_type_definitions.js";
import { ColorUtils } from "../../../../cauldron/utils/color_utils.js";
import { MathUtils } from "../../../../cauldron/utils/math_utils.js";
import { FlatMaterial, PhongMaterial } from "../../../../cauldron/wl/type_definitions/material_type_definitions.js";
import { InputUtils } from "../../../../input/cauldron/input_utils.js";
import { vec3_create, vec4_create } from "../../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../../pp/globals.js";
import { AnimatedNumber, AnimatedNumberParams } from "../animated_number.js";

/** You can return `true` to prevent the default behavior of the cursor button to be performed after the action has been handled */
export interface CursorButtonActionsHandler {
    onHover?(cursorButtonComponent: CursorButtonComponent, cursorComponent: Cursor): boolean;
    onDown?(cursorButtonComponent: CursorButtonComponent, cursorComponent: Cursor): boolean;
    onUp?(cursorButtonComponent: CursorButtonComponent, cursorComponent: Cursor): boolean;
    onUnhover?(cursorButtonComponent: CursorButtonComponent, cursorComponent: Cursor): boolean;
}

export class CursorButtonComponent extends Component {
    public static override TypeName = "pp-cursor-button";

    /** This can be either a name of a component that is found on the same object of the cursor button,  
        or the name of an handler added through `CursorButtonComponent.addButtonActionHandler` */
    @property.string("")
    private _myButtonActionsHandlerNames!: string;

    @property.float(0.075)
    private _myScaleOffsetOnHover!: number;

    @property.float(-0.075)
    private _myScaleOffsetOnDown!: number;

    @property.float(0.075)
    private _myScaleOffsetOnUp!: number;

    @property.float(0.1)
    private _myPulseIntensityOnHover!: number;

    @property.float(0)
    private _myPulseIntensityOnDown!: number;

    @property.float(0.1)
    private _myPulseIntensityOnUp!: number;

    @property.float(0)
    private _myPulseIntensityOnUnhover!: number;

    @property.float(-0.1)
    private _myColorBrigthnessOffsetOnHover!: number;

    @property.float(0)
    private _myColorBrigthnessOffsetOnDown!: number;

    @property.float(-0.1)
    private _myColorBrigthnessOffsetOnUp!: number;

    @property.bool(true)
    private _myUseSpatialAudio!: boolean;

    @property.string("")
    private _mySFXOnHover!: string;

    @property.string("")
    private _mySFXOnDown!: string;

    @property.string("")
    private _mySFXOnUp!: string;

    @property.string("")
    private _mySFXOnUnhover!: string;

    private readonly _myCursorButtonComponentID: string = "cursor_button_component" + MathUtils.randomUUID();

    private readonly _myCursorTarget!: CursorTarget;

    private readonly _myButtonActionsHandlers: Map<any, CursorButtonActionsHandler> = new Map();

    private readonly _myOriginalScaleLocal: Vector3 = vec3_create();
    private readonly _myAnimatedScale!: AnimatedNumber;

    private readonly _myAnimatedColorBrightnessOffset!: AnimatedNumber;

    private _myFlatMaterialOriginalColors: [FlatMaterial, Vector4][] = [];
    private _myPhongMaterialOriginalColors: [PhongMaterial, Vector4][] = [];

    private _myOnHoverAudioPlayer: AudioPlayer | null = null;
    private _myOnDownAudioPlayer: AudioPlayer | null = null;
    private _myOnUpAudioPlayer: AudioPlayer | null = null;
    private _myOnUnhoverAudioPlayer: AudioPlayer | null = null;

    private static _myCursorButtonActionHandlers: Map<string, CursorButtonActionsHandler> = new Map();

    /** Used to add handlers for every cursor buttons that can be indexes with a string */
    public static addButtonActionHandler(id: string, buttonActionHandler: Readonly<CursorButtonActionsHandler>): void {
        CursorButtonComponent._myCursorButtonActionHandlers.set(id, buttonActionHandler);
    }

    public static removeButtonActionHandler(id: string): void {
        CursorButtonComponent._myCursorButtonActionHandlers.delete(id);
    }

    public static getButtonActionHandler(id: string): CursorButtonActionsHandler | null {
        const buttonActionHandler = CursorButtonComponent._myCursorButtonActionHandlers.get(id);
        return buttonActionHandler != null ? buttonActionHandler : null;
    }

    /** Used to add handlers for this specific instance of cursor button */
    public addButtonActionHandler(id: any, buttonActionHandler: Readonly<CursorButtonActionsHandler>): void {
        this._myButtonActionsHandlers.set(id, buttonActionHandler);
    }

    public removeButtonActionHandler(id: any): void {
        this._myButtonActionsHandlers.delete(id);
    }

    public getButtonActionHandler(id: any): CursorButtonActionsHandler | null {
        const buttonActionHandler = this._myButtonActionsHandlers.get(id);
        return buttonActionHandler != null ? buttonActionHandler : null;
    }

    public override start(): void {
        (this._myCursorTarget as CursorTarget) = this.object.pp_getComponent(CursorTarget)!;

        this._myCursorTarget.onHover.add(this._onHover.bind(this));
        this._myCursorTarget.onDown.add(this._onDown.bind(this));
        this._myCursorTarget.onUpWithDown.add(this.onUpWithDown.bind(this));
        this._myCursorTarget.onUnhover.add(this._onUnhover.bind(this));

        const buttonActionsHandlerNames = [...this._myButtonActionsHandlerNames.split(",")];
        for (let i = 0; i < buttonActionsHandlerNames.length; i++) {
            buttonActionsHandlerNames[i] = buttonActionsHandlerNames[i].trim();
        }

        for (const buttonActionsHandlerName of buttonActionsHandlerNames) {
            const buttonActionHandlerComponent = this.object.pp_getComponent(buttonActionsHandlerName) as unknown as CursorButtonActionsHandler;
            if (buttonActionHandlerComponent != null) {
                this._myButtonActionsHandlers.set(buttonActionsHandlerName, buttonActionHandlerComponent);
            } else {
                const buttonActionHandlerStatic = CursorButtonComponent.getButtonActionHandler(buttonActionsHandlerName);
                if (buttonActionHandlerStatic != null) {
                    this._myButtonActionsHandlers.set(buttonActionsHandlerName, buttonActionHandlerStatic);
                }
            }
        }

        this._setupVisualsAndSFXs();
    }

    private static readonly _updateSV =
        {
            buttonScale: vec3_create(),
            hsvColor: vec4_create(),
            rgbColor: vec4_create()
        };
    public override update(dt: number): void {
        if (!this._myAnimatedScale.isDone()) {
            this._myAnimatedScale.update(dt);

            const buttonScale = CursorButtonComponent._updateSV.buttonScale;
            this.object.pp_setScaleLocal((this._myOriginalScaleLocal as any).vec3_scale(this._myAnimatedScale.getCurrentValue(), buttonScale));
        }

        if (!this._myAnimatedColorBrightnessOffset.isDone()) {
            this._myAnimatedColorBrightnessOffset.update(dt);

            const colorBrightnessOffsetCurrentValue = this._myAnimatedColorBrightnessOffset.getCurrentValue();

            const hsvColor = CursorButtonComponent._updateSV.hsvColor;
            const rgbColor = CursorButtonComponent._updateSV.rgbColor;

            for (const [material, originalColor] of this._myPhongMaterialOriginalColors) {
                ColorUtils.rgbToHSV(originalColor, hsvColor);
                hsvColor[2] = MathUtils.clamp(hsvColor[2] + colorBrightnessOffsetCurrentValue, 0, 1);
                material.diffuseColor = ColorUtils.hsvToRGB(hsvColor, rgbColor);
            }

            for (const [material, originalColor] of this._myFlatMaterialOriginalColors) {
                ColorUtils.rgbToHSV(originalColor, hsvColor);
                hsvColor[2] = MathUtils.clamp(hsvColor[2] + colorBrightnessOffsetCurrentValue, 0, 1);
                material.color = ColorUtils.hsvToRGB(hsvColor, rgbColor);
            }
        }
    }

    private _onHover(targetObject: Object3D, cursorComponent: Cursor): void {
        let skipDefault = false;
        for (const buttonActionsHandler of this._myButtonActionsHandlers.values()) {
            if (buttonActionsHandler.onHover != null) {
                skipDefault ||= buttonActionsHandler.onHover(this, cursorComponent);
            }
        }

        if (skipDefault) {
            return;
        }

        if (this._myScaleOffsetOnHover != 0 || this._myScaleOffsetOnDown != 0 || this._myScaleOffsetOnUp != 0) {
            this._myAnimatedScale.updateTargetValue(1 + this._myScaleOffsetOnHover);
        }

        if (this._myPulseIntensityOnHover != 0) {
            const handedness = InputUtils.getHandednessByString(cursorComponent.handedness as string);
            if (handedness != null) {
                Globals.getGamepads()![handedness].pulse(this._myPulseIntensityOnHover, 0.085);
            }
        }

        if (this._myColorBrigthnessOffsetOnHover != 0 || this._myColorBrigthnessOffsetOnDown != 0 || this._myColorBrigthnessOffsetOnUp != 0) {
            this._myAnimatedColorBrightnessOffset.updateTargetValue(this._myColorBrigthnessOffsetOnHover);
        }

        if (this._myOnHoverAudioPlayer != null) {
            this._myOnHoverAudioPlayer.setPosition(this.object.pp_getPosition());
            this._myOnHoverAudioPlayer.play();
        }
    }

    private _onDown(targetObject: Object3D, cursorComponent: Cursor): void {
        let skipDefault = false;
        for (const buttonActionsHandler of this._myButtonActionsHandlers.values()) {
            if (buttonActionsHandler.onDown != null) {
                skipDefault ||= buttonActionsHandler.onDown(this, cursorComponent);
            }
        }

        if (skipDefault) {
            return;
        }

        if (this._myScaleOffsetOnHover != 0 || this._myScaleOffsetOnDown != 0 || this._myScaleOffsetOnUp != 0) {
            this._myAnimatedScale.updateTargetValue(1 + this._myScaleOffsetOnDown);
        }

        if (this._myPulseIntensityOnDown != 0) {
            const handedness = InputUtils.getHandednessByString(cursorComponent.handedness as string);
            if (handedness != null) {
                Globals.getGamepads()![handedness].pulse(this._myPulseIntensityOnDown, 0.085);
            }
        }

        if (this._myColorBrigthnessOffsetOnHover != 0 || this._myColorBrigthnessOffsetOnDown != 0 || this._myColorBrigthnessOffsetOnUp != 0) {
            this._myAnimatedColorBrightnessOffset.updateTargetValue(this._myColorBrigthnessOffsetOnDown);
        }

        if (this._myOnDownAudioPlayer != null) {
            this._myOnDownAudioPlayer.setPosition(this.object.pp_getPosition());
            this._myOnDownAudioPlayer.play();
        }
    }

    private onUpWithDown(targetObject: Object3D, cursorComponent: Cursor): void {
        let skipDefault = false;
        for (const buttonActionsHandler of this._myButtonActionsHandlers.values()) {
            if (buttonActionsHandler.onUp != null) {
                skipDefault ||= buttonActionsHandler.onUp(this, cursorComponent);
            }
        }

        if (skipDefault) {
            return;
        }

        if (this._myScaleOffsetOnHover != 0 || this._myScaleOffsetOnDown != 0 || this._myScaleOffsetOnUp != 0) {
            this._myAnimatedScale.updateTargetValue(1 + this._myScaleOffsetOnUp);
        }

        if (this._myPulseIntensityOnUp != 0) {
            const handedness = InputUtils.getHandednessByString(cursorComponent.handedness as string);
            if (handedness != null) {
                Globals.getGamepads()![handedness].pulse(this._myPulseIntensityOnUp, 0.085);
            }
        }

        if (this._myColorBrigthnessOffsetOnHover != 0 || this._myColorBrigthnessOffsetOnDown != 0 || this._myColorBrigthnessOffsetOnUp != 0) {
            this._myAnimatedColorBrightnessOffset.updateTargetValue(this._myColorBrigthnessOffsetOnUp);
        }

        if (this._myOnUpAudioPlayer != null) {
            this._myOnUpAudioPlayer.setPosition(this.object.pp_getPosition());
            this._myOnUpAudioPlayer.play();
        }
    }

    private _onUnhover(targetObject: Object3D, cursorComponent: Cursor): void {
        let skipDefault = false;
        for (const buttonActionsHandler of this._myButtonActionsHandlers.values()) {
            if (buttonActionsHandler.onUnhover != null) {
                skipDefault ||= buttonActionsHandler.onUnhover(this, cursorComponent);
            }
        }

        if (skipDefault) {
            return;
        }

        if (this._myScaleOffsetOnHover != 0 || this._myScaleOffsetOnDown != 0 || this._myScaleOffsetOnUp != 0) {
            this._myAnimatedScale.updateTargetValue(1);
        }

        if (this._myPulseIntensityOnUnhover != 0) {
            const handedness = InputUtils.getHandednessByString(cursorComponent.handedness as string);
            if (handedness != null) {
                Globals.getGamepads()![handedness].pulse(this._myPulseIntensityOnUnhover, 0.085);
            }
        }

        if (this._myColorBrigthnessOffsetOnHover != 0 || this._myColorBrigthnessOffsetOnDown != 0 || this._myColorBrigthnessOffsetOnUp != 0) {
            this._myAnimatedColorBrightnessOffset.updateTargetValue(0);
        }

        if (this._myOnUnhoverAudioPlayer != null) {
            this._myOnUnhoverAudioPlayer.setPosition(this.object.pp_getPosition());
            this._myOnUnhoverAudioPlayer.play();
        }
    }

    private _setupVisualsAndSFXs(): void {
        this.object.pp_getScaleLocal(this._myOriginalScaleLocal);

        const animatedScaleParams = new AnimatedNumberParams();
        animatedScaleParams.myInitialValue = this._myOriginalScaleLocal[0];
        animatedScaleParams.myAnimationSeconds = 0.25;
        (this._myAnimatedScale as AnimatedNumber) = new AnimatedNumber(animatedScaleParams);

        const animatedColorBrightnessOffsetParams = new AnimatedNumberParams();
        animatedColorBrightnessOffsetParams.myInitialValue = 0;
        animatedColorBrightnessOffsetParams.myAnimationSeconds = 0.25;
        (this._myAnimatedColorBrightnessOffset as AnimatedNumber) = new AnimatedNumber(animatedColorBrightnessOffsetParams);

        const meshComponents = this.object.pp_getComponents(MeshComponent);
        for (const meshComponent of meshComponents) {
            meshComponent.material = meshComponent.material?.clone();

            const phongMaterial = meshComponent.material as PhongMaterial;
            if (phongMaterial.diffuseColor != null) {
                this._myPhongMaterialOriginalColors.push([phongMaterial, (phongMaterial.diffuseColor as any).vec4_clone()]);
            } else {
                const flatMaterial = meshComponent.material as FlatMaterial;
                if (flatMaterial.color != null) {
                    this._myFlatMaterialOriginalColors.push([flatMaterial, (flatMaterial.color as any).vec4_clone()]);
                }
            }
        }

        const textComponents = this.object.pp_getComponents(TextComponent);
        for (const textComponent of textComponents) {
            textComponent.material = textComponent.material?.clone();

            const flatMaterial = textComponent.material as FlatMaterial;
            if (flatMaterial.color != null) {
                this._myFlatMaterialOriginalColors.push([flatMaterial, (flatMaterial.color as any).vec4_clone()]);
            }
        }

        const audioManager = Globals.getAudioManager(this.engine)!;
        if (this._mySFXOnHover.length > 0) {
            const audioSetup = new AudioSetup(this._mySFXOnHover);
            audioSetup.mySpatial = this._myUseSpatialAudio;

            const audioID = this._myCursorButtonComponentID + "_on_hover";
            audioManager.addAudioSetup(audioID, audioSetup);

            this._myOnHoverAudioPlayer = audioManager.createAudioPlayer(audioID);
        }

        if (this._mySFXOnDown.length > 0) {
            const audioSetup = new AudioSetup(this._mySFXOnDown);
            audioSetup.mySpatial = this._myUseSpatialAudio;

            const audioID = this._myCursorButtonComponentID + "_on_down";
            audioManager.addAudioSetup(audioID, audioSetup);

            this._myOnDownAudioPlayer = audioManager.createAudioPlayer(audioID);
        }

        if (this._mySFXOnUp.length > 0) {
            const audioSetup = new AudioSetup(this._mySFXOnUp);
            audioSetup.mySpatial = this._myUseSpatialAudio;

            const audioID = this._myCursorButtonComponentID + "_on_up";
            audioManager.addAudioSetup(audioID, audioSetup);

            this._myOnUpAudioPlayer = audioManager.createAudioPlayer(audioID);
        }

        if (this._mySFXOnUnhover.length > 0) {
            const audioSetup = new AudioSetup(this._mySFXOnUnhover);
            audioSetup.mySpatial = this._myUseSpatialAudio;

            const audioID = this._myCursorButtonComponentID + "_on_unhover";
            audioManager.addAudioSetup(audioID, audioSetup);

            this._myOnUnhoverAudioPlayer = audioManager.createAudioPlayer(audioID);
        }
    }
}