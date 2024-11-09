import { Object3D, Physics } from "@wonderlandengine/api";
import { vec3_create } from "../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../pp/globals.js";
import { Vector3 } from "../type_definitions/array_type_definitions.js";
import { PhysicsLayerFlags } from "./physics_layer_flags.js";

export enum RaycastBlockColliderType {
    NORMAL,
    TRIGGER,
    BOTH
}

export class RaycastParams {

    public myOrigin: Vector3 = vec3_create();
    public myDirection: Vector3 = vec3_create();
    public myDistance: number = 0;

    public myBlockLayerFlags: Readonly<PhysicsLayerFlags> = new PhysicsLayerFlags();
    public myBlockColliderType: RaycastBlockColliderType = RaycastBlockColliderType.NORMAL;

    public myObjectsToIgnore: Readonly<Object3D>[] = [];
    public myIgnoreHitsInsideCollision: boolean = false;

    public myPhysics: Readonly<Physics>;

    constructor(physics: Readonly<Physics> = Globals.getPhysics()!) {
        this.myPhysics = physics;
    }

    public copy(other: Readonly<RaycastParams>): void {
        this.myOrigin.vec3_copy(other.myOrigin);
        this.myDirection.vec3_copy(other.myDirection);
        this.myDistance = other.myDistance;

        this.myBlockLayerFlags.copy(other.myBlockLayerFlags);

        this.myObjectsToIgnore.pp_copy(other.myObjectsToIgnore);
        this.myIgnoreHitsInsideCollision = other.myIgnoreHitsInsideCollision;

        (this.myPhysics as Readonly<Physics>) = other.myPhysics;
    }

    public reset(): void {
        this.myOrigin.vec3_zero();
        this.myDirection.vec3_zero();
        this.myDistance = 0;

        this.myBlockLayerFlags.setAllFlagsActive(false);

        this.myObjectsToIgnore.pp_clear();
        this.myIgnoreHitsInsideCollision = false;
    }

    public equals(other: Readonly<RaycastParams>): boolean {
        if (this == other) return true;

        return this.myOrigin.vec3_equals(other.myOrigin) &&
            this.myDirection.vec3_equals(other.myDirection) &&
            this.myDistance == other.myDistance &&
            this.myBlockLayerFlags.equals(other.myBlockLayerFlags) &&
            this.myBlockColliderType == other.myBlockColliderType &&
            this.myObjectsToIgnore.pp_equals(other.myObjectsToIgnore) &&
            this.myIgnoreHitsInsideCollision == other.myIgnoreHitsInsideCollision &&
            this.myPhysics == other.myPhysics;
    }
}

export class RaycastResults {

    public myRaycastParams: Readonly<RaycastParams> | null = null;
    public myHits: Readonly<RaycastHit>[] = [];

    private _myUnusedHits: RaycastHit[] | null = null;

    public isColliding(ignoreHitsInsideCollision = false): boolean {
        return ignoreHitsInsideCollision ? this.getFirstHitOutsideCollision() != null : this.myHits.length > 0;
    }

    public getFirstHitInsideCollision(): Readonly<RaycastHit> | null {
        let firstHit = null;

        for (let i = 0; i < this.myHits.length; i++) {
            const hit = this.myHits[i];
            if (hit.myInsideCollision) {
                firstHit = hit;
                break;
            }
        }

        return firstHit;
    }

    public getFirstHitOutsideCollision(): Readonly<RaycastHit> | null {
        let firstHit = null;

        for (let i = 0; i < this.myHits.length; i++) {
            const hit = this.myHits[i];
            if (!hit.myInsideCollision) {
                firstHit = hit;
                break;
            }
        }

        return firstHit;
    }

    public getHitsInsideCollision(): Readonly<RaycastHit>[] {
        const hits = [];

        for (let i = 0; i < this.myHits.length; i++) {
            const hit = this.myHits[i];
            if (hit.myInsideCollision) {
                hits.push(hit);
            }
        }

        return hits;
    }

    public getHitsOutsideCollision(): Readonly<RaycastHit>[] {
        const hits = [];

        for (let i = 0; i < this.myHits.length; i++) {
            const hit = this.myHits[i];
            if (!hit.myInsideCollision) {
                hits.push(hit);
            }
        }

        return hits;
    }

