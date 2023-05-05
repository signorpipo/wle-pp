import { JSUtils } from "../../cauldron/js/utils/js_utils";

export function injectProperties(fromReference, toReference, enumerable = true, writable = true, configurable = true, keepOriginalDescriptorAttributes = true, bindThisAsFirstParam = false, prefix = null, functionNamesToExclude = []) {
    let ownPropertyNames = Object.getOwnPropertyNames(fromReference);
    for (let ownPropertyName of ownPropertyNames) {
        if (functionNamesToExclude.includes(ownPropertyName)) continue;

        let enumerableToUse = enumerable;
        let writableToUse = writable;
        let configurableToUse = configurable;

        if (keepOriginalDescriptorAttributes) {
            let originalDescriptor = Object.getOwnPropertyDescriptor(toReference, ownPropertyName);
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

        let propertyDescriptor = Object.getOwnPropertyDescriptor(fromReference, ownPropertyName);
        let useAccessors = propertyDescriptor != null && (propertyDescriptor.get != null || propertyDescriptor.set != null);

        if (!useAccessors) {
            let adjustedProperyValue = fromReference[ownPropertyName];

            if (bindThisAsFirstParam && JSUtils.isFunction(adjustedProperyValue)) {
                let originalFunction = fromReference[ownPropertyName];
                adjustedProperyValue = function () {
                    return originalFunction(this, ...arguments);
                }

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

export let PluginUtils = {
    injectProperties
};