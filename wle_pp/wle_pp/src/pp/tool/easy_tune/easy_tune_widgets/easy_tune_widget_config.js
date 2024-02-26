import { ToolHandedness } from "../../cauldron/tool_types.js";

export class EasyTuneWidgetConfig {

    constructor() {
        this._setupRuntimeConfig();
    }

    _setupRuntimeConfig() {
        this.myGamepadHandedness = ToolHandedness.RIGHT;

        this.myScrollVariableDelay = 0.5;
        this.myScrollVariableMinXThreshold = 0.6;
        this.myScrollVariableMaxYThreshold = 0.25;
        this.myScrollVariableButtonID = null;

        this.myRefreshVariablesDelay = null;
    }
}