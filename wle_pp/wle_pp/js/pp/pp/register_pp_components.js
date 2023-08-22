import { AddPPToWindowComponent, AddWLToWindowComponent, AdjustHierarchyPhysXScaleComponent, AudioManagerComponent, BenchmarkMaxPhysXComponent, BenchmarkMaxVisibleTrianglesComponent, CADisplayLeaderboardComponent, CharacterCollisionSystemComponent, ClearConsoleOnXRSessionStartComponent, ConsoleVRToolComponent, CopyHandTransformComponent, CopyHeadTransformComponent, CopyPlayerTransformComponent, CopyReferenceSpaceTransformComponent, DebugArrayFunctionsPerformanceAnalyzerComponent, DebugFunctionsPerformanceAnalyzerComponent, DebugManagerComponent, DebugPPArrayCreationPerformanceAnalyzerComponent, DebugPPFunctionsPerformanceAnalyzerComponent, DebugTransformComponent, DebugWLComponentsFunctionsPerformanceAnalyzerComponent, DebugWLFunctionsPerformanceAnalyzerComponent, EasyLightAttenuationComponent, EasyLightColorComponent, EasyMeshAmbientFactorComponent, EasyMeshColorComponent, EasyScaleComponent, EasySetTuneTargeetGrabComponent, EasySetTuneTargetChildNumberComponent, EasyTextColorComponent, EasyTransformComponent, EasyTuneImportVariablesComponent, EasyTuneToolComponent, EnableDebugComponent, EnableToolComponent, FingerCursorComponent, GamepadControlSchemeComponent, GamepadMeshAnimatorComponent, GetDefaultResourcesComponent, GetSceneObjectsComponent, GrabbableComponent, GrabberHandComponent, InitConsoleVRComponent, InitEasyTuneVariablesComponent, InputManagerComponent, MuteEverythingComponent, ObjectPoolManagerComponent, PPGatewayComponent, PlayerLocomotionComponent, SetActiveComponent, SetHandLocalTransformComponent, SetHeadLocalTransformComponent, SetPlayerHeightComponent, SetTrackedHandJointLocalTransformComponent, ShowFPSComponent, SpatialAudioListenerComponent, SwitchHandObjectComponent, ToolCursorComponent, TrackedHandDrawAllJointsComponent, TrackedHandDrawJointComponent, TrackedHandDrawSkinComponent, VirtualGamepadComponent, VisualManagerComponent } from "..";

export function registerPPComponents(engine) {
    engine.registerComponent(
        AddPPToWindowComponent,
        AddWLToWindowComponent,
        AdjustHierarchyPhysXScaleComponent,
        AudioManagerComponent,
        BenchmarkMaxPhysXComponent,
        BenchmarkMaxVisibleTrianglesComponent,
        CADisplayLeaderboardComponent,
        CharacterCollisionSystemComponent,
        ClearConsoleOnXRSessionStartComponent,
        ConsoleVRToolComponent,
        CopyHandTransformComponent,
        CopyHeadTransformComponent,
        CopyReferenceSpaceTransformComponent,
        CopyPlayerTransformComponent,
        DebugPPArrayCreationPerformanceAnalyzerComponent,
        DebugArrayFunctionsPerformanceAnalyzerComponent,
        DebugFunctionsPerformanceAnalyzerComponent,
        DebugManagerComponent,
        DebugPPFunctionsPerformanceAnalyzerComponent,
        DebugTransformComponent,
        DebugWLComponentsFunctionsPerformanceAnalyzerComponent,
        DebugWLFunctionsPerformanceAnalyzerComponent,
        EasyLightAttenuationComponent,
        EasyLightColorComponent,
        EasyMeshAmbientFactorComponent,
        EasyMeshColorComponent,
        EasyScaleComponent,
        EasySetTuneTargeetGrabComponent,
        EasySetTuneTargetChildNumberComponent,
        EasyTextColorComponent,
        EasyTransformComponent,
        EasyTuneImportVariablesComponent,
        EasyTuneToolComponent,
        EnableDebugComponent,
        EnableToolComponent,
        FingerCursorComponent,
        GamepadControlSchemeComponent,
        GamepadMeshAnimatorComponent,
        GetDefaultResourcesComponent,
        GetSceneObjectsComponent,
        GrabbableComponent,
        GrabberHandComponent,
        InitConsoleVRComponent,
        InitEasyTuneVariablesComponent,
        InputManagerComponent,
        MuteEverythingComponent,
        ObjectPoolManagerComponent,
        PPGatewayComponent,
        PlayerLocomotionComponent,
        SetActiveComponent,
        SetHandLocalTransformComponent,
        SetHeadLocalTransformComponent,
        SetPlayerHeightComponent,
        SetTrackedHandJointLocalTransformComponent,
        ShowFPSComponent,
        SpatialAudioListenerComponent,
        SwitchHandObjectComponent,
        ToolCursorComponent,
        TrackedHandDrawAllJointsComponent,
        TrackedHandDrawJointComponent,
        TrackedHandDrawSkinComponent,
        VirtualGamepadComponent,
        VisualManagerComponent);
}