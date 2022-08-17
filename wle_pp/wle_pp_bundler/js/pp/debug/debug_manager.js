PP.DebugDrawObjectType = {
    LINE: 0,
    TRANSFORM: 1,
    ARROW: 2,
    POINT: 3,
    RAYCAST: 4,
    TEXT: 5
};

PP.DebugManager = class DebugManager {
    constructor() {
        this._myDebugDrawObjectTypeMap = new Map();
        this._myDebugDrawLastID = 0;
        this._myDebugDrawPool = new PP.ObjectPoolManager();
        this._myDebugDrawObjectToShow = [];
    }

    update(dt) {
        this._updateDraw(dt);
    }

    //lifetimeSeconds can be null, in that case the debug object will be drawn until cleared
    draw(debugDrawObjectParams, lifetimeSeconds = 0, idToReuse = null) {
        let debugDrawObject = null;
        let idReused = false;
        if (idToReuse != null) {
            if (this._myDebugDrawObjectTypeMap.has(debugDrawObjectParams.myType)) {
                let debugDrawObjectMap = this._myDebugDrawObjectTypeMap.get(debugDrawObjectParams.myType);
                if (debugDrawObjectMap.has(idToReuse)) {
                    debugDrawObject = debugDrawObjectMap.get(idToReuse)[0];
                    debugDrawObject.setParams(debugDrawObjectParams);
                    debugDrawObject.setVisible(false);
                    idReused = true;
                }
            }
        }

        if (debugDrawObject == null) {
            debugDrawObject = this._createDebugDrawObject(debugDrawObjectParams);
        }

        if (debugDrawObject == null) {
            console.error("Couldn't create the requested debug draw object");
            return null;
        }

        if (!this._myDebugDrawObjectTypeMap.has(debugDrawObjectParams.myType)) {
            this._myDebugDrawObjectTypeMap.set(debugDrawObjectParams.myType, new Map());
        }
        let debugDrawObjectMap = this._myDebugDrawObjectTypeMap.get(debugDrawObjectParams.myType);

        let objectID = null;
        if (!idReused) {
            objectID = this._myDebugDrawLastID + 1;
            this._myDebugDrawLastID = objectID;

            debugDrawObjectMap.set(objectID, [debugDrawObject, new PP.Timer(lifetimeSeconds, lifetimeSeconds != null)]);
        } else {
            objectID = idToReuse;
            let debugDrawObjectPair = debugDrawObjectMap.get(objectID);
            debugDrawObjectPair[0] = debugDrawObject;
            debugDrawObjectPair[1].reset(lifetimeSeconds);
            if (lifetimeSeconds != null) {
                debugDrawObjectPair[1].start();
            }
        }

        this._myDebugDrawObjectToShow.push(debugDrawObject);

        return objectID;
    }

    clearDraw(drawID = null) {
        if (drawID == null) {
            for (let debugDrawObjectMap of this._myDebugDrawObjectTypeMap.values()) {
                for (let debugDrawObject of debugDrawObjectMap.values()) {
                    this._myDebugDrawPool.releaseObject(debugDrawObject[0].getParams().myType, debugDrawObject[0]);
                }
            }

            this._myDebugDrawObjectTypeMap = new Map();
            this._myDebugDrawLastID = 0;
        } else {
            let debugDrawObject = null;
            for (let debugDrawObjectMap of this._myDebugDrawObjectTypeMap.values()) {
                if (debugDrawObjectMap.has(drawID)) {
                    debugDrawObject = debugDrawObjectMap.get(drawID);
                    this._myDebugDrawPool.releaseObject(debugDrawObject[0].getParams().myType, debugDrawObject[0]);
                    debugDrawObjectMap.delete(drawID);
                    break;
                }
            }
        }
    }

    allocateDraw(debugDrawObjectType, amount) {
        if (!this._myDebugDrawPool.hasPool(debugDrawObjectType)) {
            this._addDebugDrawObjectTypeToPool(debugDrawObjectType);
        }

        let pool = this._myDebugDrawPool.getPool(debugDrawObjectType);

        let difference = pool.getAvailableSize() - amount;
        if (difference < 0) {
            pool.increase(-difference);
        }
    }

    _updateDraw(dt) {
        for (let debugDrawObject of this._myDebugDrawObjectToShow) {
            debugDrawObject.setVisible(true);
        }
        this._myDebugDrawObjectToShow = [];

        for (let debugDrawObjectMap of this._myDebugDrawObjectTypeMap.values()) {
            let idsToRemove = [];
            for (let debugDrawObjectMapEntry of debugDrawObjectMap.entries()) {
                let debugDrawObject = debugDrawObjectMapEntry[1];
                if (debugDrawObject[1].isDone()) {
                    this._myDebugDrawPool.releaseObject(debugDrawObject[0].getParams().myType, debugDrawObject[0]);
                    idsToRemove.push(debugDrawObjectMapEntry[0]);
                }

                debugDrawObject[1].update(dt);
            }

            for (let id of idsToRemove) {
                debugDrawObjectMap.delete(id);
            }
        }
    }

    _createDebugDrawObject(params) {
        let object = null;

        if (!this._myDebugDrawPool.hasPool(params.myType)) {
            this._addDebugDrawObjectTypeToPool(params.myType);
        }

        object = this._myDebugDrawPool.getObject(params.myType);

        if (object != null) {
            object.setParams(params);
        }

        return object;
    }

    _addDebugDrawObjectTypeToPool(type) {
        let objectPoolParams = new PP.ObjectPoolParams();
        objectPoolParams.myInitialPoolSize = 10;
        objectPoolParams.myPercentageToAddWhenEmpty = 1;
        objectPoolParams.myEnableDebugLog = false;
        objectPoolParams.mySetActiveCallback = function (object, active) {
            object.setVisible(active);
        };

        let debugDrawObject = null;
        switch (type) {
            case PP.DebugDrawObjectType.LINE:
                debugDrawObject = new PP.DebugLine();
                break;
            case PP.DebugDrawObjectType.TRANSFORM:
                debugDrawObject = new PP.DebugTransform();
                break;
            case PP.DebugDrawObjectType.ARROW:
                debugDrawObject = new PP.DebugArrow();
                break;
            case PP.DebugDrawObjectType.POINT:
                debugDrawObject = new PP.DebugPoint();
                break;
            case PP.DebugDrawObjectType.RAYCAST:
                debugDrawObject = new PP.DebugRaycast();
                break;
            case PP.DebugDrawObjectType.TEXT:
                debugDrawObject = new PP.DebugText();
                break;
        }

        if (debugDrawObject != null) {
            this._myDebugDrawPool.addPool(type, debugDrawObject, objectPoolParams);
        } else {
            console.error("Debug draw object type not supported");
        }
    }
};