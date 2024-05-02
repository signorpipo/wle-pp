import { Component, MeshComponent, Object3D, TextComponent } from "@wonderlandengine/api";
import { property } from "@wonderlandengine/api/decorators.js";
import { Cursor, CursorTarget } from "@wonderlandengine/components";
import { AudioPlayer } from "wle-pp/audio/audio_player.js";
import { AudioSetup } from "wle-pp/audio/audio_setup.js";
import { Timer } from "wle-pp/cauldron/cauldron/timer.js";
import { Vector3, Vector4 } from "wle-pp/cauldron/type_definitions/array_type_definitions.js";
import { ColorUtils } from "wle-pp/cauldron/utils/color_utils.js";
import { EasingFunction, MathUtils } from "wle-pp/cauldron/utils/math_utils.js";
import { FlatMaterial, PhongMaterial } from "wle-pp/cauldron/wl/type_definitions/material_type_definitions.js";
import { InputUtils } from "wle-pp/input/cauldron/input_utils.js";
import { vec3_create, vec4_create } from "wle-pp/plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "wle-pp/pp/globals.js";

/** You can return `true` to prevent the default behavior of the button to be performed after the action has been handled */
export interface CursorButtonActionsHandler {
    onHover?(cursorButtonComponent: CursorButtonComponent, cursorComponent: Cursor): boolean;
    onDown?(cursorButtonComponent: CursorButtonComponent, cursorComponent: Cursor): boolean;
    onUp?(cursorButtonComponent: CursorButtonComponent, cursorComponent: Cursor): boolean;
    onUnhover?(cursorButtonComponent: CursorButtonComponent, cursorComponent: Cursor): boolean;
}

export class CursorButtonComponent extends Component {
    public static override TypeName = "pp-cursor-button";

    @property.string("")
    private _myButtonActionsHandlerComponentName!: string;

    @property.float(0.075)
    private _myScaleOffsetOnHover!: number;

    @property.float(-0.075)
    private _myScaleOffsetOnDown!: number;

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

    private readonly _myButtonActionsHandler: CursorButtonActionsHandler | null = null;

    private readonly _myOriginalScaleLocal: Vector3 = vec3_create();
    private readonly _myScaleChangeTimer: Timer = new Timer(0.25, false);
    private _myScaleStartValue: number = 1;
    private _myScaleTargetValue: number = 1;

    private _myColorBrightnessOffsetStartValue: number = 0;
    private _myColorBrightnessOffsetCurrentValue: number = 0;
    private _myColorBrightnessOffsetTargetValue: number = 0;
    private readonly _myColorBrightnessChangeTimer: Timer = new Timer(0.25, false);

    private _myFlatMaterialOriginalColors: [FlatMaterial, Vector4][] = [];
    private _myPhongMaterialOriginalColors: [PhongMaterial, Vector4][] = [];

    private _myOnHoverAudioPlayer: AudioPlayer | null = null;
    private _myOnDownAudioPlayer: AudioPlayer | null = null;
    private _myOnUpAudioPlayer: AudioPlayer | null = null;
    private _myOnUnhoverAudioPlayer: AudioPlayer | null = null;

