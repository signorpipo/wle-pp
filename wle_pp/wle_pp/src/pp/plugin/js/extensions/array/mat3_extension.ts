import { Matrix3, Quaternion, Vector3 } from "../../../../cauldron/type_definitions/array_type_definitions.js";
import { Mat3Utils } from "../../../../cauldron/utils/array/mat3_utils.js";
import { PluginUtils } from "../../../utils/plugin_utils.js";
import { ArrayExtensionUtils } from "./array_extension_utils.js";
import { Matrix3Extension } from "./mat3_type_extension.js";

import "./mat3_type_extension.js";

export function initMat3Extension(): void {
    _initMat3ExtensionProtoype();
}

function _initMat3ExtensionProtoype(): void {

    const mat3Extension: Matrix3Extension<Matrix3> = {

        mat3_set: function mat3_set<T extends Matrix3>(this: T,
            m00: number, m01?: number, m02?: number,
            m10?: number, m11?: number, m12?: number,
            m20?: number, m21?: number, m22?: number): T {
            return Mat3Utils.set(this,
                m00, m01!, m02!,
                m10!, m11!, m12!,
                m20!, m21!, m22!
            );
        },

        mat3_copy: function mat3_copy<T extends Matrix3>(this: T, vector: Readonly<Matrix3>): T {
            return Mat3Utils.copy(vector, this);
        },

        mat3_clone: function mat3_clone<T extends Matrix3>(this: Readonly<T>): T {
            return Mat3Utils.clone(this);
        },

        mat3_toDegrees: function mat3_toDegrees<T extends Matrix3, U extends Vector3>(this: Readonly<T>, out?: Vector3 | U): Vector3 | U {
            return Mat3Utils.toDegrees(this, out!);
        },

        mat3_toRadians: function mat3_toRadians<T extends Matrix3, U extends Vector3>(this: Readonly<T>, out?: Vector3 | U): Vector3 | U {
            return Mat3Utils.toRadians(this, out!);
        },

        mat3_toQuat: function mat3_toQuat<T extends Matrix3, U extends Quaternion>(this: Readonly<T>, out?: Quaternion | U): Quaternion | U {
            return Mat3Utils.toQuat(this, out!);
        },

        mat3_fromAxes: function mat3_fromAxes<T extends Matrix3>(this: T, leftAxis: Readonly<Vector3>, upAxis: Readonly<Vector3>, forwardAxis: Readonly<Vector3>): T {
            return Mat3Utils.fromAxes(leftAxis, upAxis, forwardAxis, this);
        }
    };

    for (const arrayLikeClassToExtend of ArrayExtensionUtils.ARRAY_LIKE_CLASSES) {
        PluginUtils.injectOwnProperties(mat3Extension, arrayLikeClassToExtend.prototype, false, true, true);
    }
}