import { JSUtils } from "../../cauldron/utils/js_utils.js";

export function injectProperties(fromReference: Record<string, any>, toReference: object, enumerable: boolean = true, writable: boolean = true, configurable: boolean = true, keepOriginalDescriptorAttributes: boolean = true, bindThisAsFirstParam: boolean = false, prefix?: string, functionNamesToExclude: Readonly<string[]> = []): void {
    const ownPropertyNames = Object.getOwnPropertyNames(fromReference);
    for (const ownPropertyName of ownPropertyNames) {
        if (functionNamesToExclude.includes(ownPropertyName)) continue;

        let enumerableToUse: boolean | undefined = enumerable;
        let writableToUse: boolean | undefined = writable;
        let configurableToUse: boolean | undefined = configurable;

        if (keepOriginalDescriptorAttributes) {
            const originalDescriptor = Object.getOwnPropertyDescriptor(toReference, ownPropertyName);
            if (originalDescriptor != null) {
                enumerableToUse = originalDescriptor.enumerable;
                writableToUse = originalDescriptor.writable;
                configurableToUse = originalDescriptor.configurable;
            }
        }

        let adjustedPropertyName = ownPropertyName;
        if (prefix != null) {
            if (adjustedPropertyName.length > 0 && adjustedPropertyName[0] == adjustedPropertyName[0].toUpperCase()) {
                adjustedPropertyName = prefix.toUpperCase() + adjustedPropertyName;
            } else {
                adjustedPropertyName = prefix + adjustedPropertyName;
            }
        }

        const propertyDescriptor = Object.getOwnPropertyDescriptor(fromReference, ownPropertyName);
        const useAccessors = propertyDescriptor != null && (propertyDescriptor.get != null || propertyDescriptor.set != null);

        if (!useAccessors) {
            let adjustedProperyValue = fromReference[ownPropertyName];

            if (bindThisAsFirstParam && JSUtils.isFunction(adjustedProperyValue)) {
                const originalFunction = fromReference[ownPropertyName];
                adjustedProperyValue = function (this: any, ...args: any[]) {
                    return originalFunction(this, ...args);
                };

                Object.defineProperty(adjustedProperyValue, "name", {
                    value: adjustedPropertyName
                });
            }

            Object.defineProperty(toReference, adjustedPropertyName, {
                value: adjustedProperyValue,
                enumerable: enumerableToUse,
                writable: writableToUse,
                configurable: configurableToUse
            });
        } else {
            Object.defineProperty(toReference, adjustedPropertyName, {
                get: propertyDescriptor.get,
                set: propertyDescriptor.set,
                enumerable: enumerableToUse,
                configurable: configurableToUse
            });
        }
    }
}

export const PluginUtils = {
    injectProperties
} as const;