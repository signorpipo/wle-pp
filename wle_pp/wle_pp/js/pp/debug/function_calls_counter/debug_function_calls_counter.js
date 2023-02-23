PP.DebugFunctionCallsCounterParams = class DebugFunctionCallsCounterParams {
    constructor() {
        this.myObjectsByReference = [];         // You can specify to count the call on a specific object instance
        this.myObjectsByPath = [];              // If you want you can specify the instance by path, but it means it must be reachable from window

        this.myClassesByReference = [];         // By Reference means by using a reference to the class, like doing PP.Timer, but also let ref = PP.Timer and use ref
        this.myClassesByPath = [];              // By Path means by using the full class path, like "PP.Timer", this is requiredneeded if u want to count the constructor

        this.myFunctionsByPath = [];
        // You can also count the call to a specific function, but it must be reachable from window, no reference way
        // It's mostly for global functions, which could be tracked anyway using window as object reference

        this.myExcludeConstructors = false;      // constructor calls count can be a problem for some classes (like Array)
        this.myExcludeJavascriptObjectFunctions = false;

        this.myAddPathPrefix = true;
        // this works at best when the object/class is specified as path, since with reference it's not possible to get the full path or get the variable name of the reference

        this.myFunctionNamesToInclude = [];     // empty means every function is included, can be a regex
        this.myFunctionNamesToExclude = [];     // empty means no function is excluded, can be a regex

        // these can be used if u want to have a bit more control on function name filtering
        this.myFunctionPathsToInclude = [];         // empty means every function is included, can be a regex
        this.myFunctionPathsToExclude = [];         // empty means no function is excluded, can be a regex

        this.myObjectRecursionDepthLevelforObjects = 0;     // you can specify if you want to also count the children OBJECTS of the objects you have specified
        this.myObjectRecursionDepthLevelforClasses = 0;     // you can specify if you want to also count the children CLASSES of the objects you have specified
        // the depth level specify how deep in the hierarchy, level 0 means no recursion, 1 only children, 2 also grand children, and so on
        // -1 to select all the hierarchy

        // these filters are only useful if u are doing recursion
        this.myObjectNamesToInclude = [];           // empty means every object is included, can be a regex
        this.myObjectNamesToExclude = [];           // empty means no object is excluded, can be a regex

        this.myClassNamesToInclude = [];            // empty means every class is included, can be a regex
        this.myClassNamesToExclude = [];            // empty means no class is excluded, can be a regex

        this.myObjectPathsToInclude = [];           // empty means every object is included, can be a regex
        this.myObjectPathsToExclude = [];           // empty means no object is excluded, can be a regex

        this.myClassPathsToInclude = [];            // empty means every class is included, can be a regex
        this.myClassPathsToExclude = [];            // empty means no class is excluded, can be a regex

        // Tricks
        // - you can specify an object/class/function as a pair [object, "name"] instead of just object
        //   and the name, if not null, will be used as path instead of the default one
        //   WARNING: this means that there is a specific case, an array of 2 elements with a string, which can't be tracked if you don't put it inside an array like above
    }
};

