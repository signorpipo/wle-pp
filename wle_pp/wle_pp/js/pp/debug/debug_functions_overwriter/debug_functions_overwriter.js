// #TODO Add getter/setter accessors overwrite
// #TODO If both a class and the parent class are in the list, they should be overwritten in parent first order
// #TODO How to overwrite class and objects from modules?
// #TODO Some functions, like glMatrix.vec3.copy, are defined as getter, how to overwrite them?

import { JSUtils } from "../../cauldron/js/utils/js_utils";
import { Globals } from "../../pp/globals";

export class DebugFunctionsOverwriterParams {

    constructor(engine = Globals.getMainEngine()) {
        this.myObjectsByReference = [];         // You can specify to count the call on a specific object instance
        this.myObjectsByPath = [];              // If you want you can specify the instance by path, but it means it must be reachable from window

        this.myClassesByReference = [];         // By Reference means by using a reference to the class, like doing Timer, but also let ref = Timer and use ref
        this.myClassesByPath = [];              // By Path means by using the full class path, like "Timer", this is requiredneeded if u want to count the constructor

        this.myFunctionsByPath = [];
        // You can also count the call to a specific function, but it must be reachable from window, no reference way
        // It's mostly for global functions, which could be tracked anyway using window as object reference

        this.myExcludeConstructors = false;      // Constructor calls count can be a problem for some classes (like Array)
        this.myExcludeJSObjectFunctions = false;

        this.myFunctionNamesToInclude = [];     // Empty means every function is included, can be a regex (. must be escaped with \\.)
        this.myFunctionNamesToExclude = [];     // Empty means no function is excluded, can be a regex (. must be escaped with \\.)

        // These can be used if u want to have a bit more control on function name filtering
        this.myFunctionPathsToInclude = [];         // Empty means every function is included, can be a regex (. must be escaped with \\.)
        this.myFunctionPathsToExclude = [];         // Empty means no function is excluded, can be a regex (. must be escaped with \\.)

        this.myObjectAddObjectDescendantsDepthLevel = 0;      // You can specify if you want to also count the OBJECT descendants of the objects you have specified
        this.myObjectAddClassDescendantsDepthLevel = 0;       // You can specify if you want to also count the CLASS descendants of the objects you have specified
        // The depth level specify how deep in the hierarchy, level 0 means no recursion, 1 only children, 2 also grand children, and so on
        // -1 to select all the hierarchy

        // These filters are only useful if u are doing recursion
        this.myObjectNamesToInclude = [];           // Empty means every object is included, can be a regex (. must be escaped with \\.)
        this.myObjectNamesToExclude = [];           // Empty means no object is excluded, can be a regex (. must be escaped with \\.)

        this.myClassNamesToInclude = [];            // Empty means every class is included, can be a regex (. must be escaped with \\.)
        this.myClassNamesToExclude = [];            // Empty means no class is excluded, can be a regex (. must be escaped with \\.)

        this.myObjectPathsToInclude = [];           // Empty means every object is included, can be a regex (. must be escaped with \\.)
        this.myObjectPathsToExclude = [];           // Empty means no object is excluded, can be a regex (. must be escaped with \\.)

        this.myClassPathsToInclude = [];            // Empty means every class is included, can be a regex (. must be escaped with \\.)
        this.myClassPathsToExclude = [];            // Empty means no class is excluded, can be a regex (. must be escaped with \\.)

        // Tricks
        // - you can specify an object/class/function as a pair [object, "name"] instead of just object
        //   and the name, if not null, will be used as path instead of the default one
        //   WARNING: this means that there is a specific case, an array of 2 elements with a string, which can't be tracked if you don't put it inside an array like above

        this.myLogEnabled = false;

        this.myEngine = engine;
    }
}

export class DebugFunctionsOverwriter {

    constructor(params = new DebugFunctionsOverwriterParams()) {
        this._myParams = params;

        this._myPropertiesAlreadyOverwritten = new Map();
    }

