import { Component, LogLevel, property } from "@wonderlandengine/api";

export class SetEngineLogLevelComponent extends Component {
    public static override TypeName = "pp-set-engine-log-level";

    @property.bool(true)
    private _myInfoEnabled!: boolean;

    @property.bool(true)
    private _myWarnEnabled!: boolean;

    @property.bool(true)
    private _myErrorEnabled!: boolean;

    public override init(): void {
        if (!this.markedActive) return;

        const logLevelsToDisable = [];

        if (!this._myInfoEnabled) {
            logLevelsToDisable.push(LogLevel.Info);
        }

        if (!this._myWarnEnabled) {
            logLevelsToDisable.push(LogLevel.Warn);
        }

        if (!this._myErrorEnabled) {
            logLevelsToDisable.push(LogLevel.Error);
        }

        if (logLevelsToDisable.length > 0) {
            this.engine.log.levels.disable(...logLevelsToDisable);
        }
    }
}