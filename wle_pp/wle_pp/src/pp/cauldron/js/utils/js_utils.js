import { Globals } from "../../../pp/globals";
import { ArrayUtils } from "./array_utils";

export function getObjectPrototypes(object) {
    let prototypes = [];

    prototypes.push(object);

    let objectProto = Object.getPrototypeOf(object);
    while (objectProto != null) {
        ArrayUtils.pushUnique(prototypes, objectProto);
        objectProto = Object.getPrototypeOf(objectProto);
    }

    let prototypesToCheck = [object];
    while (prototypesToCheck.length > 0) {
        let prototypeToCheck = prototypesToCheck.shift();
        if (prototypeToCheck != null) {
            ArrayUtils.pushUnique(prototypes, prototypeToCheck);

            ArrayUtils.pushUnique(prototypesToCheck, Object.getPrototypeOf(prototypeToCheck));
            ArrayUtils.pushUnique(prototypesToCheck, prototypeToCheck.prototype);
        }
    }

    return prototypes;
}

export function getObjectPropertyNames(object) {
    let propertyNames = [];

    let prototypes = JSUtils.getObjectPrototypes(object);

    for (let prototype of prototypes) {
        if (prototype != null) {
            let ownPropertyNames = Object.getOwnPropertyNames(prototype);
            for (let ownPropertyName of ownPropertyNames) {
                ArrayUtils.pushUnique(propertyNames, ownPropertyName);
            }
        }
    }

    return propertyNames;
}

export function getObjectPropertyDescriptor(object, propertyName) {
    let propertyDescriptor = null;

    let propertyParent = JSUtils.getObjectPropertyOwnParent(object, propertyName);

    if (propertyParent != null) {
        propertyDescriptor = Object.getOwnPropertyDescriptor(propertyParent, propertyName);
    }

    return propertyDescriptor;
}

export function getObjectProperty(object, propertyName) {
    let property = undefined;

    let propertyDescriptor = JSUtils.getObjectPropertyDescriptor(object, propertyName);
    if (propertyDescriptor != null) {
        if (propertyDescriptor.get != null) {
            property = propertyDescriptor.get.bind(object)();
        } else {
            property = propertyDescriptor.value;
        }
    }

    return property;
}

export function setObjectProperty(valueToSet, object, propertyName) {
    let propertyDescriptor = JSUtils.getObjectPropertyDescriptor(object, propertyName);

    let setUsed = false;
    if (propertyDescriptor != null) {
        if (propertyDescriptor.set != null) {
            setUsed = true;

            propertyDescriptor.set.bind(object)(valueToSet);
        }
    }

    if (!setUsed) {
        let propertyParent = JSUtils.getObjectPropertyOwnParent(object, propertyName);
        if (propertyParent == null) {
            propertyParent = object;
        }

        Object.defineProperty(propertyParent, propertyName, {
            value: valueToSet
        });
    }
}

export function getObjectPropertyOwnParent(object, propertyName) {
    let parent = null;

    let parents = JSUtils.getObjectPropertyOwnParents(object, propertyName);
    if (parents.length > 0) {
        parent = parents[0];
    }

    return parent;
}

export function getObjectPropertyOwnParents(object, propertyName) {
    let parents = [];

    let possibleParents = JSUtils.getObjectPrototypes(object);

    for (let possibleParent of possibleParents) {
        let propertyNames = Object.getOwnPropertyNames(possibleParent);
        if (ArrayUtils.hasEqual(propertyNames, propertyName)) {
            parents.push(possibleParent);
        }
    }

    return parents;
}

export function getObjectFromPath(path, pathStartObject = Globals.getWindow()) {
    let object = null;

    let objectName = JSUtils.getObjectNameFromPath(path);
    if (objectName != null) {
        object = JSUtils.getObjectProperty(JSUtils.getObjectParentFromPath(path, pathStartObject), objectName);
    }

    return object;
}

export function getObjectNameFromPath(path) {
    let objectName = null;

    if (path != null) {
        let pathSplit = path.split(".");
        if (pathSplit.length > 0) {
            objectName = pathSplit[pathSplit.length - 1];
        }
    }

    return objectName;
}

export function getObjectParentFromPath(path, pathStartObject = Globals.getWindow()) {
    let pathSplit = path.split(".");
    let currentParent = pathStartObject;
    for (let i = 0; i < pathSplit.length - 1; i++) {
        currentParent = JSUtils.getObjectProperty(currentParent, pathSplit[i]);
    }

    return currentParent;
}

export function overwriteObjectProperty(newProperty, object, propertyName, overwriteOnOwnParent = true, jsObjectFunctionsSpecialOverwrite = false, logEnabled = false) {
    let success = false;

    try {
        let propertyOwnParent = JSUtils.getObjectPropertyOwnParent(object, propertyName);
        if (propertyOwnParent != null) {
            let originalPropertyDescriptor = Object.getOwnPropertyDescriptor(propertyOwnParent, propertyName);

            if (originalPropertyDescriptor != null) {
                let originalProperty = JSUtils.getObjectProperty(propertyOwnParent, propertyName);
                JSUtils.copyObjectProperties(originalProperty, newProperty, true, jsObjectFunctionsSpecialOverwrite, logEnabled);

                let overwriteTarget = object;
                if (overwriteOnOwnParent) {
                    overwriteTarget = propertyOwnParent;
                }

                Object.defineProperty(overwriteTarget, propertyName, {
                    value: newProperty,
                    enumerable: originalPropertyDescriptor.enumerable,
                    writable: originalPropertyDescriptor.writable,
                    configurable: originalPropertyDescriptor.configurable
                });

                success = true;
            } else {
                Object.defineProperty(object, propertyName, {
                    value: newProperty
                });

                success = true;
            }
        } else {
            Object.defineProperty(object, propertyName, {
                value: newProperty
            });

            success = true;
        }
    } catch (error) {
        if (logEnabled) {
            console.error("Property:", propertyName, "of:", object, "can't be overwritten.");
        }
    }

    return success;
}

