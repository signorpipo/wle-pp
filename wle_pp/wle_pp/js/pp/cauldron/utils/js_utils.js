export function getObjectPrototypes(object) {
    let prototypes = [];

    prototypes.push(object);

    let objectProto = Object.getPrototypeOf(object);
    while (objectProto != null) {
        prototypes.pp_pushUnique(objectProto);
        objectProto = Object.getPrototypeOf(objectProto);
    }

    let prototypesToCheck = [object];
    while (prototypesToCheck.length > 0) {
        let prototypeToCheck = prototypesToCheck.shift();
        if (prototypeToCheck != null) {
            prototypes.pp_pushUnique(prototypeToCheck);

            prototypesToCheck.pp_pushUnique(Object.getPrototypeOf(prototypeToCheck));
            prototypesToCheck.pp_pushUnique(prototypeToCheck.prototype);
        }
    }

    return prototypes;
}

export function getObjectPropertyNames(object) {
    let propertyNames = [];

    let prototypes = getObjectPrototypes(object);

    for (let prototype of prototypes) {
        if (prototype != null) {
            let ownPropertyNames = Object.getOwnPropertyNames(prototype);
            for (let ownPropertyName of ownPropertyNames) {
                propertyNames.pp_pushUnique(ownPropertyName);
            }
        }
    }

    return propertyNames;
}

export function getObjectPropertyDescriptor(object, propertyName) {
    let propertyDescriptor = null;

    let propertyParent = getObjectPropertyOwnParent(object, propertyName);

    if (propertyParent != null) {
        propertyDescriptor = Object.getOwnPropertyDescriptor(propertyParent, propertyName);
    }

    return propertyDescriptor;
}

export function getObjectProperty(object, propertyName) {
    let property = undefined;

    let propertyDescriptor = getObjectPropertyDescriptor(object, propertyName);
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
    let propertyDescriptor = getObjectPropertyDescriptor(object, propertyName);

    let setUsed = false;
    if (propertyDescriptor != null) {
        if (propertyDescriptor.set != null) {
            setUsed = true;

            propertyDescriptor.set.bind(object)(valueToSet);
        }
    }

    if (!setUsed) {
        let propertyParent = getObjectPropertyOwnParent(object, propertyName);
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

    let parents = getObjectPropertyOwnParents(object, propertyName);
    if (parents.length > 0) {
        parent = parents[0];
    }

    return parent;
}

export function getObjectPropertyOwnParents(object, propertyName) {
    let parents = [];

    let possibleParents = getObjectPrototypes(object);

    for (let possibleParent of possibleParents) {
        let propertyNames = Object.getOwnPropertyNames(possibleParent);
        if (propertyNames.pp_hasEqual(propertyName)) {
            parents.push(possibleParent);
        }
    }

    return parents;
}

export function getObjectFromPath(path, pathStartObject = window) {
    let object = null;

    let objectName = getObjectNameFromPath(path);
    if (objectName != null) {
        object = getObjectProperty(getObjectParentFromPath(path, pathStartObject), objectName);
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

export function getObjectParentFromPath(path, pathStartObject = window) {
    let pathSplit = path.split(".");
    let currentParent = pathStartObject;
    for (let i = 0; i < pathSplit.length - 1; i++) {
        currentParent = getObjectProperty(currentParent, pathSplit[i]);
    }

    return currentParent;
}

export function overwriteObjectProperty(newProperty, object, propertyName, overwriteOnOwnParent = true, jsObjectFunctionsSpecialOverwrite = false, debugLogActive = false) {
    let success = false;

    try {
        let propertyOwnParent = getObjectPropertyOwnParent(object, propertyName);
        if (propertyOwnParent != null) {
            let originalPropertyDescriptor = Object.getOwnPropertyDescriptor(propertyOwnParent, propertyName);

            if (originalPropertyDescriptor != null) {
                let originalProperty = getObjectProperty(propertyOwnParent, propertyName);
                copyObjectProperties(originalProperty, newProperty, true, jsObjectFunctionsSpecialOverwrite, debugLogActive);

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
        if (debugLogActive) {
            console.error("Property:", propertyName, "of:", object, "can't be overwritten.");
        }
    }

    return success;
}

export function copyObjectProperties(fromObject, toObject, cleanCopy = false, jsObjectFunctionsSpecialCopy = false, debugLogActive = false) {
    if (fromObject != null) {
        if (cleanCopy) {
            cleanObjectProperties(toObject);
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
                if (debugLogActive) {
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
    objectNames.pp_pushUnique("__proto__");

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

    let propertyDescriptor = getObjectPropertyDescriptor(object, propertyName);

    if (propertyDescriptor != null && (propertyDescriptor.get != null || propertyDescriptor.set != null)) {
        propertyUseAccessors = true;
    }

    return propertyUseAccessors;
}

export function isFunctionByName(functionParent, functionName) {
    let isFunction = false;

    let functionProperty = getObjectProperty(functionParent, functionName);
    if (functionProperty != null) {
        isFunction = typeof functionProperty == "function" && !isClassByName(functionParent, functionName);
    }

    return isFunction;
}

export function isClassByName(classParent, className) {
    let isClass = false;

    let classProperty = getObjectProperty(classParent, className);
    if (classProperty != null) {
        isClass =
            typeof classProperty == "function" && className != "constructor" &&
            classProperty.prototype != null && typeof classProperty.prototype.constructor == "function" &&
            classProperty.toString != null && typeof classProperty.toString == "function" && (/^class/).test(classProperty.toString());
    }

    return isClass;
}

export function isObjectByName(objectParent, objectName) {
    let isObject = false;

    let objectProperty = getObjectProperty(objectParent, objectName);
    if (objectProperty != null) {
        isObject = typeof objectProperty == "object";
    }

    return isObject;
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
    isObjectByName
};



function _jsObjectFunctionsSpecialCopy(fromObject, toObject) {
    try {
        if (typeof toObject == "function" && typeof fromObject == "function") {
            let functionsToOverwrite = ["toString", "toLocaleString", "valueOf"];

            for (let functionToOverwrite of functionsToOverwrite) {
                let propertyDescriptorToOverwrite = getObjectPropertyDescriptor(fromObject, functionToOverwrite);

                if (propertyDescriptorToOverwrite != null && propertyDescriptorToOverwrite.value != null &&
                    (propertyDescriptorToOverwrite.value == Object[functionToOverwrite])) {
                    let valueToReturn = Object[functionToOverwrite].bind(fromObject)();
                    let overwrittenFunction = function () { return valueToReturn; };
                    overwriteObjectProperty(overwrittenFunction, toObject, functionToOverwrite, false, false);
                }
            }
        }
    } catch (error) {
        // Ignored
    }
}