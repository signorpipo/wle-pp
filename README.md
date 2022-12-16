# Overview

A library for the [Wonderland Engine](https://wonderlandengine.com/).

The code folder can be found [here](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp).

A collection of Wonderland Engine template projects that already includes this bundle can be found [here](https://github.com/SignorPipo/wle_ppefault).

A collection of assets that can be useful while working with the Wonderland Engine (like gamepads 3D models) can be found [here](https://github.com/SignorPipo/wle_assets).

## Table Of Contents  

- [Downloads](#downloads)
- [Quick Features Summary](#quick-features-summary)
- [How To Import](#how-to-import)
  * [Import through the bundle file](#import-through-the-bundle-file)
  * [Import through npm](#import-through-npm)
  * [Import through the entire code folder](#import-through-the-entire-code-folder)
- [How to Setup the Project](#how-to-setup-the-project)
- [License](#license)
- [Documentation](#documentation)

# Downloads

You can download the bundle file through the following link:
  * [`wle_pp_bundle`](https://github.com/SignorPipo/wle_pp/releases/latest/download/wle_pp_bundle.zip)

You can download the unbundled version of the library through the following link:
  * [`wle_pp`](https://github.com/SignorPipo/wle_pp/releases/latest/download/wle_pp.zip)

You can download the library through `npm`: 
  * [`npm install wle_pp`](https://www.npmjs.com/package/wle_pp)
	* unbundled version of the library
    * install the library as a list of files
  * [`npm install wle_pp_bundle`](https://www.npmjs.com/package/wle_pp_bundle)
    * bundled version of the library
    * install the library as a single bundle file
  
# Quick Features Summary

Some of the features that you can get with this library are:
  - Object Extension
    * add to the WLE object lots of functions that make the object interface more cohesive and complete
  - Gamepad
    * manages the input from the gamepads, like reading the state of a button or the value of the thumbstick
	* automatically works with the keyboard
	* u can also add a virtual gamepad to use the gamepad on a mobile device
  - Grab & Throw
    * a ready to use gameplay feature to grab and throw objects
  - FSM
    * a simple but powerful finite state machine, your best friend when developing a game
  - Array Extension
    * add to the Array object lots of functions that makes it easy to work with `vec3`, `quat` and more
  - Debug Draw
    * easily draw some debug object in the scene using functions like `PP.myDebugVisualManager.drawLine`, `PP.myDebugVisualManager.drawArrow` or `PP.myDebugVisualManager.drawRaycast`
	* this is also available in a non debug mode by using `PP.myVisualManager`, even though the quick draw methods like `drawLine` are not available
  - Console VR
    * a tool that let you see the console even when u are inside the VR session
  - Easy Tune
    * a tool that makes it easier to tune design values at runtime

# How To Import

You can find a collection of Wonderland Engine default projects that already includes the PP bundle [here](https://github.com/SignorPipo/wle_ppefault).

## Import through the bundle file

If you want to import this library into your own projects through the bundle file, you have to:
  - get the `wle_pp_bundle.js` file from [here](https://github.com/SignorPipo/wle_pp/releases/latest/download/wle_pp_bundle.zip)
  - if your project is a standard one (not `npm`), you have to:
    * add the bundle file in the `Javascript source paths` section as any other javascript file u want to use in the project
  - if your project is an `npm` one, you have to:
    * require the bundle file as any other javascript file u want to use in the project
    * require any additional WLE components (an error will be logged specifying the ones that are missing)
      * these requires must be put before the PP one
    * an official tutorial on how to setup an `npm` project and add the required WLE components can be found [here](https://wonderlandengine.com/tutorials/npm-project/)

## Import through npm

If you want to import this library into your own project through `npm` you have to:
  - install the PP package with `npm install wle_pp` / `npm install wle_pp_bundle`
  - require the package inside your bundle file with: `require('wle_pp');` / `require('wle_pp_bundle');`
  - require any additional WLE components (an error will be logged specifying the ones that are missing)
    * these requires must be put before the PP one
  - an official tutorial on how to setup an `npm` project and add the required WLE components can be found [here](https://wonderlandengine.com/tutorials/npm-project/)

## Import through the entire code folder

You can also import this library by importing the entire code folder, which could be useful if you want to customize it while developing your project.  
This is possible only if your project is an `npm` one.

In this case, you have to:
  - get the unbundled version of the library from [here](https://github.com/SignorPipo/wle_pp/releases/latest/download/wle_pp.zip)
  - require the files found in the `js/pp` folder (you can use the `bundle.js` file found in the `js` folder to see the requires you need)
  - add the dependencies found in the `package.json` file to your own `package.json`
  - require any additional WLE components (an error will be logged specifying the ones that are missing)
    * these requires must be put before the PP ones
  - an official tutorial on how to setup an `npm` project and add the required WLE components can be found [here](https://wonderlandengine.com/tutorials/npm-project/)
  
# How to Setup the Project

In order to use most of the PP library your project needs to have certain components in your scene properly setup.  
Specifically, these components needs to be added:
  - `pp-get-default-resources`
  - `pp-get-player-objects`
  - `pp-input-manager`
  - `pp-visual-manager`
  - `pp-debug-manager`
  
The best approach is to start by using a `ppefault` template project, which can be found [here](https://github.com/SignorPipo/wle_ppefault).  
If u need to integrate the bundle in an existing project you can still take a look at this template project to see how to setup the above components properly.

The `ppefault` template project also present a `Player` hierarchy structure that keeps things clean and organized.  
It's not mandatory to keep this structure but can make things easier so I advise u to use it!

# License

You are free to use this in your projects, just remember to credit me somewhere!

# Documentation

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp)

I will explain more or less everything but without going too much into details.  
Each folder under the `pp` folder will be a main section of this documentation.  
`Cauldron` is a tag name for a folder that contains a bunch of features that don't belong anywhere else.

As you will notice, everything in this bundle (classes, functions, variables) can be found under the `PP` object, that works as a sort of namespace.  
The components names always start with a `pp-` prefix.  
For the extensions (features added to already existing objects), the names usually start with a `pp_` prefix, or, for array extensions, with something like `vec_`, `vec3_`, `quat2_` based on how you want to intepret the array value.

## Table Of Contents  

- [Audio](#audio)
- [Cauldron](#cauldron-1)
  * [Benchmarks](#benchmarks)
  * [Components](#components)
  * [FSM](#fsm)
  * [Utils](#utils)
  * [Visual](#visual)
- [Debug](#debug)
- [Gameplay](#gameplay)
  * [Grab & Throw](#grab--throw)
- [Input](#input)
  * [Gamepad](#gamepad)
  * [Pose](#pose)
- [Plugin](#plugin)
  * [Component Mods](#component-mods)
  * [Extensions](#extensions)
- [Tool](#tool)
  * [Console VR](#console-vr)
  * [Easy Tune](#easy-tune)

## Audio

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/audio)

A collection of classes and components to manage audio files, creating audio players for a specific audio file, adding an audio listener and some other utilities.

List of features:
- [`pp-spatial-audio-listener`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/audio/spatial_audio_listener.js)
  * component that will work as a spatial audio listener in the scene
  * usually added on the player head 
- [`PP.AudioSetup`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/audio/audio_setup.js)
  * class that let you specify which audio file to load and its settings like volume or pitch
- [`PP.AudioPlayer`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/audio/audio_player.js)
  * class that, given an Audio Setup (or a file path) will create an audio player for that file
- [`PP.AudioManager`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/audio/audio_manager.js)
  * this is a convenient way to manage all the audio setups in your game
  * you can add to it every setup you need and later ask it to create a player for a specif setup, by using an ID specified when adding the setup
  * also allow you to change the volume of the game, or stop every audio that is playing
- [`pp-audio-manager`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/audio/audio_manager_component.js)
  * component that adds a global audio manager to your game, feel free to initialize your Audio Manager this way or to use a custom solution
- [`pp-mute-everything`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/audio/mute_everything.js)
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

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/cauldron)

A generic collection of features.

### Benchmarks

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/cauldron/benchmarks)

A set of utilities to test the performance and capabilities of the Wonderland Engine.

List of features:
- [`pp-benchmark-max-physx`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/benchmarks/max_physx.js)
  * test how many physx objects/raycasts u can have/perform in the scene at the same time
- [`pp-benchmark-max-visible-triangles`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/benchmarks/max_visible_triangles.js)
  * test how many visible triangles u can have in the scene at the same time

### Cauldron

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/cauldron/cauldron)

List of features:
- [`PP.NumberOverValue`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/cauldron/number_over_value.js)
  * this set of classes let you create a special number, that interpolate between different numbers based on a value u used to get it
  * it is especially useful if u want a number to change over time during a level, where the value is the time spent in the level itself
  * the range version returns a random number in the range, where the range change based on the given value
  * example:
    ```js
    //enemy speed will change from 5 to 8 as the time goes from 30 to 60
    let enemySpeed = new PP.NumberOverValue(5, 8, 30, 60); 
    let currentSpeed = enemySpeed.get(timeElapsed);
    ```
- [`PP.ObjectPoolManager`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/cauldron/object_pool_manager.js)
  * a simple way to manage a set of pools of objects
  * you can get an object from it and it will refill if it runs out of them
  * by default works with wonderland objects that can be cloned (see object extension)
  * example:
    ```js
    let objectPoolParams = new PP.ObjectPoolParams();
    objectPoolParams.myInitialPoolSize = 20;
    objectPoolParams.myPercentageToAddWhenEmpty = 0.2;
    
    let objectPoolManager = new PP.ObjectPoolManager();
    
    objectPoolManager.addPool("pool_ID", gameObjectToClone, objectPoolParams);
    
    ...
    
    let object = objectPoolManager.getObject("pool_ID");    
    ```
- [`PP.PhysXCollisionCollector`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/cauldron/physx_collision_collector.js)
  * collects the objects that are currently colliding with a given physx component
  * if updated it also let you know when a collision is just started or ended
  * it also let you register callback for collision start and end, even though you could still do that on the physx component itself
- [`PP.SaveManager`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/cauldron/save_manager.js)
  * let you save and load from the local storage
  * takes care of caching the loaded result so that you don't need to load again when asking for the same data
- [`PP.Timer`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/cauldron/timer.js)
  * nothing more than a timer that u can update and ask if it is done

### Components

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/cauldron/components)

List of components:
- [`pp-clear-console-on-xr-session-start`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/components/clear_console_on_xr_session_start.js)
  * u can add this to the scene so that when u press VR and enter the session, the console is cleared
  * useful to clear the console from everything related to the initialization that you may have already checked before entering
- [`pp-set-active`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/components/set_active.js)
  * component that let you specify if the hierarchy of an object should be set active or not
  * useful to deactivate a tree of objects that you prefer to be visible in the editor
- [`pp-adjust-hierarchy-physx-scale`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/components/adjust_hierarchy_physx_scale.js)
  * can be used to adjust the physx scale of all the physx components in the hierarchy the current object
  * adjusting means that every physx scale will be multiplied by the scale of the current object, since physx does not automatically adjust with the object scale
  * makes it easier to scale up/down an entire scene made of physx since u don't have to scale every single one manually
- [`pp-get-player-objects`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/components/get_player_objects.js)
  * setup a variable `PP.myPlayerObjects` so that it will contain the player objects that u have setup in the scene
  * this variable can be used to easily obtain the player objects/transforms in the code
- [`pp-get-default-resources`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/components/get_default_resources.js)
  * setup a variable `PP.myDefaultResources` so that it will contain some engine resources like meshes and materials
- [`pp-show-fps`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/components/show_fps.js)
  * easy way to show fps as a UI element

### FSM

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/cauldron/fsm)

An fsm let you create game logic like switching between the menu and the game, or character logic like running and jumping.  
I'm not going to explain it in details, I'll suppose you already know the overall idea of what a finite state machine is.

List of features:
- [`PP.FSM`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/fsm/fsm.js)
  * let you add states and transition between them, init it in a specific state and specify when to perform a transition
  * you can also check what is the current state, or if it can perform a specific transition or go to a specifi state and stuff like that
  * the IDs for the states and the transitions can be everything, from string to an enum to just numbers
- [`PP.State`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/fsm/state.js)
  * a class that can be inherited from when you want to create a "class" state
- [`PP.Transition`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/fsm/transition.js)
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

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/cauldron/fsm/states)

A collection of states that can be used with the FSM.
  
List of states:
- [`PP.TimerState`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/fsm/states/timer_state.js)
  * let you wait in a specific state for a given time before performing a specified transition

### Physics

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/cauldron/physics)

List of features:
- [`PP.PhysicsLayerFlags`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/physics/physics_layer_flags.js)
  * a class that makes it easier to create and interact with a physx mask
- [`PP.RaycastSetup`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/physics/physics_raycast_data.js) / [`PP.RaycastResult`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/physics/physics_raycast_data.js) / [`PP.RaycastHit`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/physics/physics_raycast_data.js)
  * a set of classes that are used to raycast into the scene and get the result of it  
- [`PP.PhysicsUtils`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/physics/physics_utils.js)
  * some functions to interact with PhysX
  * let you raycast into the scene 
 
### Utils

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/cauldron/utils)

List of features:
- [`PP.CAUtils`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/utils/ca_utils.js)
  * set of functions to interact with the Construct Arcade SDK, like getting a leaderboard, a user info and so on
  * you can specify a dummy server that can be used when the SDK is not available (when testing or if the game is not on CA) or when there is an error with real server
- [`PP.ColorUtils`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/utils/color_utils.js)
  * bunch of functions to work with colors, like converting hsv to rgb, or code notation (0,1) to the human one (0,255)
- [`PP.MeshUtils`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/utils/ca_utils.js)
  * some functions to create/clone/invert a mesh in an easy way
  * let you create some simple meshes like a plane, and also change the alpha (or material or else) of all the meshes of an object
- [`PP.SaveUtils`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/utils/mesh_utils.js)
  * a set of functions to interact with the local storage, that is to save and load data
- [`PP.TextUtils`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/utils/text_utils.js)
  * for now almost empty, but could be seen as a mirror utils to the PP.MeshUtils, but for text
  * let you make every text materials under an object cloned, so that it won't be tied to the original one anymore
- [`PP.XRUtils`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/utils/xr_utils.js)
  * some functions to interact with the WebXR APIs
  * you can check if the device that is running is emulated or if the session is active
- [`PP.BrowserUtils`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/utils/browser_utils.js)
  * some functions related to browser stuff, like checking if u are on a mobile or desktop browser
  
### Visual

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/cauldron/visual)

This feature let you add visual objects like lines, arrows, points and more easily.

List of features:
- [`PP.VisualManager`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/visual/visual_manager.js)
  * let you easily draw visual in the scene
- [`PP.VisualLine`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/visual/visual_line.js)
  * you can specify a start and end position and it will visualize it as a line
- [`PP.VisualArrow`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/visual/visual_arrow.js)
  * you can specify a start and end position and it will visualize it as an arrow toward the end position
- [`PP.VisualPoint`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/visual/visual_point.js)
  * you can specify a position and it will display a point on it with a given radius
- [`PP.VisualMesh`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/visual/visual_mesh.js)
  * you can specify a mesh and a material and it will visualize it
- [`PP.VisualTransform`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/visual/visual_transform.js)
  * show the position, orientation and scale of a transform
- [`PP.VisualRaycast`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/visual/visual_raycast.js)
  * display the result of a raycast
- [`PP.VisualText`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/visual/visual_text.js)
  * displays a text on a specified position
- [`PP.VisualTorus`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/visual/visual_torus.js)
  * you can specify a radius, the number of segment and their thickness and it will visualize a torus with those params

#### Components

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/cauldron/visual/components)

List of components:
- [`pp-visual-manager`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/visual/components/visual_manager_component.js)
  * handy component that will create a visual manager and update it
  
#### How To

In this case an example is worth more than a billion words:
```js
let visualParams = new PP.VisualLineParams();
visualParams.myStart.vec3_copy([0,0,0]);
visualParams.myDirection.vec3_copy([0,0,1]);
visualParams.myLength = l;
visualParams.myMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
visualParams.myMaterial.color = [1, 1, 1, 1];
PP.myVisualManager.draw(visualParams, lifetimeSeconds);

or

let visualLine = new PP.VisualLine(visualParams);

```

In the example above two tecniques are shown: the first let the manager draw the line for the amount of seconds specified, the second one create the object and let you manage it yourself.
If the value of the `lifetimeSeconds` is set to 0 the visual will be drawn for onle 1 frame.

## Debug

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/debug)

A collection of classes and components to help with debugging, like showing in real time the position and orientation of an object.

List of features:
- [`PP.DebugManager`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/debug/debug_manager.js)
  * manages all the debug features
- [`PP.DebugVisualManager`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/debug/debug_manager.js)
  * a debug version of the visual manager, so that u can split between the normal visual and the debug ones
  * it also feature some quick draw methods not available with the `PP.VisualManager` to add debug objects even more easily

#### Components

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/debug/components)
  
List of components:
- [`pp-debug-manager`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/debug/components/debug_manager_component.js)
  * creates and updates a debug manager
- [`pp-debug-transform`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/debug/components/debug_transform_component.js)
  * a handy component to add the debug transform debug to an existing object in the scene  
  
### How To

You can add debug visuals exactly like you would do for the plain visual feature.  
In addition to that, you can also use a bunch of quick draw methods only avaiable in the debug feature, for example: 

```js
PP.myDebugVisualManager.drawLine(lifetimeSeconds, position, direction, length, color, thickness);
PP.myDebugVisualManager.drawArrow(lifetimeSeconds, position, direction, length, color, thickness);
PP.myDebugVisualManager.drawPoint(lifetimeSeconds, position, color, radius);
PP.myDebugVisualManager.drawRaycast(lifetimeSeconds, raycastResult, showOnlyFirstHit, hitNormalLength, thickness);
```

## Gameplay

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/gameplay)

A collection of gameplay features ready to be used.

### Cauldron

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/gameplay/cauldron)

List of features:
- [`PP.Direction2DTo3DConverter`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/gameplay/cauldron/direction_2D_to_3D_converter.js)
  * convert a 2D direction (like the ones from the gamepad stick) to a 3D direction based on a reference transform
  * takes care of making the 3D direction flat, for example to keep moving parallel to the ground
  * it also have an automatic and customizable way of detecting when the 3D direction should start to "fly", that is stop being flat
  
### Grab & Throw

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/gameplay/grab_throw)

Let you add a grab and throw mechanic in your game with little effort.
You can find an outdated example of the Grab & Throw [here](https://github.com/SignorPipo/wle_grab_throw).

List of features:
- [`pp-grabber-hand`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/gameplay/grab_throw/grabber_hand.js)
  * the component that let you grab other objects
  * it is made to work when added on the player hand, even though is not a must
  * this object must also have a `physx` component on itself, used to detect the grab
- [`pp-grabbable`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/gameplay/grab_throw/grabbable.js)
  * the component you have to add to the object you want to grab
  * this object must also have a `physx` component on itself, used to detect the grab and to simulate the throw

#### How To

The configuration is pretty straight forward:
1. Enable the `Physics` feature, that u can find under the `Project Settings`
1. Add the following components somewhere in your scene:
	- [`pp-gamepad-manager`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/gamepad/gamepad_manager_component.js)
	- [`pp-get-player-objects`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/cauldron/components/get_player_objects.js)
	- If you are using one of the [wle_ppefault](https://github.com/SignorPipo/wle_ppefault) default projects you will find these components already setup in the scene
3. Add a `pp-grabber-hand` component to one of the hands of the player
	  - Make sure the `handedness` parameter of the component matches the hand one
	  - The component can also be added to a child of the hand if you want the grab detection to have an offset from the hand position
4. Add a `physx` component on the same object
	  - The `physx` must be `kinematic` (if you select `trigger`, be sure to select `kinematic` first if it disappear, otherwise the object will fall)
	  - The `physx` should be set as `trigger` for the hand, otherwise it will push the objects that collide with it
5. Add a `pp-grabbable` component on the object you want to grab
	  - In this case, the component must be added on the object itself, it can't be a child
6. Add a `physx` component on the same object
	  - Be sure that the groups/block flags match the one u used for the hand

## Input

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/input)

A collection of classes and component to read inputs like head/hand transform or gamepad buttons.

### Cauldron

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/input/cauldron)

List of features:
- [`PP.Keyboard`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/cauldron/keyboard.js)
  * a class that makes it easier to access the keyboard state
  * let you check if a button is pressed or it's just been pressed/released
- [`PP.Mouse`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/cauldron/mouse.js)
  * a class that makes it easier to access the mouse state
  * let you check if a button is pressed or it's just been pressed/released or if the cursor is moving
  * you can get the position on the screen or in the 3D world, and also cast a PhysX ray from the mouse into the world  
- [`pp-finger-cursor`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/cauldron/finger_cursor.js)
  * u can use this component to add a cursor on the tip of the index finger that can interact with WLE `cursor-target`
- [`Input Types`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/cauldron/input_types.js)
  * a collection of enums used to specify the type of the input, like the handedness or if it is a gamepad or a hand
- [`PP.InputUtils`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/cauldron/input_utils.js)
  * a bunch of functions to work with inputs
- [`PP.InputManager`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/cauldron/input_manager.js)
  * a class that handle the creation and the update of the inputs like gamepad, mouse and keyboard
- [`pp-input-manager`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/cauldron/input_manager_component.js)
  * handy component that will create a input manager and update it
  * it creates some global variables like `PP.myMouse` or `PP.myGamepads` to easily access these devices
- [`pp-switch-hand-object`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/cauldron/switch_hand_object.js)
  * automatically switch between a given gamepad hand object and tracked hand object
- [`pp-tracked-hand-draw-all-joints`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/cauldron/tracked_hand_draw_all_joints.js)
  * given a mesh, it draws it on the specified tracked hand joint
- [`pp-tracked-hand-draw-joint`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/cauldron/tracked_hand_draw_joint.js)
  * given a mesh, it draws it on all the tracked hand joints
- [`pp-tracked-hand-draw-skin`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/cauldron/tracked_hand_draw_skin.js)
  * given a hand skin, it draws it on the tracked hand

### Gamepad

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/input/gamepad)

Everything u need to get inputs from a gamepad, and some utilities to animate a gamepad or get multiple buttons press.
You can find an outdated example of the Gamepad [here](https://github.com/SignorPipo/wle_gamepad).

List of features:
- [`PP.UniversalGamepad`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/gamepad/universal_gamepad.js)
  * a simple interface to retrieve buttons and axes state, get the gamepad transform and also make it pulse/vibrate
  * it works through gamepad cores, that specify how the buttons are activated (keyboard, mouse, gamepads)
  * example:
    ```js
    PP.myLeftGamepad.registerButtonEventListener(PP.GamepadButtonID.THUMBSTICK, PP.GamepadButtonEvent.PRESS_START, this, this._thumbstickPressStart.bind(this));        
    PP.myRightGamepad.getButtonInfo(PP.GamepadButtonID.TOP_BUTTON).isTouchEnd();    
    PP.myLeftGamepad.getButtonInfo(PP.GamepadButtonID.SQUEEZE).isPressStart(2); // fast pressed 2 times     
    PP.myGamepads[PP.Handedness.LEFT].getAxesInfo().getAxes();    
    PP.myRightGamepad.pulse(0.5, 1);    
    ```
- [`Gamepad Buttons`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/gamepad/gamepad_buttons.js)
  * here u can find the enums for the buttons and axes ids and events and the classes the contains the buttons and axes infos
- [`PP.GamepadCore`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/gamepad/gamepad_cores/gamepad_core.js)
  * the base class that u can inherit to create a custom gamepad core that u can then plug into the universal gamepad
- [`PP.XRGamepadCore`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/gamepad/gamepad_cores/xr_gamepad_core.js) / [`PP.KeyboardGamepadCore`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/gamepad/gamepad_cores/keyboard_gamepad_core.js)
  * a few gamepad cores that let you retrieve the buttons through the gamepads or the keyboard  
- [`PP.BaseGamepad`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/gamepad/base_gamepad.js)
  * the base class that u can inherit to create your own gamepad, so that u can specify how buttons activate and stuff
  * `PP.UniversalGamepad` inherits from this class
- [`PP.GamepadUtils`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/gamepad/cauldron/gamepad_utils.js)
  * a bunch of functions that work with the gamepad
  * let you check if multiple buttons are pressed at the same time, or if any button in a specified list is pressed
- [`PP.GamepadManager`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/gamepad/cauldron/gamepad_manager.js)
  * a class that handle the creation and the update of the gamepads
- [`pp-gamepad-manager`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/gamepad/cauldron/gamepad_manager_component.js)
  * handy component that will create a gamepad manager and update it
  * it adds by default a few gamepad cores like the `PP.XRGamepadCore` and the `PP.KeyboardGamepadCore`
  * it will create a global `PP.myLeftGamepad` and a global `PP.myRightGamepad`
  * it will also create a global `PP.myGamepads` that contains both gamepads and use `PP.Handedness` as index
- [`pp-gamepad-mesh-animator`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/gamepad/cauldron/gamepad_mesh_animator.js)
  * component that let you animate a gamepad, that is buttons and axes move in the game like the one in real life
  * to make this work you have to use a gamepad model where buttons and axes have a proper positioned pivot
    * you can use [this 3D model](https://github.com/SignorPipo/wle_assets/tree/main/wle_assets/assets/models/gamepads/meta_quest_2/classic/high_res) as a reference
- [`pp-gamepad-control-scheme`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/gamepad/cauldron/gamepad_control_scheme.js)
  * component that let you add a visual control scheme on the gamepad
  * to make this work you have to use a gamepad model where buttons and axes have a proper positioned pivot
    * you can use [this 3D model](https://github.com/SignorPipo/wle_assets/tree/main/wle_assets/assets/models/gamepads/meta_quest_2/classic/high_res) as a reference
	
#### Virtual Gamepad

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/input/gamepad/virtual_gamepad)

A virtual gamepad that let u use the gamepad on mobile devices.

List of features:
- [`pp-virtual-gamepad`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/gamepad/virtual_gamepad/virtual_gamepad_component.js)
  * add a virtual gamepad interface on top of the screen
  * allow for a bit of customization of the interface, like specifying the colors, the buttons that should be visible, what kind of icon you want on every button and so on
  * it also add a `PP.VirtualGamepadGamepadCore` to the `PP.UniversalGamepad` so that it automatically works with that
- [`PP.VirtualGamepad`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/gamepad/virtual_gamepad/virtual_gamepad.js)
  * the actual virtual gamepad, you may want to use directly this class instead of the built in component if you want to specify a custom set of parameters to build the interface

### Pose

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/input/pose)

List of features:
- [`PP.HeadPose`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/pose/head_pose.js) / [`PP.HandPose`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/pose/hand_pose.js)
  * two classes that let you retrieve the pose of the head/hand, that is their transform and their linear and angular velocities
- [`PP.TrackedHandJointPose`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/pose/tracked_hand_joint_pose.js)
  * let you retrieve the pose of the specified tracked hand joint, that is its transform and its linear and angular velocities
- [`PP.TrackedHandPose`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/pose/tracked_hand_pose.js)
  * let you retrieve the pose of the specified tracked hand joints, that is their transform and their linear and angular velocities
  * it is like having multiple `PP.TrackedHandJointPose` but without the need to update them all yourself

#### Components

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/input/pose/components)
  
List of components:
- [`pp-set-player-height`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/pose/components/set_player_height.js)
  * used on the pivot of the player let you specify its height, when the feature `local-floor` is disabled or not supported
  * the component does nothing if `local-floor` is enabled and supported
  * this let you fallback on a default height if not supported or when testing
- [`pp-set-head-local-transform`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/pose/components/set_head_local_transform.js) / [`pp-set-vr-head-local-transform`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/pose/components/set_vr_head_local_transform.js) / [`pp-set-non-vr-head-local-transform`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/pose/components/set_non_vr_head_local_transform.js) / [`pp-set-hand-local-transform`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/pose/components/set_hand_local_transform.js)
  * components that set the local transform of their object to the one of the head/hand, relative to the real space (reference space)
  * fix forward can be used to make it so that the head/hand has the forward in the direction they look at since WebXR by default make it so the forward is in the opposite direction
- [`pp-set-tracked-hand-joint-local-transform`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/pose/components/set_tracked_hand_joint_local_transform.js)
  * component that sets the local transform of their object to the one of the specified tracked hand joint
- [`pp-copy-head-transform`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/pose/components/copy_head_transform.js) / [`pp-copy-hand-transform`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/pose/components/copy_hand_transform.js) / [`pp-copy-player-transform`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/pose/components/copy_player_transform.js) / [`pp-copy-player-pivot-transform`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/input/pose/components/copy_player_pivot_transform.js)
  * components that set the world transform of its object to the one of the head/hand
  * it needs a head/hand to be already setup in the scene

## Plugin

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/plugin)

A set of features that extends what WLE and Javascript already offer.

### Component Mods

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/plugin/component_mods)

These files change some of the functions of WLE components, or add to them new ones:
- [`clone_component_mod.js`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/plugin/component_mods/clone_component_mod.js)
  * adds a clone function to some built int component like mesh, text and collision
- [`cursor_component_mod.js`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/plugin/component_mods/cursor_component_mod.js) / [`cursor_target_component_mod.js`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/plugin/component_mods/cursor_target_component_mod.js)
  * adds double and triple click
  * bunch of fixes
- [`mouse_look_component_mod.js`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/plugin/component_mods/mouse_look_component_mod.js)
  * adds support for gamepad as a pointer to move the view
  * improves how the view is rotated based on the pointer movement

### Extensions

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/plugin/extensions)

The extensions add new functions to already existing features:
- [`object_extension.js`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/plugin/extensions/object_extension.js)
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
    this.object.pp_rotateAxis(angle, axis);
    this.object.pp_convertPositionObjectToWorld(position, outPosition);
    this.object.pp_getComponentHierarchy(type, index);   
    ```
- [`scene_extension.js`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/plugin/extensions/scene_extension.js)
  * adds some handy functions to the WL.scene object
  * all the extensions methods start with `pp_`
  * ranges from getting the scene root, to getting an object in the entire scene by name, or looking for a component in the entire scene
  * at the start of the file you can find a comment section explaining all the features in more details
  * example:
    ```js
    WL.scene.pp_getRoot();
    WL.scene.pp_getComponent("mesh");
    WL.scene.pp_getObjectByName("name");
    ```
- [`math_extension.js`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/plugin/extensions/math_extension.js)
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
- [`array_extension.js`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/plugin/extensions/array_extension.js)
  * adds some handy functions to the javascript Array/Float32Array/Int32Array/... libraries
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

## Tool

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/tool)

A set of tools that can help while developing and debugging.
### Cauldron

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/tool/cauldron)

List of features:
- [`pp-tool-cursor`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/tool/cauldron/components/tool_cursor.js)
  * component needed to interact with the tools
  * it also work with hand tracking, by adding a cursor on the index finger tip
  * just place it on one of the hands to use it

### Console VR

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/tool/console_vr)

Let u see the browser console from withing the vr session, making it easier to debug.

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

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/tool/easy_tune)

A set of tools and widgets to make it easier to tune/adjust the values in your game, and also add some "toggable" debug stuff.  
The main idea is that you have some values in the code that you would like to adjust at runtime, and this let you do exactly that.  
For this same reason, you can have some flags that enable some debug/test features, and you can change the flags values at runtime through this.

#### Easy Tune

[Code File Link](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/tool/easy_tune/easy_tune.js)

The main tool of this feature.  
Let you visualize and edit the EasyTuneVariables you have created, that can be used in the code while also edited at runtime through this tool. 
You can also import and export the variables at runtime, so that you can easily save and load your changes without having to edit the variables in the code every time.

There is no need to understand the details of this since it's meant to be used.  
You can find an outdated example of the Easy Tune [here](https://github.com/SignorPipo/wle_easytune).

##### How To

You have to add a `pp-easy-tune` component to the scene, usually on the hand since it will let you keep it with you.  
You can find some flags to customize it on the component.   

You can hide/show it by pressing both the right top and bottom buttons (`B`/`Y` + `A`/`X` on the meta quest gamepad).  
If you click on the `P` button on the bottom left u can pin the easy tune so that it will stay in place.

#### Easy Tune Variables

[Code File Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/tool/easy_tune/easy_tune_variables.js)

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

Easy Tune Variables examples:
```js
/* Number */        PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Float", 1.00, 0.01, 3));
/* Number Array */  PP.myEasyTuneVariables.add(new PP.EasyTuneNumberArray("Float Array", [1.00,2.00,3.00], 0.01, 3));
/* Int */           PP.myEasyTuneVariables.add(new PP.EasyTuneInt("Int", 1, 1));
/* Int Array */     PP.myEasyTuneVariables.add(new PP.EasyTuneIntArray("Int Array", [1,2,3], 1));
/* Bool */          PP.myEasyTuneVariables.add(new PP.EasyTuneBool("Bool", false));
/* Bool Array */    PP.myEasyTuneVariables.add(new PP.EasyTuneBoolArray("Bool Array", [false, true, false]));
/* Transform */     PP.myEasyTuneVariables.add(new PP.EasyTuneTransform("Transform", PP.mat4_create(), true));
```

#### Easy Object Tuners

[Code Folder Link](https://github.com/SignorPipo/wle_pp/tree/main/wle_pp/wle_pp/js/pp/tool/easy_tune/easy_object_tuners)

A set of components that makes it even easier to use the easy tune.
You just have to add the component on the object you want to tune, the variable will be created for you and the component will update the corrispondent value of the object automatically.

List of components:
- [`pp-easy-scale`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/tool/easy_tune/easy_object_tuners/easy_scale.js) / [`pp-easy-transform`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/tool/easy_tune/easy_object_tuners/easy_transform.js)
  * add a variable to adjust the scale/transform of the object
- [`pp-easy-text-color`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/tool/easy_tune/easy_object_tuners/easy_text_color.js) / [`pp-easy-mesh-color`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/tool/easy_tune/easy_object_tuners/easy_mesh_color.js)
  * add a variable to adjust the color of the first text/mesh material of the object
- [`pp-easy-light-color`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/tool/easy_tune/easy_object_tuners/easy_light_color.js) / [`pp-easy-light-attenuation`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/tool/easy_tune/easy_object_tuners/easy_light_attenuation.js)
  * add a variable to adjust the color/attenuation of the first light on the object

These components have a flag called `UseTuneTarget`, if this is enabled the variable will not update the current object, but the one specified by the current tune target.
The tune target can be changed by code by setting the object in the `PP.myEasyTuneTarget` variable, but there are also some handy components that can set it at runtime:
- [`pp-easy-set-tune-target-grab`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/tool/easy_tune/easy_object_tuners/easy_set_tune_target_grab.js)
  * if u add this component on the same object that has a grabber component on it, every object that is grabbed and then released will be the current tune target
  * this means that the object you want to tune must be a grabbable
- [`pp-easy-set-tune-target-child-number`](https://github.com/SignorPipo/wle_pp/blob/main/wle_pp/wle_pp/js/pp/tool/easy_tune/easy_object_tuners/easy_set_tune_target_child_number.js)
  * this will create an easy tune variable that will set as a tune target one of the children of the object on which this component is added to
  * the number is used as an index on the children list
  * 0 means no child is selected