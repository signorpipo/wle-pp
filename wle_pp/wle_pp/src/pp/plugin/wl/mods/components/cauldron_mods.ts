import { Emitter } from "@wonderlandengine/api";
import { PluginUtils } from "../../../utils/plugin_utils.js";

export function initCauldronMods(): void {
    _initEmitterModPrototype();
}

function _initEmitterModPrototype(): void {
    const emitterMod: Record<string, unknown> = {
        _flushTransactions(this: Emitter): void {
            const listeners = this._listeners;
            const _transactions: { type: number, data: any }[] = (this as unknown as { _transactions: { type: number, data: any }[] })._transactions;

            for (let i = 0; i < _transactions.length; i++) {
                const transaction = _transactions[i];
                if (transaction.type == 1) {
                    listeners.push(transaction.data);
                } else {
                    this.remove(transaction.data);
                }
            }

            _transactions.length = 0;
        }
    };



    PluginUtils.injectOwnProperties(emitterMod, Emitter.prototype, false, true, true);
}