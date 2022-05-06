# Overview

A library for the [Wonderland Engine](https://wonderlandengine.com/).

To import it into your own projects, just get the `wle_pp_bundle.js` file that you can find [here](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundle.js) and add it to your project.  
If your project is a standard one (not `NPM`), the file must be added in the `Javascript source paths` section that can be found under the `Project Settings`, as any other javascript file u want to use in the project.  
If your project is an `NPM` one, the file must be required in your bundle, just like any other dependency.

The code folder can be found [here](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp).

# License
You are free to use this in your projects, just remember to credit me somewhere!

# Table of Contents  
- [Documentation](#documentation)
  * [Audio](#audio)
  * [Cauldron](#cauldron-1)
    + [Components](#components)
    + [FSM](#fsm)
    + [Utils](#utils)
  * [Debug](#debug)
  * [Gameplay](#gameplay)
    + [Grab & Throw](#grab--throw)
  * [Input](#input)
    + [Gamepad](#gamepad)
  * [Plugin](#plugin)
    + [Component Mods](#component-mods)
    + [Extensions](#extensions)
  * [Tool](#tool)
    + [Console VR](#console-vr)
    + [Easy Tune](#easy-tune)

# Documentation
[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp)

This library includes various APIs and components that integrates the one alredy included with the Wonderland Engine, and let you have an easier time with your development.

I will explain more or less everything but without going too much into details.  
Each folder under the `pp` folder will be a main section of this documentation.  
`Cauldron` is a tag name for a folder that contains a bunch of features that don't belong anywhere else.

## Audio
[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp/audio)

A collection of classes and components to manage audio files, creating audio players for a specific audio file, adding an audio listener and some other utilities.

List of features:
- [`pp-audio-listener`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/audio/audio_listener.js)
  * component that will work as an audio listener in the scene
  * usually added on the player head 
- [`PP.AudioSetup`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/audio/audio_setup.js)
  * class that let you specify which audio file to load and its settings like volume or pitch
- [`PP.AudioPlayer`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/audio/audio_player.js)
  * class that, given an Audio Setup (or a file path) will create an audio player for that file
- [`PP.AudioManager`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/audio/audio_manager.js)
  * this is a convenient way to manage all the audio setups in your game
  * you can add to it every setup you need and later ask it to create a player for a specif setup, by using an ID specified when adding the setup
  * also allow you to change the volume of the game, or stop every audio that is playing
- [`pp-audio-manager`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/audio/audio_manager_component.js)
  * component that adds a global audio manager to your game, feel free to initialize your Audio Manager this way or to use a custom solution
- [`pp-mute-all`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/audio/mute_all.js)
  * component that, when active, mutes the game
  * useful when u are testing and don't want to hear your game music without muting the browser or the headset
      
### How To
If u don't want to use the audio manager, it is as simple as filling the fields of the audio setup and then using it to create an audio player.
 
```js
let audioSetup = new PP.AudioSetup("path/to/file.wav");
audioSetup.myLoop = true;
audioSetup.mySpatial = false;
audioSetup.myVolume = 0.5;

let audioPlayer = new PP.AudioPlayer(audioSetup);
audioPlayer.play();
```

If u want to use the Audio Manager, you just have to create it somewhere and make it accessible from the rest of the code where u need to add a player (easy way is making it global for example).  
You can then add every setup you need when loading the project, so that everything that will ask for an audio player of a specific audio ID will already find it.  
The ID can be everything, an enum like SoundID could make things easier to manage but also a string can be used.

```js
var globalAudioManager = new PP.AudioManager();

globalAudioManager.addAudioSetup("audioSetupID1", audioSetup1);
globalAudioManager.addAudioSetup("audioSetupID2", audioSetup2);
globalAudioManager.addAudioSetup("audioSetupID3", audioSetup3);

...

let audioPlayer = globalAudioManager.createAudioPlayer("audioSetupID2");
audioPlayer.play();
```

## Cauldron
[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp/cauldron)

A generic collection of features.

### Cauldron
[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp/cauldron/cauldron)

List of features:
- [`PP.NumberOverValue`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/cauldron/cauldron/number_over_value.js)
  * this set of classes let you create a special number, that interpolate between different numbers based on a value u used to get it
  * it is especially useful if u want a number to change over time during a level, where the value is the time spent in the level itself
  * the range version returns a random number in the range, where the range change based on the given value
  * Example
    ```js
    //enemy speed will change from 5 to 8 as the time goes from 30 to 60
    let enemySpeed = new PP.NumberOverValue(5, 8, 30, 60); 
    let currentSpeed = enemySpeed.get(timeElapsed);
    ```
- [`PP.ObjectPoolManager`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/cauldron/cauldron/object_pool_manager.js)
  * a simple way to manage a set of pools of objects
  * you can get an object from it and it will refill if it runs out of them
  * by default works with wonderland objects that can be cloned (see object extension)
  * Example
    ```js
    let objectPoolParams = new PP.ObjectPoolParams();
    objectPoolParams.myInitialPoolSize = 20;
    objectPoolParams.myPercentageToAddWhenEmpty = 0.2;
    
    let objectPoolManager = new PP.ObjectPoolManager();
    
    objectPoolManager.addPool("pool_ID", gameObjectToClone, objectPoolParams);
    
    ...
    
    let object = objectPoolManager.getObject("pool_ID");    
    ```
- [`PP.PhysXCollisionCollector`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/cauldron/cauldron/physx_collision_collector.js)
  * collects the objects that are currently colliding with a given physx component
  * if updated it also let you know when a collision is just started or ended
  * it also let you register callback for collision start and end, even though you could still do that on the physx component itself
- [`PP.SaveManager`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/cauldron/cauldron/save_manager.js)
  * let you save and load from the local storage
  * takes care of caching the loaded result so that you don't need to load again when asking for the same data
- [`PP.Timer`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/cauldron/cauldron/timer.js)
  * nothing more than a timer that u can update and ask if it is done

### Components
[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp/cauldron/components)

List of components:
- [`pp-clear-console-on-session`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/cauldron/components/clear_console_on_session.js)
  * u can add this to the scene so that when u press VR and enter the session, the console is cleared
  * useful to clear the console from everything related to the initialization that you may have already checked before entering
- [`pp-player-height`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/cauldron/components/player_height.js)
  * used on the pivot of the player let you specify its height, when the feature `local-floor` is disabled or not supported
  * the component does nothing if `local-floor` is enabled and supported
  * this let you fallback on a default height if not supported or when testing
- [`pp-set-hierarchy-active`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/cauldron/components/set_hierarchy_active.js)
  * component that let you specify if the hierarchy of an object should be set active or not
  * useful to deactive a tree of objects that you prefer to be visible in the editor
- [`pp-set-head-transform`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/cauldron/components/set_head_transform.js) / [`pp-set-hand-transform`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/cauldron/components/set_hand_transform.js)
  * component the set the transform of its object to the one of the head/hand
  * fix forward can be used to make it so that the head/hands have the forward in the direction they look at since WebXR by default make it so the forward is in the opposite direction

### FSM
[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp/cauldron/fsm)

An fsm let you create game logic like switching between the menu and the game, or character logic like running and jumping.  
I'm not going to explain it in details, I'll suppose you already know the overall idea of what a finite state machine is.

List of features:
- [`PP.FSM`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/cauldron/fsm/fsm.js)
  * let you add states and transition between them, init it in a specific state and specify when to perform a transition
  * you can also check what is the current state, or if it can perform a specific transition or go to a specifi state and stuff like that
  * the IDs for the states and the transitions can be everything, from string to an enum to just numbers
- [`PP.State`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/cauldron/fsm/state.js)
  * a class that can be inherited from when you want to create a "class" state
- [`PP.Transition`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/cauldron/fsm/transition.js)
  * a class that can be inherited from when you want to create a "class" transition
  
#### How To
In this case an example is worth more than a billion words:
```js
let fsm = new PP.FSM();

fsm.addState("move", this._move.bind(this));
fsm.addState("jump", this._jump.bind(this));
fsm.addState("wait", new PP.TimerState(0, "end"));

fsm.addTransition("init", "move", "start");
fsm.addTransition("move", "jump", "jump", this._prepareJump.bind(this));
fsm.addTransition("jump", "wait", "end");
fsm.addTransition("wait", "move", "end");

fsm.setDebugLogActive(true, "FSM Name"); // let you see in the console what the fsm is doing

fsm..init("move");

...

fsm.update(dt); // calls _move

...

fsm.perform("jump"); // calls _prepareJump and then change state to jump

```

As u can see, a state can be either a function, a "class" state or even nothing at all, which means there will be no update, and the same is true for a transition.  
You can look at the `PP.State` and `PP.Transition` classes to have an idea of what the function signature should be.

It's important to notice that you can specify if the perform should be immediate or delayed.  
Immediate means the transition will execute when asked, while delayed means the transition will be executed when the fsm will be updated.  
This can be useful if u want to enforce a specific flow in your code.

Another thing is that nothing prevents you from doing a transition from within a state of the fsm, it can be useful and quick, but may also have unexpected result and sometimes could require a perform delayed to work properly.

#### States
[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp/cauldron/fsm/states)

A collection of states that can be used with the FSM.
  
List of states:
- [`PP.TimerState`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/cauldron/fsm/states/timer_state.js)
  * let you wait in a specific state for a given time before performing a specified transition
  
### Utils
[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp/cauldron/utils)

List of features:
- [`PP.CAUtils`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/cauldron/utils/ca_utils.js)
  * set of functions to interact with the Construct Arcade SDK, like getting a leaderboard, a user info and so on
  * you can specify a dummy server that can be used when the SDK is not available (when testing or if the game is not on CA) or when there is an error with real server
- [`PP.ColorUtils`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/cauldron/utils/color_utils.js)
  * bunch of functions to work with colors, like converting hsv to rgb, or code notation (0,1) to the human one (0,255)
- [`PP.MeshUtils`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/cauldron/utils/ca_utils.js)
  * let you create some simple meshes like a plane, and also change the alpha (or material or else) of all the meshes of an object
- [`PP.SaveUtils`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/cauldron/utils/mesh_utils.js)
  * a set of functions to interact with the local storage, that is to save and load data
- [`PP.TextUtils`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/cauldron/utils/text_utils.js)
  * for now almost empty, but could be seen as a mirror utils to the PP.MeshUtils, but for text
  * let you make every text materials under an object cloned, so that it won't be tied to the original one anymore
- [`PP.XRUtils`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/cauldron/utils/xr_utils.js)
  * some functions to interact with the WebXR APIs
  * you can check if the device that is running is emulated or if the session is active

## Debug
[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp/debug)

A collection of classes and components to help with debugging, like showing in real time the position and orientation of an object.

List of features:
- [`PP.DebugLine`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/debug/debug_line.js)
  * you can specify a start and end position and it will visualize it as a line
  * useful to show the direction of an object, or as a base building block to build more complex debugs
- [`PP.DebugAxes`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/debug/debug_axes.js)
  * show the position and orientation of a transform
  * useful to know if an object is in the right place and it is looking toward the right direction
- [`pp-debug-data`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/debug/debug_data.js)
  * a component that takes care of initializing the debug data used by the debug features
  
### How To
The main thing to do is to initialize the `PP.myDebugData` field, needed to get the materials and meshes used to create the debugs.  
You can easily do that with the `pp-debug-data` component, already added to the Scene in this project.

Beside that, u just have to create the debug u want and set the data for it:
```js
let debugLine = new PP.DebugLine();
debugLine.setColor([1, 0, 0, 1]);
debugLine.setStartEnd([0, 0, 0],[0, 0, 1]); 
```

#### Components
[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp/debug/components)
  
List of components:
- [`pp-debug-axes`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/debug/components/debug_axes_component.js)
  * a handy component to add the debug axes debug to an existing object in the scene

## Gameplay
[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp/gameplay)

A collection of gameplay features ready to be used.

### Grab & Throw
[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp/gameplay/grab_throw)

Let you add a grab and throw mechanic in your game with little effort.
You can find an outdated example of the Grab & Throw [here](https://github.com/SignorPipo/wle_grab_throw).

List of features:
- [`pp-grabber-hand`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/gameplay/grab_throw/grabber_hand.js)
  * the component that let you grab other objects
  * it is made to work when added on the player hand, even though is not a must
  * this object must also have a `physx` component on itself, used to detect the grab
- [`pp-grabbable`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/gameplay/grab_throw/grabbable.js)
  * the component you have to add to the object you want to grab
  * this object must also have a `physx` component on itself, used to detect the grab and to simulate the throw

#### How To
The configuration is pretty straight forward:
1. Add a `pp-grabber-hand` to one of the hand of the player
  * It can also be a child of the hand if you want the detection to have an offset from the hand position
2. Add a `physx` component on the same object
  * The `physx` must be kinematic (if you select trigger, be sure to select kinematic first if it disappear)
  * The `physx` should be set as trigger for the hand, but is not necessary
3. Add a `pp-grabbable` on the object you want to grab
  * In this case, the component must be added on the object itself, it can't be a child
5. Add a `physx` component on the same object
  * Be sure that the groups/block flags match the one u used for the hand

## Input
[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp/input)

A collection of classes and component to read inputs like head/hand transform or gamepad buttons.

### Cauldron
[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp/input/cauldron)

List of features:
- [`pp-finger-cursor`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/input/cauldron/finger_cursor.js)
  * u can use this component to add a cursor on the tip of the index finger that can interact with WLE `cursor-target`
- [`PP.HeadPose`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/input/cauldron/head_pose.js) / [`PP.HandPose`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/input/cauldron/hand_pose.js)
  * two classes that let you retrieve the pose of the head/hand, that is their transform and their linear and angular velocities
- [`Input Types`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/input/cauldron/input_types.js)
  * a collection of enums used to specify the type of the input, like the handedness or if it is a gamepad or a hand
- [`PP.InputUtils`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/input/cauldron/input_utils.js)
  * a bunch of functions to work with inputs

### Gamepad
[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp/input/gamepad)

Everything u need to get inputs from a gamepad, and some utilities to animate a controller or get multiple buttons press.
You can find an outdated example of the Gamepad [here](https://github.com/SignorPipo/wle_gamepad).

List of features:
- [`PP.Gamepad`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/input/gamepad/gamepad.js)
  * a simple interface to retrieve buttons and axes state, get the controller transform and also make it pulse/vibrate
  * example:
    ```js
    PP.myLeftGamepad.registerButtonEventListener(PP.ButtonType.THUMBSTICK, PP.ButtonEvent.PRESS_START, this, this._thumbstickPressStart.bind(this));        
    PP.myRightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isTouchEnd();    
    PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressStart(2); // fast pressed 2 times     
    PP.myGamepads[PP.Handedness.LEFT].getAxesInfo().myAxes;    
    PP.myRightGamepad.pulse(0.5, 1);    
    ```
- [`PP.GamepadUtils`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/input/gamepad/gamepad_utils.js)
  * a bunch of functions that work with the gamepad
  * let you check if multiple buttons are pressed at the same time, or if any button in a specified list is pressed
- [`PP.GamepadManager`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/input/gamepad/gamepad_manager.js)
  * a class that handle the creation and the update of the gamepads
- [`pp-gamepad-manager`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/input/gamepad/gamepad_manager_component.js)
  * handy component that will create a manager and update it
  * it will create a global `PP.myLeftGamepad` and a global `PP.myRightGamepad`
  * it will also create a global `PP.myGamepads` that contains both controllers and use `PP.Handedness` as index
- [`pp-gamepad-animator`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/input/gamepad/gamepad_animator.js)
  * component that let you animate a controller, that is buttons and axes move in the game like the one in real life
  * to make this work you have to use a controller model where buttons and axes have a proper positioned pivot

## Plugin
[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp/plugin)

A set of features that extends what WLE and Javascript already offer.

### Component Mods
[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp/plugin/component_mods)

These files change some of the functions of WLE components, or add to them new ones:
- [`clone_mod.js`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/plugin/component_mods/clone_mod.js)
  * adds a clone function to some built int component like mesh, text and collision
- [`cursor_mod.js`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/plugin/component_mods/cursor_mod.js) / [`cursor_target_mod.js`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/plugin/component_mods/cursor_target_mod.js)
  * adds double and triple click
  * bunch of fixes

### Extensions
[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp/plugin/extensions)

The extensions add new functions to already existing features:
- [`object_extension.js`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/plugin/extensions/object_extension.js)
	* greatly enhance what a WLE object can do
  * create a consistent and user friendly interface to get position/rotation/scale and everything u need from the object
  * all the extensions methods start with `pp_`
  * let you easily get the data in World or Local form, and in Quaternion or Degrees
  * lots of utilities to get a component in all the hierarchy, to change the active state of all the hierarchy, to change the parent without modifying its current world transform, to convert a position from/to object space and to make the object look at something
  * at the start of the file you can find a comment section explaining all the features in more details
  * example:
    ```js
    this.object.pp_getPosition();
    this.object.pp_getScaleLocal(outScale);  //out parameters are optional, if empty will return a new one
    this.object.pp_rotateAxis(angle, axis);pp_getComponentHierarchy
    this.object.pp_convertPositionObjectToWorld(position, outPosition);
    this.object.pp_getComponentHierarchy(type, index);   
    ```
- [`math_extension.js`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/plugin/extensions/math_extension.js)
  * adds some handy functions to the javascript Math library
  * all the extensions methods start with `pp_`
  * ranges from adding a clamp and a sign function that let you specify the sign of 0, to interpolation with easing functions, to random functions and utilities to compute angle ranges
  * at the start of the file you can find a comment section explaining all the features in more details
  * example:
    ```js
    Math.pp_clamp(value, start, end);
    Math.pp_mapToRange(value, originRangeStart, originRangeEnd, newRangeStart, newRangeEnd);
    Math.pp_randomInt(start, end);
    Math.pp_interpolate(from, to, interpolationValue, easingFunction); 
    Math.pp_angleDistance(from, to);
    ```
- [`array_extension.js`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/plugin/extensions/array_extension.js)
  * adds some handy functions to the javascript Array library
  * all the extensions methods start eaither with `pp_`, for method that applies on all arrays, or with the vector type that the Array represent, like `vec3_`, `quat_` and `mat4_`
  * one of the purpose is just to make `glMatrix` functions be available on the array directly
  * ranges from adding a simple remove function, to a push unique one, to one that gets the component along a specified axis and one to convert a quaternion to radians
  * at the start of the file you can find a comment section explaining all the features in more details
  * example:
    ```js
    let array = [];
    array.pp_removeIndex(index);
    array.pp_pushUnique(element);
    array.vec3_componentAlongAxis(axis, outVector); //out parameters are optional, if empty will return a new one
    array.quat_toRadians(); 
    array.mat4_getPosition();
    ```
- [`float32array_extension.js`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/plugin/extensions/float32array_extension.js)
  * a copy of the Array extension on the Float32Array type so that u can use the extension methods without worrying if u are using one or the other

## Tool
[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp/tool)

A set of tools that can help while developing and debugging.
### Cauldron
[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp/tool/cauldron)

List of features:
- [`pp-tool-cursor`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/tool/cauldron/components/tool_cursor.js)
  * component needed to interact with the tools
  * it also work with hand tracking, by adding a cursor on the index finger tip
  * just place it on one of the hands to use it

### Console VR
[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp/tool/console_vr)

Let u see the browser console from withing the vr session, making it easier to debug
There is no need to understand the details of this since it's meant to be used.
You can find an outdated example of the Console VR [here](https://github.com/SignorPipo/wle_consolevr).

#### How To
You have to add a `pp-console-vr` component to the scene, usually on the hand since it will let you keep it with you.

You can find some flags to customize it on the component.  
`OverrideConsoleBrowser` is the only important one, when enabled it will get the messages from every `console.log/warn/error` call.  
If u don't want to interfere with the built in console, you can disable it and use `PP.ConsoleVR` instead to log on it (`PP.ConsoleVR.log/error/warn`).

You can hide/show the Console VR by pressing both thumbstick buttons (`R3` + `L3`).  
If you click on the `P` button on the bottom left u can pin the console so that it will stay in place.

### Easy Tune
[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp/tool/easy_tune)

A set of tools and widgets to make it easier to tune/adjust the values in your game, and also add some "toggable" debug stuff.  
The main idea is that you have some values in the code that you would like to adjust at runtime, and this let you do exactly that.  
For this same reason, you can have some flags that enable some debug/test features, and you can change the flags values at runtime through this.

#### Easy Tune
[Code File Link](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/tool/easy_tune/easy_tune.js)

The main tool of this feature.  
Let you visualize and edit the EasyTuneVariables you have created, that can be used in the code while also edited at runtime through this tool.  
There is no need to understand the details of this since it's meant to be used.  
You can find an outdated example of the Easy Tune [here](https://github.com/SignorPipo/wle_easytune).

##### How To
You have to add a `pp-easy-tune` component to the scene, usually on the hand since it will let you keep it with you.  
You can find some flags to customize it on the component.   

You can hide/show it by pressing both the right top and bottom buttons (`A` + `B` on the oculus controller).  
If you click on the `P` button on the bottom left u can pin the easy tune so that it will stay in place.

#### Easy Tune Variables
[Code File Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp/tool/easy_tune/easy_tune_variables.js)

These are the variables that you can edit with the easy tune widget.
You can find different types:
	- Bool / Array of Bool
	- Number / Array of Number
	- Int / Array of Int
	- Transform
  
The easy tune variables are basically just a wrapper of their own type, but also offer some extra functionalities like a callback triggered when the variable change.

##### How To
To add an easy tune variable you just have to call a line like this:
```js
PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Speed", 10.32, 0.01, 3));
```

You can then get it like this:
```js
let speed = PP.myEasyTuneVariables.get("Speed"); // returns the actual value, not the easy tune variable wrapping it
```

You can add callback to the variable and set the value manually even after you created it:
```js
PP.myEasyTuneVariables.registerValueChangedEventListener("Speed", this, this._speedChanged.bind(this));
PP.myEasyTuneVariables.set("Speed", 9.25);
```

You can also set a specific variable as the active one in the widget (the one displayed when the widget is active):
```js
PP.setEasyTuneWidgetActiveVariable("Speed");
```

#### Easy Object Tuners
[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp_bundler/js/pp/tool/easy_tune/easy_object_tuners)

A set of components that makes it even easier to use the easy tune.
You just have to add the component on the object you want to tune, the variable will be created for you and the component will update the corrispondent value of the object automatically.

List of components:
- [`pp-easy-scale`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/tool/easy_tune/easy_object_tuners/easy_scale.js) / [`pp-easy-transform`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/tool/easy_tune/easy_object_tuners/easy_transform.js)
  * add a variable to adjust the scale/transform of the object
- [`pp-easy-text-color`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/tool/easy_tune/easy_object_tuners/easy_text_color.js) / [`pp-easy-mesh-color`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/tool/easy_tune/easy_object_tuners/easy_mesh_color.js)
  * add a variable to adjust the color of the first text/mesh material of the object
- [`pp-easy-light-color`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/tool/easy_tune/easy_object_tuners/easy_light_color.js) / [`pp-easy-light-attenuation`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/tool/easy_tune/easy_object_tuners/easy_light_attenuation.js)
  * add a variable to adjust the color/attenuation of the first light on the object

These components have a flag called `UseTuneTarget`, if this is enabled the variable will not update the current object, but the one specified by the current tune target.
The tune target can be changed by code by setting the object in the `PP.myEasyTuneTarget` variable, but there are also some handy components that can set it at runtime:
- [`pp-easy-set-tune-target-grab`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/tool/easy_tune/easy_object_tuners/easy_set_tune_target_grab.js)
  * if u add this component on the same object that has a grabber component on it, every object that is grabbed and then released will be the current tune target
  * this means that the object you want to tune must be a grabbable
- [`pp-easy-set-tune-target-child-number`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp_bundler/js/pp/tool/easy_tune/easy_object_tuners/easy_set_tune_target_child_number.js)
  * this will create an easy tune variable that will set as a tune target one of the children of the object on which this component is added to
  * the number is used as an index on the children list
  * 0 means no child is selected
