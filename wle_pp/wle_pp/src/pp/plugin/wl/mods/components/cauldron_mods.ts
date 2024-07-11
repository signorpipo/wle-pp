import { Emitter } from "@wonderlandengine/api";
import { PluginUtils } from "../../../utils/plugin_utils.js";

export function initCauldronMods(): void {
    _initEmitterModPrototype();
}

function _initEmitterModPrototype(): void {
    const emitterMod: Record<string, unknown> = {
        add(this: Emitter, listener: unknown, opts: Partial<{ once: boolean, id: unknown }> = {}): Emitter {
            const { once = false, id = undefined } = opts;
            const data: any = { id, once, callback: listener };

            const _transactions: { type: number, data: any }[] = (this as unknown as { _transactions: { type: number, data: any }[] })._transactions;

            if (data.id !== undefined) {
                _transactions.pp_removeAll((elementToCheck: { type: number, data: any }): boolean => {
                    return elementToCheck.data.id === data.id;
                });

                this._listeners.pp_removeAll((listener: { id: unknown }): boolean => {
                    return listener.id === data.id;
                });
            }

            const _notifying: boolean = (this as unknown as { _notifying: boolean })._notifying;
            if (_notifying) {
                _transactions.push({ type: 1 /* TransactionType.Addition */, data });
                return this;
            }
            this._listeners.push(data);
            return this;
        },
        _flushTransactions(this: Emitter): void {
            const listeners = this._listeners;
            const _transactions: { type: number, data: any }[] = (this as unknown as { _transactions: { type: number, data: any }[] })._transactions;

            for (let i = 0; i < _transactions.length; i++) {
                const transaction = _transactions[i];
                if (transaction.type == 1 /*TransactionType.Addition*/) {
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