    public removeHit(hitIndex: number): Readonly<RaycastHit> | null {
        const removedHit = this.myHits.pp_removeIndex(hitIndex);

        if (removedHit != null) {
            if (this._myUnusedHits == null) {
                this._myUnusedHits = [];
            }

            this._myUnusedHits.push(removedHit);
        }

        return removedHit ?? null;
    }

    public removeAllHits(): void {
        if (this._myUnusedHits == null) {
            this._myUnusedHits = [];
        }

        for (let i = 0; i < this.myHits.length; i++) {
            this._myUnusedHits.push(this.myHits[i]);
        }

        this.myHits.pp_clear();
    }


    private static readonly _copySV =
        {
            copyHitCallback(elementToCopy: Readonly<RaycastHit>, currentElement: RaycastHit | null): RaycastHit {
                if (currentElement == null) {
                    currentElement = new RaycastHit();
                }

                currentElement.copy(elementToCopy);

                return currentElement;
            }
        };
    public copy(other: Readonly<RaycastResults>): void {
        if (other.myRaycastParams == null) {
            this.myRaycastParams = null;
        } else {
            if (this.myRaycastParams == null) {
                this.myRaycastParams = new RaycastParams(other.myRaycastParams.myPhysics);
            }

            this.myRaycastParams.copy(other.myRaycastParams);
        }

        if (this.myHits.length > other.myHits.length) {
            if (this._myUnusedHits == null) {
                this._myUnusedHits = [];
            }

            for (let i = 0; i < this.myHits.length - other.myHits.length; i++) {
                this._myUnusedHits.push(this.myHits.pop()!);
            }
        } else if (this.myHits.length < other.myHits.length) {
            if (this._myUnusedHits != null) {
                const length = Math.min(this._myUnusedHits.length, other.myHits.length - this.myHits.length);

                for (let i = 0; i < length; i++) {
                    this.myHits.push(this._myUnusedHits.pop()!);
                }
            }
        }

        const copyHitCallback = RaycastResults._copySV.copyHitCallback;
        this.myHits.pp_copy(other.myHits, copyHitCallback);
    }

    public reset(): void {
        if (this.myRaycastParams != null) {
            this.myRaycastParams.reset();
        }

        this.removeAllHits();
    }

    private static readonly _equalsSV =
        {
            hitsEqualCallback: (first: Readonly<RaycastHit>, second: Readonly<RaycastHit>): boolean => first.equals(second)
        };
    public equals(other: Readonly<RaycastResults>): boolean {
        if (this == other) return true;

        const hitsEqualCallback = RaycastResults._equalsSV.hitsEqualCallback;
        return (this.myRaycastParams == other.myRaycastParams ||
            (this.myRaycastParams != null && other.myRaycastParams != null && this.myRaycastParams.equals(other.myRaycastParams))) &&
            this.myHits.pp_equals(other.myHits, hitsEqualCallback);
    }
}

export class RaycastHit {

    public myPosition: Vector3 = vec3_create();
    public myNormal: Vector3 = vec3_create();
    public myDistance: number = 0;
    public myObject: Object3D | null = null;

    public myInsideCollision: boolean = false;

    public isValid(): boolean {
        return this.myObject != null;
    }

    public copy(other: Readonly<RaycastHit>): void {
        this.myPosition.vec3_copy(other.myPosition);
        this.myNormal.vec3_copy(other.myNormal);
        this.myDistance = other.myDistance;
        this.myObject = other.myObject;
        this.myInsideCollision = other.myInsideCollision;
    }

    public reset(): void {
        this.myPosition.vec3_zero();
        this.myNormal.vec3_zero();
        this.myDistance = 0;
        this.myObject = null;
        this.myInsideCollision = false;
    }

    public equals(other: Readonly<RaycastHit>): boolean {
        if (this == other) return true;

        return this.myPosition.vec3_equals(other.myPosition) &&
            this.myNormal.vec3_equals(other.myNormal) &&
            this.myDistance == other.myDistance &&
            this.myObject == other.myObject &&
            this.myInsideCollision == other.myInsideCollision;
    }
}