import { Object3D, Physics, RayHit, WonderlandEngine } from "@wonderlandengine/api";
import { Vector, Vector3 } from "../../../cauldron/type_definitions/array_type_definitions.js";

export interface PhysicsExtension {
    pp_getEngine(this: Readonly<Physics>): WonderlandEngine;
}

export interface RayHitExtension {
    pp_getEngine(this: Readonly<RayHit>): WonderlandEngine;

    pp_getLocations(this: Readonly<RayHit>): Vector3[];
    pp_getLocations<T extends Vector3>(this: Readonly<RayHit>, out: T[]): T[];

    pp_getNormals(this: Readonly<RayHit>): Vector3[];
    pp_getNormals<T extends Vector3>(this: Readonly<RayHit>, out: T[]): T[];

    pp_getDistances(this: Readonly<RayHit>): Vector;
    pp_getDistances<T extends Vector>(this: Readonly<RayHit>, out: T): T;

    pp_getObjects(this: Readonly<RayHit>): Object3D[];
    pp_getObjects(this: Readonly<RayHit>, out: Object3D[]): Object3D[];
}

declare module "@wonderlandengine/api" {
    interface Physics extends PhysicsExtension { }

    interface RayHit extends RayHitExtension { }
}