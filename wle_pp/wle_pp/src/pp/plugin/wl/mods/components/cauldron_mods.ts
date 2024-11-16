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

            const _notifying: boolean = (this as unknown as { _notifying: boolean })._notifying;
            if (_notifying) {
                const _transactions: { type: number, data: any }[] = (this as unknown as { _transactions: { type: number, data: any }[] })._transactions;
                _transactions.push({ type: 1 /* TransactionType.Addition */, data });
            } else {
                this._listeners.pp_removeAll((listener: { callback: unknown, id: unknown }): boolean => {
                    return (data.id !== undefined && listener.id === data.id) ||
                        (data.id === undefined && listener.id === undefined && listener.callback === data.callback);
                });

                this._listeners.push(data);
            }

            return this;
        },
        _flushTransactions(this: Emitter): void {
            const listeners = this._listeners;
            const _transactions: { type: number, data: any }[] = (this as unknown as { _transactions: { type: number, data: any }[] })._transactions;

            for (let i = 0; i < _transactions.length; i++) {
                const transaction = _transactions[i];
                if (transaction.type == 1 /*TransactionType.Addition*/) {
                    this._listeners.pp_removeAll((listener: { callback: unknown, id: unknown }): boolean => {
                        return (transaction.data.id !== undefined && listener.id === transaction.data.id) ||
                            (transaction.data.id === undefined && listener.id === undefined && listener.callback === transaction.data.callback);
                    });

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