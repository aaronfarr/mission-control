// =-=-=-=-=-=-=-=-=-=-=- Camera -=-=-=-=-=-=-=-=-=-=-=
// Basic structure for the camera object.
var Camera = function( fx, fy, width, height ) {
    this.focus = new Vector( fx, fy );
    this.fov = new Vector( width, height );
}