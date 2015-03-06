// ====================== MISSION CONTROL ======================
// The player assumes the role of lead scientist of the International Space Agency.
// Their goal is to complete a series of experiments and missions of increasing difficulty;
// from launching probes to firing missiles to intercept meteors on a collision course with Earth.
// This game is intended to be used with the Mission Control Desk.
// Details for this project and game documentation can be found online at aaronfarr.com.
//
// Created by: Aaron Farr
// Created for: Ronan Farr
//
// Website: http://aaronfarr.com
// Repository: https://github.com/aaronfarr/mission-control
//
// The MIT License (MIT)
// Copyright (c) 2015 Aaron Farr
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
// v.1.0.0 - 3/6/2015 Basic space simulator

// =-=-=-=-=-=-=-=-=-=-=- Mission Control -=-=-=-=-=-=-=-=-=-=-=
// The main class which controls the game state.
MissionControl = {};

// =-=-=-=-=-=-=-=-=-=-=- Initialization -=-=-=-=-=-=-=-=-=-=-=
//
MissionControl.initialize = function() {

    // ---------------------- Globals ----------------------
    MissionControl.G = 0.0000000000667384; // N m^2 kg^-2 Gravitational Constant
    MissionControl.canvas_main;
    MissionControl.canvas_overview;
    MissionControl.canvas_target;
    MissionControl.camera_main;
    MissionControl.camera_overview;
    MissionControl.camera_target;
    MissionControl.objects = [];

    // ---------------------- Camera Setup ----------------------
    MissionControl.camera_main     = new Camera( 0, 0, 20000000000, 15000000000 );
    MissionControl.camera_overview = new Camera( 0, 0, 16000000000, 12000000000 );
    MissionControl.camera_target   = new Camera( 0, 0, 800000000, 600000000 );;

    // ---------------------- Canvas Setup ----------------------
    // Initializes each canvas and associates a camera to it.
    MissionControl.canvas_main     = new Canvas( "main", 800, 600, MissionControl.camera_main );
    MissionControl.canvas_overview = new Canvas( "overview", 640, 480, MissionControl.camera_overview );
    MissionControl.canvas_target   = new Canvas( "target", 800, 600, MissionControl.camera_target );

    // ---------------------- Planetary Setup ----------------------
    // Distances have been reduced by a factor if 1000 (from m to km) in order to increase simulation speed at the cost of accuracy.
    MissionControl.objects[0] = new Object( 'Sun',                       0, 0, 0, 0, 0, 0, 1989000000000000000000000000000,   1.14, 695000, 'f9b81e' );
    MissionControl.objects[1] = new Object( 'Mercury',           -57910000, 0, 0, 0, 0, 0,        330000000000000000000000,   5.43,   2439, 'a10000' );
    MissionControl.objects[2] = new Object( 'Venus',            -108200000, 0, 0, 0, 0, 0,       4870000000000000000000000,   5.24,   6052, 'a18500' );
    MissionControl.objects[3] = new Object( 'Earth',            -149600000, 0, 0, 0, 0, 0,       5970000000000000000000000,   5.52,   6378, '4dc644' );
    MissionControl.objects[4] = new Object( 'Mars',             -227940000, 0, 0, 0, 0, 0,        642000000000000000000000,   3.93,   3397, 'c82626' );
    MissionControl.objects[5] = new Object( 'Jupiter',          -778330000, 0, 0, 0, 0, 0,    1900000000000000000000000000,   1.33,  71492, 'a58264' );
    MissionControl.objects[6] = new Object( 'Saturn',          -1429400000, 0, 0, 0, 0, 0,     568000000000000000000000000,   0.69,  60268, 'dfbb97' );
    MissionControl.objects[7] = new Object( 'Uranus',          -2870990000, 0, 0, 0, 0, 0,      86830000000000000000000000,   1.32,  25559, 'a9d6f5' );
    MissionControl.objects[8] = new Object( 'Neptune',         -4504000000, 0, 0, 0, 0, 0,     102470000000000000000000000,   1.64,  24766, '4e6c9e' );
    MissionControl.objects[9] = new Object( 'Moon',    -149600000 - 384403, 0, 0, 0, 0, 0,         73477000000000000000000, 3.3464,   1737, 'a3a3a3' );

    // ---------------------- Initialize Orbits ----------------------
    // Sets the velocities of the planetary objects have a circular orbit around the Sun.
    MissionControl.orbit(  1, 0 );
    MissionControl.orbit(  2, 0 );
    MissionControl.orbit(  3, 0 );
    MissionControl.orbit(  4, 0 );
    MissionControl.orbit(  5, 0 );
    MissionControl.orbit(  6, 0 );
    MissionControl.orbit(  7, 0 );
    MissionControl.orbit(  8, 0 );
    MissionControl.orbit( 9, 3 ); // Moon orbiting Earth

    // ---------------------- Begin Updating ----------------------
    // The initial state has been created so we are ready to update.
    MissionControl.update();

}

