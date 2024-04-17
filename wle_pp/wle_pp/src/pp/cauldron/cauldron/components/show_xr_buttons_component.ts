import { Component } from "@wonderlandengine/api";
import { property } from "@wonderlandengine/api/decorators.js";
import { XRUtils } from "../../utils/xr_utils.js";

enum _ButtonBehaviorWhenNotAvailable {
    NONE = "none",
    DISABLE = "disable",
    HIDE = "hide"
}

/** The buttons must first be enabled from the Wonderland Engine editor -> Project Settings / VR & AR */
export class ShowXRButtonsComponent extends Component {
    public static override TypeName = "pp-show-xr-buttons";

    @property.bool(true)
    private _myShowVRButton!: boolean;
    @property.enum(Object.values(_ButtonBehaviorWhenNotAvailable), _ButtonBehaviorWhenNotAvailable.DISABLE)
    private _myVRButtonBehaviorWhenNotAvailable!: number;

    @property.bool(true)
    private _myShowARButton!: boolean;
    @property.enum(Object.values(_ButtonBehaviorWhenNotAvailable), _ButtonBehaviorWhenNotAvailable.DISABLE)
    private _myARButtonBehaviorWhenNotAvailable!: number;

    private _myXRButtonsContainer: HTMLElement | null = null;
    private _myVRButton: HTMLElement | null = null;
    private _myARButton: HTMLElement | null = null;

    private _myFirstUpdate: boolean = false;

    private _myVRButtonVisibilityUpdated: boolean = false;
    private _myVRButtonUsabilityUpdated: boolean = false;
    private _myVRButtonDisabledOpacityUpdated: boolean = false;

    private _myARButtonVisibilityUpdated: boolean = false;
    private _myARButtonUsabilityUpdated: boolean = false;
    private _myARButtonDisabledOpacityUpdated: boolean = false;

    public override init(): void {
        this._myXRButtonsContainer = document.getElementById("xr-buttons-container");

        this._myVRButton = document.getElementById("vr-button");
        this._myARButton = document.getElementById("ar-button");
    }

    public override start(): void {
        XRUtils.registerSessionStartEndEventListeners(this, this._onXRSessionStart.bind(this), this._onXRSessionEnd.bind(this), true);
    }

    public override update(dt: number): void {
        if (!this._myFirstUpdate) {
            this._myFirstUpdate = true;

            if (this._myXRButtonsContainer != null) {
                if (this._myShowVRButton || this._myShowARButton) {
                    this._myXRButtonsContainer.style.setProperty("display", "flex");
                } else {
                    this._myXRButtonsContainer.style.setProperty("display", "none");
                }
            }

            if (this._myVRButton != null) {
                if (this._myShowVRButton) {
                    this._myVRButton.style.setProperty("display", "block");
                } else {
                    this._myVRButton.style.setProperty("display", "none");
                }
            }

            if (this._myARButton != null) {
                if (this._myShowARButton) {
                    this._myARButton.style.setProperty("display", "block");
                } else {
                    this._myARButton.style.setProperty("display", "none");
                }
            }
        } else {
            this._updateXRButtons(dt);
        }
    }

    private _updateXRButtons(dt: number): void {
        if (this._myShowVRButton) {
            if (!this._myVRButtonUsabilityUpdated) {
                if (this._myVRButton != null) {
                    if (!this._myVRButtonVisibilityUpdated) {
                        this._myVRButton.style.setProperty("transform", "scale(1)");
                        this._myVRButtonVisibilityUpdated = true;
                    }

                    if (!this._myVRButtonUsabilityUpdated) {
                        if (XRUtils.isVRSupported()) {
                            this._myVRButton.style.setProperty("opacity", "1");
                            this._myVRButton.style.setProperty("pointer-events", "all");

                            this._myVRButtonUsabilityUpdated = true;
                        } else if (!this._myVRButtonDisabledOpacityUpdated) {
                            switch (this._myVRButtonBehaviorWhenNotAvailable) {
                                case 0:
                                    this._myVRButton.style.setProperty("opacity", "1");
                                    this._myVRButton.style.setProperty("pointer-events", "all");
                                    break;
                                case 1:
                                    this._myVRButton.style.setProperty("opacity", "0.5");
                                    break;
                                case 2:
                                    this._myVRButton.style.setProperty("display", "none");
                                    break;
                            }

                            this._myVRButtonDisabledOpacityUpdated = true;
                        }
                    }
                } else {
                    this._myVRButtonUsabilityUpdated = true;
                }
            }
        }

        if (this._myShowARButton) {
            if (!this._myARButtonUsabilityUpdated) {
                if (this._myARButton != null) {
                    if (!this._myARButtonVisibilityUpdated) {
                        this._myARButton.style.setProperty("transform", "scale(1)");
                        this._myARButtonVisibilityUpdated = true;
                    }

                    if (!this._myARButtonUsabilityUpdated) {
                        if (XRUtils.isARSupported()) {
                            this._myARButton.style.setProperty("opacity", "1");
                            this._myARButton.style.setProperty("pointer-events", "all");

                            this._myARButtonUsabilityUpdated = true;
                        } else if (!this._myARButtonDisabledOpacityUpdated) {
                            switch (this._myARButtonBehaviorWhenNotAvailable) {
                                case 0:
                                    this._myARButton.style.setProperty("opacity", "1");
                                    this._myARButton.style.setProperty("pointer-events", "all");
                                    break;
                                case 1:
                                    this._myARButton.style.setProperty("opacity", "0.5");
                                    break;
                                case 2:
                                    this._myARButton.style.setProperty("display", "none");
                                    break;
                            }

                            this._myARButtonDisabledOpacityUpdated = true;
                        }
                    }
                } else {
                    this._myARButtonUsabilityUpdated = true;
                }
            }
        }
    }

    private _onXRSessionStart(): void {
        if (this._myXRButtonsContainer != null) {
            this._myXRButtonsContainer.style.setProperty("display", "none");
        }
    }

    private _onXRSessionEnd(): void {
        if (this._myXRButtonsContainer != null && (this._myShowVRButton || this._myShowARButton)) {
            this._myXRButtonsContainer.style.removeProperty("display");
        }
    }
}