    public override start(): void {
        (this._myCursorTarget as CursorTarget) = this.object.pp_getComponent(CursorTarget)!;

        this._myCursorTarget.onHover.add(this._onHover.bind(this));
        this._myCursorTarget.onDown.add(this._onDown.bind(this));
        this._myCursorTarget.onUpWithDown.add(this.onUpWithDown.bind(this));
        this._myCursorTarget.onUnhover.add(this._onUnhover.bind(this));

        (this._myButtonActionsHandler as CursorButtonActionsHandler) = this.object.pp_getComponent(this._myButtonActionsHandlerComponentName) as unknown as CursorButtonActionsHandler;

        this.object.pp_getScaleLocal(this._myOriginalScaleLocal);

        const meshComponents = this.object.pp_getComponents(MeshComponent);
        for (const meshComponent of meshComponents) {
            meshComponent.material = meshComponent.material?.clone();

            const phongMaterial = meshComponent.material as PhongMaterial;
            if (phongMaterial.diffuseColor != null) {
                this._myPhongMaterialOriginalColors.push([phongMaterial, phongMaterial.diffuseColor.vec4_clone()]);
            } else {
                const flatMaterial = meshComponent.material as FlatMaterial;
                if (flatMaterial.color != null) {
                    this._myFlatMaterialOriginalColors.push([flatMaterial, flatMaterial.color.vec4_clone()]);
                }
            }
        }

        const textComponents = this.object.pp_getComponents(TextComponent);
        for (const textComponent of textComponents) {
            textComponent.material = textComponent.material?.clone();

            const flatMaterial = textComponent.material as FlatMaterial;
            if (flatMaterial.color != null) {
                this._myFlatMaterialOriginalColors.push([flatMaterial, flatMaterial.color.vec4_clone()]);
            }
        }

        const audioManager = Globals.getAudioManager(this.engine);
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

    private static readonly _updateSV =
        {
            buttonScale: vec3_create(),
            hsvColor: vec4_create(),
            rgbColor: vec4_create()
        };
    public override update(dt: number): void {
        if (this._myScaleChangeTimer.isRunning()) {
            this._myScaleChangeTimer.update(dt);

            const currentScale = MathUtils.interpolate(this._myScaleStartValue, this._myScaleTargetValue, this._myScaleChangeTimer.getPercentage(), EasingFunction.easeInOut);
            const buttonScale = CursorButtonComponent._updateSV.buttonScale;
            this.object.pp_setScaleLocal((this._myOriginalScaleLocal as any).vec3_scale(currentScale, buttonScale));
        }

        if (this._myColorBrightnessChangeTimer.isRunning()) {
            this._myColorBrightnessChangeTimer.update(dt);

            this._myColorBrightnessOffsetCurrentValue = MathUtils.interpolate(this._myColorBrightnessOffsetStartValue, this._myColorBrightnessOffsetTargetValue, this._myColorBrightnessChangeTimer.getPercentage(), EasingFunction.easeInOut);

            const hsvColor = CursorButtonComponent._updateSV.hsvColor;
            const rgbColor = CursorButtonComponent._updateSV.rgbColor;

            for (const [material, originalColor] of this._myPhongMaterialOriginalColors) {
                ColorUtils.rgbToHSV(originalColor, hsvColor);
                hsvColor[2] = MathUtils.clamp(hsvColor[2] + this._myColorBrightnessOffsetCurrentValue, 0, 1);
                material.diffuseColor = ColorUtils.hsvToRGB(hsvColor, rgbColor);
            }

            for (const [material, originalColor] of this._myFlatMaterialOriginalColors) {
                ColorUtils.rgbToHSV(originalColor, hsvColor);
                hsvColor[2] = MathUtils.clamp(hsvColor[2] + this._myColorBrightnessOffsetCurrentValue, 0, 1);
                material.color = ColorUtils.hsvToRGB(hsvColor, rgbColor);
            }
        }
    }

    private _onHover(targetObject: Object3D, cursorComponent: Cursor): void {
        if (this._myButtonActionsHandler != null && this._myButtonActionsHandler.onHover != null && this._myButtonActionsHandler.onHover(this, cursorComponent)) {
            return;
        }

        if (this._myScaleOffsetOnHover != 0 || this._myScaleOffsetOnDown != 0) {
            this._myScaleStartValue = this.object.pp_getScaleLocal()[0];
            this._myScaleTargetValue = 1 + this._myScaleOffsetOnHover;
            this._myScaleChangeTimer.start();
        }

        if (this._myPulseIntensityOnHover != 0) {
            const handedness = InputUtils.getHandednessByString(cursorComponent.handedness as string);
            if (handedness != null) {
                Globals.getGamepads()![handedness].pulse(this._myPulseIntensityOnHover, 0.085);
            }
        }

        if (this._myColorBrigthnessOffsetOnHover != 0 || this._myColorBrigthnessOffsetOnDown != 0) {
            this._myColorBrightnessOffsetStartValue = this._myColorBrightnessOffsetCurrentValue;
            this._myColorBrightnessOffsetTargetValue = this._myColorBrigthnessOffsetOnHover;
            this._myColorBrightnessChangeTimer.start();
        }

        if (this._myOnHoverAudioPlayer != null) {
            this._myOnHoverAudioPlayer.setPosition(this.object.pp_getPosition());
            this._myOnHoverAudioPlayer.play();
        }
    }

    private _onDown(targetObject: Object3D, cursorComponent: Cursor): void {
        if (this._myButtonActionsHandler != null && this._myButtonActionsHandler.onDown != null && this._myButtonActionsHandler.onDown(this, cursorComponent)) {
            return;
        }

        if (this._myScaleOffsetOnHover != 0 || this._myScaleOffsetOnDown != 0) {
            this._myScaleStartValue = this.object.pp_getScaleLocal()[0];
            this._myScaleTargetValue = 1 + this._myScaleOffsetOnDown;
            this._myScaleChangeTimer.start();
        }

        if (this._myPulseIntensityOnDown != 0) {
            const handedness = InputUtils.getHandednessByString(cursorComponent.handedness as string);
            if (handedness != null) {
                Globals.getGamepads()![handedness].pulse(this._myPulseIntensityOnDown, 0.085);
            }
        }

        if (this._myColorBrigthnessOffsetOnHover != 0 || this._myColorBrigthnessOffsetOnDown != 0) {
            this._myColorBrightnessOffsetStartValue = this._myColorBrightnessOffsetCurrentValue;
            this._myColorBrightnessOffsetTargetValue = this._myColorBrigthnessOffsetOnDown;
            this._myColorBrightnessChangeTimer.start();
        }

        if (this._myOnDownAudioPlayer != null) {
            this._myOnDownAudioPlayer.setPosition(this.object.pp_getPosition());
            this._myOnDownAudioPlayer.play();
        }
    }

    private onUpWithDown(targetObject: Object3D, cursorComponent: Cursor): void {
        if (this._myButtonActionsHandler != null && this._myButtonActionsHandler.onUp != null && this._myButtonActionsHandler.onUp(this, cursorComponent)) {
            return;
        }

        if (this._myScaleOffsetOnHover != 0 || this._myScaleOffsetOnDown != 0) {
            this._myScaleStartValue = this.object.pp_getScaleLocal()[0];
            this._myScaleTargetValue = 1 + this._myScaleOffsetOnHover;
            this._myScaleChangeTimer.start();
        }

        if (this._myPulseIntensityOnUp != 0) {
            const handedness = InputUtils.getHandednessByString(cursorComponent.handedness as string);
            if (handedness != null) {
                Globals.getGamepads()![handedness].pulse(this._myPulseIntensityOnUp, 0.085);
            }
        }

        if (this._myColorBrigthnessOffsetOnHover != 0 || this._myColorBrigthnessOffsetOnDown != 0) {
            this._myColorBrightnessOffsetStartValue = this._myColorBrightnessOffsetCurrentValue;
            this._myColorBrightnessOffsetTargetValue = this._myColorBrigthnessOffsetOnHover;
            this._myColorBrightnessChangeTimer.start();
        }

        if (this._myOnUpAudioPlayer != null) {
            this._myOnUpAudioPlayer.setPosition(this.object.pp_getPosition());
            this._myOnUpAudioPlayer.play();
        }
    }

    private _onUnhover(targetObject: Object3D, cursorComponent: Cursor): void {
        if (this._myButtonActionsHandler != null && this._myButtonActionsHandler.onUnhover != null && this._myButtonActionsHandler.onUnhover(this, cursorComponent)) {
            return;
        }

        if (this._myScaleOffsetOnHover != 0 || this._myScaleOffsetOnDown != 0) {
            this._myScaleStartValue = this.object.pp_getScaleLocal()[0];
            this._myScaleTargetValue = 1;
            this._myScaleChangeTimer.start();
        }

        if (this._myPulseIntensityOnUnhover != 0) {
            const handedness = InputUtils.getHandednessByString(cursorComponent.handedness as string);
            if (handedness != null) {
                Globals.getGamepads()![handedness].pulse(this._myPulseIntensityOnUnhover, 0.085);
            }
        }

        if (this._myColorBrigthnessOffsetOnHover != 0 || this._myColorBrigthnessOffsetOnDown != 0) {
            this._myColorBrightnessOffsetStartValue = this._myColorBrightnessOffsetCurrentValue;
            this._myColorBrightnessOffsetTargetValue = 0;
            this._myColorBrightnessChangeTimer.start();
        }

        if (this._myOnUnhoverAudioPlayer != null) {
            this._myOnUnhoverAudioPlayer.setPosition(this.object.pp_getPosition());
            this._myOnUnhoverAudioPlayer.play();
        }
    }
}