export function copyObjectProperties(fromObject, toObject, cleanCopy = false, jsObjectFunctionsSpecialCopy = false, logEnabled = false) {
    if (fromObject != null) {
        if (cleanCopy) {
            JSUtils.cleanObjectProperties(toObject);
        }

        Object.setPrototypeOf(toObject, Object.getPrototypeOf(fromObject));

        let fromObjectPropertyNames = Object.getOwnPropertyNames(fromObject);
        for (let fromObjectPropertyName of fromObjectPropertyNames) {
            try {
                let fromObjectPropertyDescriptor = Object.getOwnPropertyDescriptor(fromObject, fromObjectPropertyName);

                Object.defineProperty(toObject, fromObjectPropertyName, {
                    value: fromObjectPropertyDescriptor.value,
                    enumerable: fromObjectPropertyDescriptor.enumerable,
                    writable: fromObjectPropertyDescriptor.writable,
                    configurable: fromObjectPropertyDescriptor.configurable
                });
            } catch (error) {
                if (logEnabled) {
                    console.error("Property:", fromObjectPropertyName, "of:", fromObject.name, "can't be overwritten.");
                }
            }
        }

        if (jsObjectFunctionsSpecialCopy) {
            _jsObjectFunctionsSpecialCopy(fromObject, toObject);
        }
    }
}

export function cleanObjectProperties(object) {
    let objectNames = Object.getOwnPropertyNames(object);
    ArrayUtils.pushUnique(objectNames, "__proto__");

    for (let objectName of objectNames) {
        try {
            Object.defineProperty(object, objectName, {
                value: undefined
            });
        } catch (error) {
            // Ignored
        }

        try {
            delete object[objectName];
        } catch (error) {
            // Ignored
        }
    }

    Object.setPrototypeOf(object, null);
}

export function doesObjectPropertyUseAccessors(object, propertyName) {
    let propertyUseAccessors = false;

    let propertyDescriptor = JSUtils.getObjectPropertyDescriptor(object, propertyName);

    if (propertyDescriptor != null && (propertyDescriptor.get != null || propertyDescriptor.set != null)) {
        propertyUseAccessors = true;
    }

    return propertyUseAccessors;
}

export function isFunctionByName(functionParent, functionName) {
    let isFunctionResult = false;

    let functionProperty = JSUtils.getObjectProperty(functionParent, functionName);
    if (functionProperty != null) {
        isFunctionResult = JSUtils.isFunction(functionProperty);
    }

    return isFunctionResult;
}

export function isClassByName(classParent, className) {
    let isClassResult = false;

    let classProperty = JSUtils.getObjectProperty(classParent, className);
    if (classProperty != null) {
        isClassResult = JSUtils.isClass(classProperty);
    }

    return isClassResult;
}

export function isObjectByName(objectParent, objectName) {
    let isObjectResult = false;

    let objectProperty = JSUtils.getObjectProperty(objectParent, objectName);
    if (objectProperty != null) {
        isObjectResult = JSUtils.isObject(objectProperty);
    }

    return isObjectResult;
}

export function isFunction(property) {
    return typeof property == "function" && !JSUtils.isClass(property);
}

export let isClass = function () {
    let checkClassRegex = new RegExp("^class");
    return function isClass(property) {
        return typeof property == "function" &&
            property.prototype != null && typeof property.prototype.constructor == "function" &&
            property.toString != null && typeof property.toString == "function" && property.toString()?.match(checkClassRegex) != null;
    };
}();

export function isObject(property) {
    return typeof property == "object";
}

export let JSUtils = {
    getObjectPrototypes,
    getObjectPropertyNames,
    getObjectPropertyDescriptor,
    getObjectProperty,
    setObjectProperty,
    getObjectPropertyOwnParent,
    getObjectPropertyOwnParents,
    getObjectFromPath,
    getObjectNameFromPath,
    getObjectParentFromPath,
    overwriteObjectProperty,
    copyObjectProperties,
    cleanObjectProperties,
    doesObjectPropertyUseAccessors,
    isFunctionByName,
    isClassByName,
    isObjectByName,
    isFunction,
    isClass,
    isObject
};



function _jsObjectFunctionsSpecialCopy(fromObject, toObject) {
    try {
        if (typeof toObject == "function" && typeof fromObject == "function") {
            let functionsToOverwrite = ["toString", "toLocaleString", "valueOf"];

            for (let functionToOverwrite of functionsToOverwrite) {
                let propertyDescriptorToOverwrite = JSUtils.getObjectPropertyDescriptor(fromObject, functionToOverwrite);

                if (propertyDescriptorToOverwrite != null && propertyDescriptorToOverwrite.value != null &&
                    (propertyDescriptorToOverwrite.value == Object[functionToOverwrite])) {
                    let valueToReturn = Object[functionToOverwrite].bind(fromObject)();
                    let overwrittenFunction = function () { return valueToReturn; };
                    JSUtils.overwriteObjectProperty(overwrittenFunction, toObject, functionToOverwrite, false, false);
                }
            }
        }
    } catch (error) {
        // Ignored
    }
}