PP.DebugFunctionCallsCounter = class DebugFunctionCallsCounter {
    constructor(params = new PP.DebugFunctionCallsCounterParams()) {
        this._myFunctionsCallsCount = new Map();
        this._myMaxFunctionsCallsCount = new Map();
        this._myPropertiesAlreadyCounted = new Map();
        this._myFunctionsToSkip = [];

        this._myParams = params;

        this._myResetOnce = false;

        let classesAndParents = this._getReferencesAndParents(this._myParams.myClassesByReference, this._myParams.myClassesByPath, true, false);
        let objectsAndParents = this._getReferencesAndParents(this._myParams.myObjectsByReference, this._myParams.myObjectsByPath, false, false);
        let functionsAndParents = this._getReferencesAndParents([], this._myParams.myFunctionsByPath, false, true);

        this._objectRecursion(objectsAndParents, classesAndParents);

        for (let referenceAndParent of classesAndParents) {
            let reference = referenceAndParent[0];
            let referenceParent = referenceAndParent[1];
            let referenceName = referenceAndParent[2];
            let referencePath = referenceAndParent[3];
            let renamedReferenceName = referenceAndParent[4];

            this._addCallsCounter(reference, referenceParent, referenceName, true, referencePath, renamedReferenceName);
        }

        for (let referenceAndParent of objectsAndParents) {
            let reference = referenceAndParent[0];
            let referenceParent = referenceAndParent[1];
            let referenceName = referenceAndParent[2];
            let referencePath = referenceAndParent[3];
            let renamedReferenceName = referenceAndParent[4];

            this._addCallsCounter(reference, referenceParent, referenceName, false, referencePath, renamedReferenceName);
        }

        for (let referenceAndParent of functionsAndParents) {
            let reference = referenceAndParent[0];
            let referenceParent = referenceAndParent[1];
            let referenceName = referenceAndParent[2];
            let referencePath = referenceAndParent[3];

            this._addFunctionCallsCounter(referenceParent, referenceName, null, null, "function", false, true, referencePath);
        }

        this.resetCallsCount();
        this.resetMaxCallsCount();
    }

    resetCallsCount() {
        this._myResetOnce = true;

        for (let property of this._myFunctionsCallsCount.keys()) {
            if (this._myMaxFunctionsCallsCount.has(property)) {
                this._myMaxFunctionsCallsCount.set(property, Math.max(this._myMaxFunctionsCallsCount.get(property), this._myFunctionsCallsCount.get(property)));
            } else {
                this._myMaxFunctionsCallsCount.set(property, this._myFunctionsCallsCount.get(property));
            }

            this._myFunctionsCallsCount.set(property, 0);
        }
    }

    resetMaxCallsCount() {
        for (let property of this._myMaxFunctionsCallsCount.keys()) {
            this._myMaxFunctionsCallsCount.set(property, 0);
        }
    }

    getCallsCount(sortList = false) {
        let callsCount = this._myFunctionsCallsCount;

        if (sortList) {
            callsCount = new Map([...callsCount.entries()].sort(function (first, second) {
                return -(first[1] - second[1]);
            }));
        }

        return callsCount;
    }

    getMaxCallsCount(sortList = false) {
        if (!this._myResetOnce) {
            return this.getCallsCount(sortList);
        }

        let callsCount = this._myMaxFunctionsCallsCount;

        if (sortList) {
            callsCount = new Map([...callsCount.entries()].sort(function (first, second) {
                return -(first[1] - second[1]);
            }));
        }

        return callsCount;
    }

    _getReferenceFromPath(path) {
        let pathSplit = path.split(".");
        let parent = window;
        for (let i = 0; i < pathSplit.length - 1; i++) {
            parent = parent[pathSplit[i]];
        }

        return parent[pathSplit[pathSplit.length - 1]];
    }

    _getReferenceNameFromPath(path) {
        if (path == null) {
            return null;
        }

        let pathSplit = path.split(".");

        if (pathSplit.length > 0) {
            return pathSplit[pathSplit.length - 1];
        }

        return "";
    }

    _getParentReferenceFromPath(path) {
        let pathSplit = path.split(".");
        let parent = window;
        for (let i = 0; i < pathSplit.length - 1; i++) {
            parent = parent[pathSplit[i]];
        }

        return parent;
    }

    _addCallsCounter(reference, referenceParent, referenceName, isClass, referencePath, renamedReferenceName) {
        let includePathList = this._myParams.myObjectPathsToInclude;
        let excludePathList = this._myParams.myObjectPathsToExclude;
        let includeNameList = this._myParams.myObjectNamesToInclude;
        let excludeNameList = this._myParams.myObjectNamesToExclude;
        if (isClass) {
            includePathList = this._myParams.myClassPathsToInclude;
            excludePathList = this._myParams.myClassPathsToExclude;
            includeNameList = this._myParams.myClassNamesToInclude;
            excludeNameList = this._myParams.myClassNamesToExclude;
        }

        let isValidReferencePath = this._filterName(referencePath, includePathList, excludePathList);
        let isValidReferenceName = this._filterName(renamedReferenceName, includeNameList, excludeNameList);
        if (isValidReferencePath && isValidReferenceName) {
            let counterTarget = null;

            if (isClass) {
                counterTarget = reference.prototype;
            } else {
                counterTarget = reference;
            }

            let propertyNames = this._getAllPropertyNames(reference);
            for (let propertyName of propertyNames) {
                this._addFunctionCallsCounter(counterTarget, propertyName, reference, referenceParent, referenceName, isClass, false, referencePath);
            }
        }
    }

    _addFunctionCallsCounter(counterTarget, propertyName, reference, referenceParent, referenceName, isClass, isFunction, referencePath) {
        if (this._isFunction(counterTarget, propertyName)) {
            if (!this._myFunctionsToSkip.pp_hasEqual(counterTarget[propertyName])) {
                let isValidFunctionName = this._filterName(propertyName, this._myParams.myFunctionNamesToInclude, this._myParams.myFunctionNamesToExclude);
                let isValidFunctionPath = this._filterName((referencePath != null ? referencePath + "." : "") + propertyName, this._myParams.myFunctionPathsToInclude, this._myParams.myFunctionPathsToExclude);
                if (isValidFunctionName && isValidFunctionPath) {
                    if (!this._myPropertiesAlreadyCounted.has(propertyName)) {
                        this._myPropertiesAlreadyCounted.set(propertyName, []);
                    }

                    let isPropertyCountedAlready = this._myPropertiesAlreadyCounted.get(propertyName).pp_hasEqual(counterTarget);
                    if (!isPropertyCountedAlready) {
                        let callsCountName = propertyName;
                        if (referencePath != null && this._myParams.myAddPathPrefix) {
                            if (!isFunction) {
                                callsCountName = referencePath + "." + callsCountName;
                            } else {
                                callsCountName = referencePath;
                            }
                        }

                        if (propertyName != "constructor") {
                            let hadCallsCountAlreadySet = this._myFunctionsCallsCount.has(callsCountName);
                            this._myFunctionsCallsCount.set(callsCountName, 0);
                            try {
                                let functionsCallsCounters = this._myFunctionsCallsCount;

                                let backupFunction = counterTarget[propertyName];

                                let backupEnumerable = counterTarget.propertyIsEnumerable(propertyName);

                                let newFunction = function () {
                                    functionsCallsCounters.set(callsCountName, functionsCallsCounters.get(callsCountName) + 1);
                                    return backupFunction.bind(this)(...arguments);
                                };

                                let properties = Object.getOwnPropertyNames(backupFunction);
                                for (let property of properties) {
                                    try {
                                        Object.defineProperty(newFunction, property, { value: backupFunction[property] });
                                    } catch (error) {
                                    }
                                }

                                Object.defineProperty(counterTarget, propertyName, {
                                    value: newFunction,
                                    enumerable: backupEnumerable
                                });
                            } catch (error) {
                                if (!hadCallsCountAlreadySet) {
                                    this._myFunctionsCallsCount.delete(callsCountName);
                                }
                            }
                        } else if (!this._myParams.myExcludeConstructors && isClass && referenceParent != null && referenceParent[referenceName] != null
                            && referenceParent[referenceName].prototype != null) {
                            let hadCallsCountAlreadySet = this._myFunctionsCallsCount.has(callsCountName);
                            this._myFunctionsCallsCount.set(callsCountName, 0);
                            try {
                                let functionsCallsCounters = this._myFunctionsCallsCount;

                                let backupConstructor = referenceParent[referenceName];
                                let newConstructor = function () {
                                    functionsCallsCounters.set(callsCountName, functionsCallsCounters.get(callsCountName) + 1);
                                    return new reference(...arguments);
                                };

                                Object.defineProperty(newConstructor, "toString", {
                                    value: function () { return backupConstructor.toString() },
                                    enumerable: backupConstructor.propertyIsEnumerable("toString")
                                });

                                Object.defineProperty(newConstructor, "toLocaleString", {
                                    value: function () { return backupConstructor.toLocaleString() },
                                    enumerable: backupConstructor.propertyIsEnumerable("toLocaleString")
                                });

                                this._setClassConstructor(referenceName, referenceParent, newConstructor);
                            } catch (error) {
                                if (!hadCallsCountAlreadySet) {
                                    this._myFunctionsCallsCount.delete(callsCountName);
                                }
                            }

                            this._myFunctionsToSkip.push(referenceParent[referenceName]);
                        }

                        this._myPropertiesAlreadyCounted.get(propertyName).push(counterTarget);
                    }
                }
            }
        }
    }

    _getReferencesAndParents(byReferenceList, byPathList, isClass) {
        let equalCallback = (first, second) => first[0] == second[0];
        let referenceAndParents = [];

        for (let pathPair of byPathList) {
            let path = pathPair;
            let referenceNameToUse = "";
            let referencePathToUse = pathPair;
            let renamedReferenceName = "";

            if (pathPair != null && Array.isArray(pathPair) && pathPair.length != null && pathPair.length == 2 && typeof pathPair[1] == "string") {
                path = pathPair[0];
                referencePathToUse = pathPair[1];
            }

            referenceNameToUse = this._getReferenceNameFromPath(path);
            renamedReferenceName = this._getReferenceNameFromPath(referencePathToUse);

            let reference = this._getReferenceFromPath(path);
            let referenceParent = this._getParentReferenceFromPath(path);

            if (reference != null) {
                referenceAndParents.pp_pushUnique([reference, referenceParent, referenceNameToUse, referencePathToUse, renamedReferenceName], equalCallback);
            }
        }

        for (let referencePair of byReferenceList) {
            let reference = referencePair;
            let referenceNameToUse = "";
            let referencePathToUse = "";
            let renamedReferenceName = "";

            if (referencePair != null && referencePair.length != null && referencePair.length == 2 && typeof referencePair[1] == "string") {
                reference = referencePair[0];
                referencePathToUse = referencePair[1];
                renamedReferenceName = this._getReferenceNameFromPath(referencePathToUse);
            } else {
                referencePathToUse = isClass ? reference.name : null;
                renamedReferenceName = isClass ? reference.name : null;
            }

            if (isClass) {
                referenceNameToUse = reference.name;
            } else {
                referenceNameToUse = this._getReferenceNameFromPath(referencePathToUse);
            }

            if (reference != null) {
                referenceAndParents.pp_pushUnique([reference, null, referenceNameToUse, referencePathToUse, renamedReferenceName], equalCallback);
            }
        }

        return referenceAndParents;
    }

    _isFunction(reference, propertyName) {
        let isFunction = false;

        try {
            isFunction = typeof reference[propertyName] == "function" && !this._isClass(reference, propertyName);
        } catch (error) { }

        return isFunction;
    }

    _isClass(reference, propertyName) {
        let isClass = false;

        try {
            isClass = typeof reference[propertyName] == "function" && propertyName != "constructor" && reference[propertyName].prototype != null && typeof reference[propertyName].prototype.constructor == "function" &&
                (/^class/).test(reference[propertyName].toString());
        } catch (error) { }

        return isClass;
    }


    _isObject(reference, propertyName) {
        return typeof reference[propertyName] == "object";
    }

    _getAllPropertyNames(reference) {
        let properties = Object.getOwnPropertyNames(reference);

        let prototype = reference.prototype;
        if (prototype == null) {
            prototype = Object.getPrototypeOf(reference);
        }

        if (prototype != null && (!this._myParams.myExcludeJavascriptObjectFunctions || prototype != Object.prototype)) {
            let recursivePropertyNames = this._getAllPropertyNames(prototype);
            for (let recursivePropertyName of recursivePropertyNames) {
                properties.pp_pushUnique(recursivePropertyName);
            }
        }

        return properties;
    }

    _objectRecursion(objectsAndParents, classesAndParents) {
        let equalCallback = (first, second) => first[0] == second[0];

        let objectsToVisit = [];
        for (let objectAndParent of objectsAndParents) {
            objectsToVisit.pp_pushUnique([objectAndParent[0], 0, objectAndParent[3]], equalCallback);
        }

        while (objectsToVisit.length > 0) {
            let objectToVisit = objectsToVisit.shift();

            let object = objectToVisit[0];
            let objectLevel = objectToVisit[1];
            let objectPath = objectToVisit[2];

            if ((
                objectLevel + 1 <= this._myParams.myObjectRecursionDepthLevelforObjects || this._myParams.myObjectRecursionDepthLevelforObjects == -1) ||
                objectLevel + 1 <= this._myParams.myObjectRecursionDepthLevelforClasses || this._myParams.myObjectRecursionDepthLevelforClasses == -1) {

                let propertyNames = this._getAllPropertyNames(object);

                for (let propertyName of propertyNames) {
                    try {
                        if (object[propertyName] == null) {
                            continue;
                        }
                    } catch (error) {
                        continue;
                    }

                    let currentPath = "";
                    let currentName = "";
                    if (objectPath != null) {
                        if (objectPath == "_WL._components" && (object[propertyName]._type != null)) {
                            currentName = "[" + propertyName + "]" + "{\"" + object[propertyName]._type + "\"}";
                            currentPath = objectPath + currentName;
                        } else if (objectPath == "_WL._componentTypes" && (object[propertyName].TypeName != null)) {
                            currentName = object[propertyName].TypeName;
                            currentPath = objectPath + "[\"" + currentName + "\"]";
                        } else {
                            currentName = propertyName;
                            currentPath = objectPath + "." + currentName;
                        }
                    } else {
                        currentName = propertyName;
                        currentPath = currentName;
                    }

                    let isClass = this._isClass(object, propertyName);
                    let isObject = this._isObject(object, propertyName);

                    let includePathList = this._myParams.myObjectPathsToInclude;
                    let excludePathList = this._myParams.myObjectPathsToExclude;
                    let includeNameList = this._myParams.myObjectNamesToInclude;
                    let excludeNameList = this._myParams.myObjectNamesToExclude;
                    if (isClass) {
                        includePathList = this._myParams.myClassPathsToInclude;
                        excludePathList = this._myParams.myClassPathsToExclude;
                        includeNameList = this._myParams.myClassNamesToInclude;
                        excludeNameList = this._myParams.myClassNamesToExclude;
                    }

                    let isValidReferencePath = this._filterName(currentPath, includePathList, excludePathList);
                    let isValidReferenceName = this._filterName(propertyName, includeNameList, excludeNameList);
                    if (isValidReferencePath && isValidReferenceName) {
                        if (isObject && (objectLevel + 1 <= this._myParams.myObjectRecursionDepthLevelforObjects || this._myParams.myObjectRecursionDepthLevelforObjects == -1)) {
                            objectsAndParents.pp_pushUnique([object[propertyName], object, propertyName, currentPath, currentName], equalCallback);
                        }

                        if (isClass && (objectLevel + 1 <= this._myParams.myObjectRecursionDepthLevelforClasses || this._myParams.myObjectRecursionDepthLevelforClasses == -1)) {
                            classesAndParents.pp_pushUnique([object[propertyName], object, propertyName, currentPath, currentName], equalCallback);
                        }

                        if (isObject) {
                            objectsToVisit.pp_pushUnique([object[propertyName], objectLevel + 1, currentPath], equalCallback);
                        }
                    }
                }
            }
        }
    }

    _filterName(name, includeList, excludeList) {
        let isValidName = includeList.length == 0;
        for (let includeName of includeList) {
            if (name.match(new RegExp(includeName)) != null) {
                isValidName = true;
                break;
            }
        }

        if (isValidName) {
            for (let excludeName of excludeList) {
                if (name.match(new RegExp(excludeName)) != null) {
                    isValidName = false;
                    break;
                }
            }
        }

        return isValidName;
    }

    _setClassConstructor(referenceName, referenceParent, newConstructor) {
        let backupConstructor = referenceParent[referenceName];

        let properties = Object.getOwnPropertyNames(backupConstructor);
        for (let property of properties) {
            try {
                Object.defineProperty(newConstructor, property, {
                    value: backupConstructor[property],
                    enumerable: backupConstructor.propertyIsEnumerable(property)
                });
            } catch (error) {
            }
        }

        referenceParent[referenceName] = newConstructor;
    }
};
