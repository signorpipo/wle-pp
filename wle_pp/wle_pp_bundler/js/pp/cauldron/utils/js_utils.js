PP.JSUtils = {
    getReferencePrototypes(reference) {
        let prototypes = [];

        prototypes.push(reference);

        let referenceProto = Object.getPrototypeOf(reference);
        while (referenceProto != null) {
            prototypes.pp_pushUnique(referenceProto);
            referenceProto = Object.getPrototypeOf(referenceProto);
        }

        let prototypesToCheck = [reference];
        while (prototypesToCheck.length > 0) {
            let prototypeToCheck = prototypesToCheck.shift();
            if (prototypeToCheck != null) {
                prototypes.pp_pushUnique(prototypeToCheck);

                prototypesToCheck.pp_pushUnique(Object.getPrototypeOf(prototypeToCheck));
                prototypesToCheck.pp_pushUnique(prototypeToCheck.prototype);
            }
        }

        return prototypes;
    },
    getReferencePropertyNames: function (reference) {
        let propertyNames = [];

        let prototypes = this.getReferencePrototypes(reference);

        for (let prototype of prototypes) {
            if (prototype != null) {
                let ownPropertyNames = Object.getOwnPropertyNames(prototype);
                for (let ownPropertyName of ownPropertyNames) {
                    propertyNames.pp_pushUnique(ownPropertyName);
                }
            }
        }

        return propertyNames;
    },
    getReferencePropertyDescriptor: function (reference, propertyName) {
        let propertyDescriptor = null;

        let propertyParent = this.getReferencePropertyOwnParent(reference, propertyName);

        if (propertyParent != null) {
            propertyDescriptor = Object.getOwnPropertyDescriptor(propertyParent, propertyName);
        }

        return propertyDescriptor;
    },
    getReferenceProperty: function (reference, propertyName) {
        let property = undefined;

        let propertyDescriptor = this.getReferencePropertyDescriptor(reference, propertyName);
        if (propertyDescriptor != null) {
            if (propertyDescriptor.get != null) {
                property = propertyDescriptor.get.bind(reference)();
            } else {
                property = propertyDescriptor.value;
            }
        }

        return property;
    },
    setReferenceProperty: function (valueToSet, reference, propertyName) {
        let propertyDescriptor = this.getReferencePropertyDescriptor(reference, propertyName);

        let setUsed = false;
        if (propertyDescriptor != null) {
            if (propertyDescriptor.set != null) {
                setUsed = true;

                propertyDescriptor.set.bind(reference)(valueToSet);
            }
        }

        if (!setUsed) {
            let propertyParent = this.getReferencePropertyOwnParent(reference, propertyName);
            if (propertyParent == null) {
                propertyParent = reference;
            }

            Object.defineProperty(propertyParent, propertyName, {
                value: valueToSet
            });
        }
    },
    getReferencePropertyOwnParent: function (reference, propertyName) {
        let parent = null;

        let parents = this.getReferencePropertyOwnParents(reference, propertyName);
        if (parents.length > 0) {
            parent = parents[0];
        }

        return parent;
    },
    getReferencePropertyOwnParents: function (reference, propertyName) {
        let parents = [];

        let possibleParents = this.getReferencePrototypes(reference);

        for (let possibleParent of possibleParents) {
            let propertyNames = Object.getOwnPropertyNames(possibleParent);
            if (propertyNames.pp_hasEqual(propertyName)) {
                parents.push(possibleParent);
            }
        }

        return parents;
    },
    getReferenceFromPath: function (path, pathStartReference = window) {
        let reference = null;

        let referenceName = this.getReferenceNameFromPath(path);
        if (referenceName != null) {
            reference = this.getReferenceProperty(this.getReferenceParentFromPath(path, pathStartReference), referenceName);
        }

        return reference;
    },
    getReferenceNameFromPath: function (path) {
        let referenceName = null;

        if (path != null) {
            let pathSplit = path.split(".");
            if (pathSplit.length > 0) {
                referenceName = pathSplit[pathSplit.length - 1];
            }
        }

        return referenceName;
    },
    getReferenceParentFromPath: function (path, pathStartReference = window) {
        let pathSplit = path.split(".");
        let currentParent = pathStartReference;
        for (let i = 0; i < pathSplit.length - 1; i++) {
            currentParent = this.getReferenceProperty(currentParent, pathSplit[i]);
        }

        return currentParent;
    },
    overwriteReferenceProperty: function (newProperty, reference, propertyName, overwriteOnOwnParent = true, javascriptObjectFunctionsSpecialOverwrite = false, debugLogActive = false) {
        let success = false;

        try {
            let propertyOwnParent = this.getReferencePropertyOwnParent(reference, propertyName);
            if (propertyOwnParent != null) {
                let originalPropertyDescriptor = Object.getOwnPropertyDescriptor(propertyOwnParent, propertyName);

                if (originalPropertyDescriptor != null) {
                    let originalProperty = this.getReferenceProperty(propertyOwnParent, propertyName);
                    this.copyReferenceProperties(originalProperty, newProperty, true, javascriptObjectFunctionsSpecialOverwrite, debugLogActive);

                    let overwriteTarget = reference;
                    if (overwriteOnOwnParent) {
                        overwriteTarget = propertyOwnParent;
                    }

                    Object.defineProperty(overwriteTarget, propertyName, {
                        value: newProperty,
                        enumerable: originalPropertyDescriptor.enumerable,
                        configurable: originalPropertyDescriptor.configurable,
                        writable: originalPropertyDescriptor.writable,
                    });

                    success = true;
                } else {
                    Object.defineProperty(reference, propertyName, {
                        value: newProperty
                    });

                    success = true;
                }
            } else {
                Object.defineProperty(reference, propertyName, {
                    value: newProperty
                });

                success = true;
            }
        } catch (error) {
            if (debugLogActive) {
                console.error("Property:", propertyName, "of:", reference, "can't be overwritten.");
            }
        }

        return success;
    },
    copyReferenceProperties(fromReference, toReference, cleanCopy = false, javascriptObjectFunctionsSpecialCopy = false, debugLogActive = false) {
        if (fromReference != null) {
            if (cleanCopy) {
                this.cleanReferenceProperties(toReference);
            }

            Object.setPrototypeOf(toReference, Object.getPrototypeOf(fromReference));

            let fromReferencePropertyNames = Object.getOwnPropertyNames(fromReference);
            for (let fromReferencePropertyName of fromReferencePropertyNames) {
                try {
                    let fromReferencePropertyDescriptor = Object.getOwnPropertyDescriptor(fromReference, fromReferencePropertyName);

                    Object.defineProperty(toReference, fromReferencePropertyName, {
                        value: fromReferencePropertyDescriptor.value,
                        enumerable: fromReferencePropertyDescriptor.enumerable,
                        configurable: fromReferencePropertyDescriptor.configurable,
                        writable: fromReferencePropertyDescriptor.writable
                    });
                } catch (error) {
                    if (debugLogActive) {
                        console.error("Property:", fromReferencePropertyName, "of:", fromReference.name, "can't be overwritten.");
                    }
                }
            }

            if (javascriptObjectFunctionsSpecialCopy) {
                this._javascriptObjectFunctionsSpecialCopy(fromReference, toReference);
            }
        }
    },
    cleanReferenceProperties(reference) {
        let referenceNames = Object.getOwnPropertyNames(reference);
        referenceNames.pp_pushUnique("__proto__");

        for (let referenceName of referenceNames) {
            try {
                Object.defineProperty(reference, referenceName, {
                    value: undefined
                });
            } catch (error) {
                // ignored
            }

            try {
                delete reference[referenceName];
            } catch (error) {
                // ignored
            }
        }

        Object.setPrototypeOf(reference, null);
    },
    doesReferencePropertyUseAccessors(reference, propertyName) {
        let propertyUseAccessors = false;

        let propertyDescriptor = this.getReferencePropertyDescriptor(reference, propertyName);

        if (propertyDescriptor != null && (propertyDescriptor.get != null || propertyDescriptor.set != null)) {
            propertyUseAccessors = true;
        }

        return propertyUseAccessors;
    },
    isFunctionByName(functionParent, functionName) {
        let isFunction = false;

        let functionProperty = this.getReferenceProperty(functionParent, functionName);
        if (functionProperty != null) {
            isFunction = typeof functionProperty == "function" && !this.isClassByName(functionParent, functionName);
        }

        return isFunction;
    },
    isClassByName(classParent, className) {
        let isClass = false;

        let classProperty = this.getReferenceProperty(classParent, className);
        if (classProperty != null) {
            isClass =
                typeof classProperty == "function" && className != "constructor" &&
                classProperty.prototype != null && typeof classProperty.prototype.constructor == "function" &&
                classProperty.toString != null && typeof classProperty.toString == "function" && (/^class/).test(classProperty.toString());
        }

        return isClass;
    },
    isObjectByName(objectParent, objectName) {
        let isObject = false;

        let objectProperty = this.getReferenceProperty(objectParent, objectName);
        if (objectProperty != null) {
            isObject = typeof objectProperty == "object";
        }

        return isObject;
    },
    _javascriptObjectFunctionsSpecialCopy(fromReference, toReference) {
        try {
            if (typeof toReference == "function" && typeof fromReference == "function") {
                let functionsToOverwrite = ["toString", "toLocaleString", "valueOf"];

                for (let functionToOverwrite of functionsToOverwrite) {
                    let propertyDescriptorToOverwrite = this.getReferencePropertyDescriptor(fromReference, functionToOverwrite);

                    if (propertyDescriptorToOverwrite != null && propertyDescriptorToOverwrite.value != null &&
                        (propertyDescriptorToOverwrite.value == Object[functionToOverwrite])) {
                        let valueToReturn = Object[functionToOverwrite].bind(fromReference)();
                        let overwrittenFunction = function () { return valueToReturn; };
                        this.overwriteReferenceProperty(overwrittenFunction, toReference, functionToOverwrite, false, false);
                    }
                }
            }
        } catch (error) {
            // ignored
        }
    }
};