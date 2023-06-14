import { MeshComponent } from "@wonderlandengine/api";
import { EasyTuneNumber } from "../easy_tune_variable_types";
import { EasyObjectTuner } from "./easy_object_tuner";

export class EasyMeshAmbientFactor extends EasyObjectTuner {

    constructor(object, variableName, setAsWidgetCurrentVariable, useTuneTarget, engine) {
        super(object, variableName, setAsWidgetCurrentVariable, useTuneTarget, engine);
    }

    _getVariableNamePrefix() {
        let nameFirstPart = null;

        if (this._myColorModel == 0) {
            nameFirstPart = "Mesh AF ";
        } else {
            nameFirstPart = "Mesh AF ";
        }

        return nameFirstPart;
    }

    _createEasyTuneVariable(variableName) {
        return new EasyTuneNumber(variableName, this._getDefaultValue(), null, true, 3, 0.1, 0, 1);
    }

    _getObjectValue(object) {
        let ambientFactor = null;

        let meshMaterial = this._getMeshMaterial(object);
        if (meshMaterial) {
            ambientFactor = meshMaterial.ambientFactor;
        } else {
            ambientFactor = this._getDefaultValue();
        }

        return ambientFactor;
    }

    _getDefaultValue() {
        return 0;
    }

    _updateObjectValue(object, value) {
        let ambientFactor = value;

        let meshMaterial = this._getMeshMaterial(object);
        if (meshMaterial) {
            meshMaterial.ambientFactor = ambientFactor;
        }
    }

    _getMeshMaterial(object) {
        let material = null;
        let mesh = object.pp_getComponent(MeshComponent);
        if (mesh) {
            material = mesh.material;
        }

        return material;
    }
}