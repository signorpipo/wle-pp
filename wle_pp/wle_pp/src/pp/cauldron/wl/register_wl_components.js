import { ARCamera8thwall, Cursor, CursorTarget, DebugObject, DeviceOrientationLook, FingerCursor, FixedFoveation, HandTracking, HitTestLocation, HowlerAudioListener, HowlerAudioSource, ImageTexture, MouseLookComponent, PlayerHeight, TargetFramerate, TeleportComponent, Trail, TwoJointIkSolver, VideoTexture, VrModeActiveSwitch, Vrm, WasdControlsComponent } from "@wonderlandengine/components";

export function registerWLComponents(engine) {
    engine.registerComponent(
        ARCamera8thwall,
        Cursor,
        CursorTarget,
        DebugObject,
        DeviceOrientationLook,
        FingerCursor,
        FixedFoveation,
        HandTracking,
        HitTestLocation,
        HowlerAudioListener,
        HowlerAudioSource,
        ImageTexture,
        MouseLookComponent,
        PlayerHeight,
        TargetFramerate,
        TeleportComponent,
        Trail,
        TwoJointIkSolver,
        VideoTexture,
        VrModeActiveSwitch,
        Vrm,
        WasdControlsComponent
    );
}