    overwriteFunctions() {
        let classesAndParents = this._getReferencesAndParents(this._myParams.myClassesByReference, this._myParams.myClassesByPath, true);
        let objectsAndParents = this._getReferencesAndParents(this._myParams.myObjectsByReference, this._myParams.myObjectsByPath, false);
        let functionsAndParents = this._getReferencesAndParents([], this._myParams.myFunctionsByPath, false);

        this._objectAddDescendants(objectsAndParents, classesAndParents);

        for (let referenceAndParent of classesAndParents) {
            let reference = referenceAndParent[0];
            let referenceParent = referenceAndParent[1];
            let referenceName = referenceAndParent[2];
            let referencePath = referenceAndParent[3];
            let referenceNameForFilter = referenceAndParent[4];

            this._overwriteReferenceFunctions(reference, referenceParent, referenceName, referencePath, referenceNameForFilter, true);
        }

        for (let referenceAndParent of objectsAndParents) {
            let reference = referenceAndParent[0];
            let referenceParent = referenceAndParent[1];
            let referenceName = referenceAndParent[2];
            let referencePath = referenceAndParent[3];
            let referenceNameForFilter = referenceAndParent[4];

            this._overwriteReferenceFunctions(reference, referenceParent, referenceName, referencePath, referenceNameForFilter, false);
        }

        for (let referenceAndParent of functionsAndParents) {
            let referenceParent = referenceAndParent[1];
            let referenceName = referenceAndParent[2];
            let referencePath = referenceAndParent[3];

            this._overwriteFunction(referenceParent, referenceName, null, null, referencePath, false, true);
        }
    }

    // Hooks

    _getOverwrittenFunction(reference, propertyName, referencePath, isClass, isFunction) {
        return JSUtils.getObjectProperty(reference, propertyName);
    }

    _getOverwrittenConstructor(reference, propertyName, referencePath, isClass, isFunction) {
        return JSUtils.getObjectProperty(reference, propertyName);
    }

    _onOverwriteSuccess(reference, propertyName, referenceParentForConstructor, referenceNameForConstructor, referencePath, isClass, isFunction, isConstructor) {

    }

    _onOverwriteFailure(reference, propertyName, referenceParentForConstructor, referenceNameForConstructor, referencePath, isClass, isFunction, isConstructor) {

    }

    // Hooks end

    _overwriteReferenceFunctions(reference, referenceParent, referenceName, referencePath, referenceNameForFilter, isClass) {
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

        let validReferencePath = this._filterName(referencePath, includePathList, excludePathList);
        let validReferenceName = this._filterName(referenceNameForFilter, includeNameList, excludeNameList);
        if (validReferencePath && validReferenceName) {
            let propertyNames = JSUtils.getObjectPropertyNames(reference);
            if (propertyNames.pp_hasEqual("constructor")) {
                propertyNames.unshift("constructor"); // Be sure it's added first to spot bugs, not important that it appears twice in the list
            }

            for (let propertyName of propertyNames) {
                let overwriteTargetReference = null;

                let referenceParentForConstructor = null;
                let referenceNameForConstructor = null;

                if (isClass) {
                    let fixedReference = reference;

                    if (referenceParent != null) {
                        let ownReferenceDescriptor = Object.getOwnPropertyDescriptor(referenceParent, referenceName);
                        if (ownReferenceDescriptor != null && ownReferenceDescriptor.value != null) {
                            fixedReference = ownReferenceDescriptor.value;
                        }
                    }

                    overwriteTargetReference = fixedReference.prototype;
                    if (overwriteTargetReference == null) {
                        overwriteTargetReference = fixedReference;
                    } else {
                        try {
                            let referenceProperty = JSUtils.getObjectProperty(overwriteTargetReference, propertyName);
                            if (referenceProperty == null) {
                                overwriteTargetReference = fixedReference;
                            }
                        } catch (error) {
                            overwriteTargetReference = fixedReference;
                        }
                    }

                    referenceParentForConstructor = referenceParent;
                    referenceNameForConstructor = referenceName;
                } else {
                    overwriteTargetReference = reference;
                }

                this._overwriteFunction(overwriteTargetReference, propertyName, referenceParentForConstructor, referenceNameForConstructor, referencePath, isClass, false);

            }
        }
    }