// =-=-=-=-=-=-=-=-=-=-=- Update -=-=-=-=-=-=-=-=-=-=-=
// Updates the current state of the game. Called once per frame.
MissionControl.update = function() {

    // ---------------------- Main Screen ----------------------
    // Draws all of the planetary objects to the main canvas without a refresh.
    if( MissionControl.clear ) MissionControl.canvas_main.clearScreen();
    MissionControl.canvas_main.drawObjects( MissionControl.objects );

    // ---------------------- Mini Map ----------------------
    // Creates a fixed overview of all planetary objects to allow for
    // easy navigation and control of the main screen.
    // Draws a bounding rectangle around the area the main screen is viewing.
    if( MissionControl.clear ) MissionControl.canvas_overview.clearScreen();
    MissionControl.canvas_overview.drawCamera( MissionControl.camera_main );
    MissionControl.canvas_overview.drawObjects( MissionControl.objects );

    // ---------------------- Target Screen ----------------------
    // The position of the camera is fixed to the centre of an object.
    // Provides a close up view of the target.
    if( MissionControl.clear ) MissionControl.canvas_target.clearScreen();
    MissionControl.camera_target.focus = MissionControl.objects[3].position;
    MissionControl.canvas_target.drawObjects( MissionControl.objects );

    // ---------------------- Calculate Position ----------------------
    // To calculate the new position on this update we must calculate the
    // sum all forces to determine acceleration delta (in this case only gravity),
    // the effect of acceleration on the velocity of the object, and the effect
    // of velocity on the position of the object.
    MissionControl.gravity();
    MissionControl.velocity();
    MissionControl.position();

    // ----------------------
    // Required to create an update loop. In most browsers this will be on every animation frame.
    // Without this callback the function would only be called once.
    window.requestAnimFrame( MissionControl.update );
}

// =-=-=-=-=-=-=-=-=-=-=- Orbital Velocity -=-=-=-=-=-=-=-=-=-=-=
// Calculates the velocity required for object A to have a circular orbit around object B.
// Sets the velocity of object A to that calculated velocity.
// Uses the formula: v = Math.sqrt( ( G * ( M + m ) ) / r );
MissionControl.orbit = function( orbiter, orbiting ) {
    d = Math.abs( MissionControl.objects[ orbiter ].position.x - MissionControl.objects[ orbiting ].position.x );
    MissionControl.objects[ orbiter ].velocity.y = Math.sqrt( ( MissionControl.G * ( MissionControl.objects[ orbiter ].mass + MissionControl.objects[ orbiting ].mass ) ) / d );
    MissionControl.objects[ orbiter ].velocity.y += MissionControl.objects[ orbiting ].velocity.y
}

// =-=-=-=-=-=-=-=-=-=-=- Gravity -=-=-=-=-=-=-=-=-=-=-=
// Calculates the gravitational forces between objects and applies its net effect to the
// acceleration of each object.
MissionControl.gravity = function() {

    // ---------------------- Loop All Planetary Objects ----------------------
    // The gravitational force is universal. Every object with mass effects the fabric of space-time.
    // You are exerting a force on the Sun as you are reading this line. The effect is small but can be calculated.
    // The acceleration of an object is determined by the sum of all forces on it. So for each object
    // we must add up the vectors for each force. In this case we are calculating gravity.
    for( var i = 0; i < MissionControl.objects.length; i++ ) {

        // For each time step we assume the object is not accelerating. We recalculate the acceleration
        // with each time step.
        MissionControl.objects[i].acceleration.x = 0;
        MissionControl.objects[i].acceleration.y = 0;

        // Since every object with mass exerts a gravitational force on every other object
        // we must loop through each object to calculate its effect.
        for( var ii = 0; ii < MissionControl.objects.length; ii++ ) {

            // Fixed body objects are not affected by their own gravity so we can ignore this case.
            if( i != ii ) {

                // The gravitational force is inversely proportional to distance. So we calculate the
                // distance between the two objects.
                deltaX = MissionControl.objects[ii].position.x - MissionControl.objects[i].position.x;
                deltaY = MissionControl.objects[ii].position.y - MissionControl.objects[i].position.y;
                d = Math.sqrt( Math.pow( deltaX, 2 ) + Math.pow( deltaY, 2 ) );

                // Since we know the distance, masses, and gravitational constant we can calculate the
                // magnitude of the force.
                F = MissionControl.G * ( ( MissionControl.objects[ii].mass * MissionControl.objects[i].mass ) / Math.pow( d, 2 ) );

                // Thanks to Isaac Newton we can convert this force into acceleration with the formula F = m*a.
                a = F / MissionControl.objects[i].mass;

                // The acceleration we have represents a magnitude. We need to convert this to a vector
                // so that it can be applied to our object. We use the Similar Triangle principle to find
                // a ratio. We are relating acceleration to distance.
                ratio = a / d;

                // We then normalize the delta values we needed to calculate the distance to get the
                // individual x and y acceleration values.
                aX = deltaX * ratio;
                aY = deltaY * ratio;

                // The last step is to add each acceleration to our object. Objects will pull each other
                // in all different directions but this sum represents the net effect.
                MissionControl.objects[i].acceleration.x = MissionControl.objects[i].acceleration.x + aX;
                MissionControl.objects[i].acceleration.y = MissionControl.objects[i].acceleration.y + aY;

            }
        }
    }

}