    _overwriteFunction(reference, propertyName, referenceParentForConstructor, referenceNameForConstructor, referencePath, isClass, isFunction) {
        try {
            let propertyCountedAlready = this._myPropertiesAlreadyOverwritten.get(propertyName) != null && this._myPropertiesAlreadyOverwritten.get(propertyName).pp_hasEqual(reference);
            if (!propertyCountedAlready) {
                if (JSUtils.isFunctionByName(reference, propertyName)) {
                    if (!this._myParams.myExcludeJSObjectFunctions || !this._isJSObjectFunction(propertyName)) {
                        let validFunctionName = this._filterName(propertyName, this._myParams.myFunctionNamesToInclude, this._myParams.myFunctionNamesToExclude);
                        let validFunctionPath = this._filterName((referencePath != null ? referencePath + "." : "") + propertyName, this._myParams.myFunctionPathsToInclude, this._myParams.myFunctionPathsToExclude);
                        if (validFunctionName && validFunctionPath) {
                            if (!this._myPropertiesAlreadyOverwritten.has(propertyName)) {
                                this._myPropertiesAlreadyOverwritten.set(propertyName, []);
                            }

                            let overwriteSuccess = false;
                            let isConstructor = false;
                            if (propertyName != "constructor") {
                                try {
                                    let newFunction = this._getOverwrittenFunction(reference, propertyName, referencePath, isClass, isFunction);
                                    if (newFunction != JSUtils.getObjectProperty(reference, propertyName)) {
                                        overwriteSuccess = JSUtils.overwriteObjectProperty(newFunction, reference, propertyName, false, true, this._myParams.myLogEnabled);
                                    } else {
                                        overwriteSuccess = true;
                                    }
                                } catch (error) {
                                    overwriteSuccess = false;

                                    if (this._myParams.myLogEnabled) {
                                        console.error(error);
                                    }
                                }
                            } else if (!this._myParams.myExcludeConstructors && isClass && referenceParentForConstructor != null) {
                                let referenceForConstructor = JSUtils.getObjectProperty(referenceParentForConstructor, referenceNameForConstructor);
                                if (referenceForConstructor != null && referenceForConstructor.prototype != null) {
                                    isConstructor = true;

                                    try {
                                        let newConstructor = this._getOverwrittenConstructor(referenceParentForConstructor, referenceNameForConstructor, referencePath, isClass, isFunction);
                                        if (newConstructor != referenceForConstructor) {
                                            overwriteSuccess = JSUtils.overwriteObjectProperty(newConstructor, referenceParentForConstructor, referenceNameForConstructor, false, true, this._myParams.myLogEnabled);
                                            if (overwriteSuccess) {
                                                overwriteSuccess = JSUtils.overwriteObjectProperty(newConstructor, referenceForConstructor.prototype, propertyName, false, true, this._myParams.myLogEnabled);
                                            }
                                        } else {
                                            overwriteSuccess = true;
                                        }
                                    } catch (error) {
                                        overwriteSuccess = false;

                                        if (this._myParams.myLogEnabled) {
                                            console.error(error);
                                        }
                                    }
                                }
                            }

                            if (overwriteSuccess) {
                                this._myPropertiesAlreadyOverwritten.get(propertyName).push(reference);
                                this._onOverwriteSuccess(reference, propertyName, referenceParentForConstructor, referenceNameForConstructor, referencePath, isClass, isFunction, isConstructor);
                            } else {
                                this._onOverwriteFailure(reference, propertyName, referenceParentForConstructor, referenceNameForConstructor, referencePath, isClass, isFunction, isConstructor);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            if (this._myParams.myLogEnabled) {
                console.error(error);
            }
        }
    }

    _getReferencesAndParents(byReferenceList, byPathList, isClass) {
        let referenceAndParents = [];

        let equalCallback = (first, second) => first[0] == second[0];

        for (let pathPair of byPathList) {
            let path = pathPair;
            let referenceName = "";
            let referencePath = pathPair;
            let referenceNameForFilter = "";

            if (pathPair != null && Array.isArray(pathPair) && pathPair.length != null && pathPair.length == 2 && typeof pathPair[1] == "string") {
                path = pathPair[0];
                referencePath = pathPair[1];
            }

            referenceName = JSUtils.getObjectNameFromPath(path);
            referenceNameForFilter = JSUtils.getObjectNameFromPath(referencePath);

            let reference = JSUtils.getObjectFromPath(path, Globals.getWindow(this._myParams.myEngine));
            let referenceParent = JSUtils.getObjectParentFromPath(path, Globals.getWindow(this._myParams.myEngine));

            if (reference != null) {
                referenceAndParents.pp_pushUnique([reference, referenceParent, referenceName, referencePath, referenceNameForFilter], equalCallback);
            }
        }

        for (let referencePair of byReferenceList) {
            let reference = referencePair;
            let referenceName = "";
            let referencePath = "";
            let referenceNameForFilter = "";

            if (referencePair != null && referencePair.length != null && referencePair.length == 2 && typeof referencePair[1] == "string") {
                reference = referencePair[0];
                referencePath = referencePair[1];
                referenceNameForFilter = JSUtils.getObjectNameFromPath(referencePath);
            } else {
                referencePath = isClass ? reference.name : null;
                referenceNameForFilter = isClass ? reference.name : null;
            }

            if (isClass) {
                referenceName = reference.name;
            } else {
                referenceName = JSUtils.getObjectNameFromPath(referencePath);
            }

            if (reference != null) {
                referenceAndParents.pp_pushUnique([reference, null, referenceName, referencePath, referenceNameForFilter], equalCallback);
            }
        }

        return referenceAndParents;
    }

    _objectAddDescendants(objectsAndParents, classesAndParents) {
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
                objectLevel + 1 <= this._myParams.myObjectAddObjectDescendantsDepthLevel || this._myParams.myObjectAddObjectDescendantsDepthLevel == -1) ||
                objectLevel + 1 <= this._myParams.myObjectAddClassDescendantsDepthLevel || this._myParams.myObjectAddClassDescendantsDepthLevel == -1) {

                let propertyNames = null;
                try {
                    propertyNames = JSUtils.getObjectPropertyNames(object);
                } catch (error) {
                    continue;
                }

                for (let propertyName of propertyNames) {
                    let objectProperty = null;

                    try {
                        objectProperty = JSUtils.getObjectProperty(object, propertyName);
                        if (objectProperty == null) {
                            continue;
                        }
                    } catch (error) {
                        continue;
                    }

                    let currentPath = "";
                    let currentName = "";
                    if (objectPath != null) {
                        currentName = propertyName;
                        currentPath = objectPath + "." + currentName;
                    } else {
                        currentName = propertyName;
                        currentPath = currentName;
                    }

                    let isClass = JSUtils.isClassByName(object, propertyName);
                    let isObject = JSUtils.isObjectByName(object, propertyName);

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

                    let validReferencePath = this._filterName(currentPath, includePathList, excludePathList);
                    let validReferenceName = this._filterName(propertyName, includeNameList, excludeNameList);
                    if (validReferencePath && validReferenceName) {
                        if (isObject && (objectLevel + 1 <= this._myParams.myObjectAddObjectDescendantsDepthLevel || this._myParams.myObjectAddObjectDescendantsDepthLevel == -1)) {
                            objectsAndParents.pp_pushUnique([objectProperty, object, propertyName, currentPath, currentName], equalCallback);
                        }

                        if (isClass && (objectLevel + 1 <= this._myParams.myObjectAddClassDescendantsDepthLevel || this._myParams.myObjectAddClassDescendantsDepthLevel == -1)) {
                            classesAndParents.pp_pushUnique([objectProperty, object, propertyName, currentPath, currentName], equalCallback);
                        }

                        if (isObject) {
                            objectsToVisit.pp_pushUnique([objectProperty, objectLevel + 1, currentPath], equalCallback);
                        }
                    }
                }
            }
        }
    }

    _filterName(name, includeList, excludeList) {
        let validName = includeList.length == 0;
        for (let includeName of includeList) {
            if (name.match(includeName) != null) {
                validName = true;
                break;
            }
        }

        if (validName) {
            for (let excludeName of excludeList) {
                if (name.match(excludeName) != null) {
                    validName = false;
                    break;
                }
            }
        }

        return validName;
    }

    _isJSObjectFunction(propertyName) {
        // Implemented outside class definition
    }
}



// IMPLEMENTATION

DebugFunctionsOverwriter.prototype._isJSObjectFunction = function () {
    let jsObjectFunctions = [
        "__defineGetter__", "__defineSetter__", "hasOwnProperty", "__lookupGetter__", "__lookupSetter__", "isPrototypeOf",
        "propertyIsEnumerable", "toString", "valueOf", "__proto__", "toLocaleString", "arguments", "caller", "apply", "bind", "call", "callee"];
    return function _isJSObjectFunction(propertyName) {
        return jsObjectFunctions.pp_hasEqual(propertyName);
    };
}();