// =-=-=-=-=-=-=-=-=-=-=- Velocity -=-=-=-=-=-=-=-=-=-=-=
// Calculates and sets the effect of acceleration on the velocity of each object.
MissionControl.velocity = function() {
    for( var i = 0; i < MissionControl.objects.length; i++ ) {
        MissionControl.objects[i].velocity.x = MissionControl.objects[i].velocity.x + MissionControl.objects[i].acceleration.x;
        MissionControl.objects[i].velocity.y = MissionControl.objects[i].velocity.y + MissionControl.objects[i].acceleration.y;
    }
}

// =-=-=-=-=-=-=-=-=-=-=- Position -=-=-=-=-=-=-=-=-=-=-=
// Calculates and sets the effect of velocity on the position of each object.
MissionControl.position = function() {
    for( var i = 0; i < MissionControl.objects.length; i++ ) {
        MissionControl.objects[i].position.x = MissionControl.objects[i].position.x + MissionControl.objects[i].velocity.x;
        MissionControl.objects[i].position.y = MissionControl.objects[i].position.y + MissionControl.objects[i].velocity.y;
    }
}

// =-=-=-=-=-=-=-=-=-=-=- Animation Frame -=-=-=-=-=-=-=-=-=-=-=
// Attempts to request the next animation frame from the browser.
// If this feature is not available it creates a timer set to 60 fps.
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout( callback, 1000 / 60 );
    };
})();

// =-=-=-=-=-=-=-=-=-=-=- Loaded -=-=-=-=-=-=-=-=-=-=-=
// This is where it all begins. We instantiate the MissionControl class.
window.onload = MissionControl.initialize();

// =-=-=-=-=-=-=-=-=-=-=- Input -=-=-=-=-=-=-=-=-=-=-=
// Processes user key strokes captured by the keypress event listener.
window.addEventListener("keypress", function(e) {

    // ---------------------- Pan Camera Up ----------------------
    // Captures the W key to pan the main camera up by 10%.
    if(e.keyCode == 119 ) { // W
        MissionControl.camera_main.focus.y = MissionControl.camera_main.focus.y - MissionControl.camera_main.fov.x * 0.1;
    }

    // ---------------------- Pan Camera Left ----------------------
    // Captures the A key to pan the main camera to the left by 10%.
    if(e.keyCode == 97 ) { // A
        MissionControl.camera_main.focus.x = MissionControl.camera_main.focus.x - MissionControl.camera_main.fov.x * 0.1;
    }

    // ---------------------- Pan Camera Down ----------------------
    // Captures the S key to pan the main camera down by 10%.
    if(e.keyCode == 115 ) { // S
        MissionControl.camera_main.focus.y = MissionControl.camera_main.focus.y + MissionControl.camera_main.fov.x * 0.1;
    }

    // ---------------------- Pan Camera Right ----------------------
    // Captures the D key to pan the main camera to the right by 10%.
    if(e.keyCode == 100 ) { // D
        MissionControl.camera_main.focus.x = MissionControl.camera_main.focus.x + MissionControl.camera_main.fov.x * 0.1;
    }

    // ---------------------- Zoom Camera Out ----------------------
    // Captures the Z key to zoom the camera out by 10%.
    if(e.keyCode == 122 ) { // Z
        MissionControl.camera_main.fov.x = MissionControl.camera_main.fov.x * 1.1;
        MissionControl.camera_main.fov.y = MissionControl.camera_main.fov.y * 1.1;
    }

    // ---------------------- Zoom Camera In ----------------------
    // Captures the C key to zoom the camera in by 10%.
    if(e.keyCode == 99 ) { // C
        MissionControl.camera_main.fov.x = MissionControl.camera_main.fov.x * 0.9;
        MissionControl.camera_main.fov.y = MissionControl.camera_main.fov.y * 0.9;
    }

    // ---------------------- Clear Screen Toggle ----------------------
    // Captures the X key to toggle screen clearing between frames.
    if(e.keyCode == 120 ) { // X
        if( MissionControl.clear ) {
            MissionControl.clear = false;
        } else {
            MissionControl.clear = true;
        }
    }

});
