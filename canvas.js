// =-=-=-=-=-=-=-=-=-=-=- Canvas -=-=-=-=-=-=-=-=-=-=-=
var Canvas = function( id, w, h, c ) {
    this.canvas = document.getElementById(id);
    this.context = this.canvas.getContext("2d");
    this.camera = c;
    this.context.canvas.width = w;
    this.context.canvas.height = h;

}

Canvas.prototype.drawObjects = function( objects ) {
    for( var i = 0; i < objects.length; i++ ) {
        this.drawObject( objects[i] );
    }
}

Canvas.prototype.drawObject = function( object ) {

    var screen = this.cartesianToScreen( object.position, this.camera, this.context );
    var r = object.radius * ( this.context.canvas.width / this.camera.fov.x );

    this.context.beginPath();
    if( r < 10 ) {
        this.context.setLineDash( [3] );
        this.context.lineWidth = 1;
        this.context.arc( screen.x, screen.y, 10, 0, 2 * Math.PI, false);
    } else {
        this.context.setLineDash( [0] );
        this.context.arc( screen.x, screen.y, r, 0, 2 * Math.PI, false);
        this.context.fillStyle = this.luminance( object.colour, 0.2 );
        this.context.fill();
        this.context.lineWidth = 5;
    }
    this.context.strokeStyle = '#' + object.colour;
    this.context.stroke();

}

Canvas.prototype.drawCamera = function( camera ) {

    top_left = this.cartesianToScreen( new Vector( camera.focus.x - ( camera.fov.x / 2 ) , camera.focus.y + ( camera.fov.y / 2 ) ), this.camera, this.context );
    //this.context.beginPath();
    //this.context.setLineDash( [3] );
    //this.context.lineWidth = 5;
    //this.context.arc( top_left.x, top_left.y, 20, 0, 2 * Math.PI, false);
    //this.context.strokeStyle = '#ff00ff';
    //this.context.stroke();

    //top_right = this.cartesianToScreen( new Vector( camera.focus.x + ( camera.fov.x / 2 ) , camera.focus.y + ( camera.fov.y / 2 ) ), this.camera, this.context );
    //this.context.beginPath();
    //this.context.setLineDash( [3] );
    //this.context.lineWidth = 5;
    //this.context.arc( top_right.x, top_right.y, 20, 0, 2 * Math.PI, false);
    //this.context.strokeStyle = '#ff0000';
    //this.context.stroke();

    //bottom_left = this.cartesianToScreen( new Vector( camera.focus.x - ( camera.fov.x / 2 ) , camera.focus.y - ( camera.fov.y / 2 ) ), this.camera, this.context );
    //this.context.beginPath();
    //this.context.setLineDash( [3] );
    //this.context.lineWidth = 5;
    //this.context.arc( bottom_left.x, bottom_left.y, 20, 0, 2 * Math.PI, false);
    //this.context.strokeStyle = '#ffff0';
    //this.context.stroke();

    bottom_right = this.cartesianToScreen( new Vector( camera.focus.x + ( camera.fov.x / 2 ) , camera.focus.y - ( camera.fov.y / 2 ) ), this.camera, this.context );
    //this.context.beginPath();
    //this.context.setLineDash( [3] );
    //this.context.lineWidth = 5;
    //this.context.arc( bottom_right.x, bottom_right.y, 20, 0, 2 * Math.PI, false);
    //this.context.strokeStyle = '#ff00ff';
    //this.context.stroke();

    this.context.beginPath();
    this.context.setLineDash( [0] );
    this.context.rect( top_left.x, top_left.y, bottom_right.x - top_left.x, bottom_right.y - top_left.y );
    this.context.lineWidth = 1;
    this.context.strokeStyle = '#ff00ff';
    this.context.stroke();

}

Canvas.prototype.cartesianToScreen = function( point, camera, context ) {

    // Cartesian Point to Camera Space (0,0 centre)
    cx = point.x - camera.focus.x;
    cy = point.y - camera.focus.y;

    // Camera Space (0,0 centre) to Camera Space (0,0 top left)
    //cx = cx + ( camera.fov.x / 2 );
    //cy = Math.abs( cy - ( camera.fov.y / 2 ) );

    // Scale to Screen
    scaleX = context.canvas.width / camera.fov.x;
    scaleY = context.canvas.height / camera.fov.y;
    cx = cx * scaleX;
    cy = cy * scaleY;

    // Screen Centre (0,0) to Screen Top-Left (0,0)
    cx = cx + context.canvas.width  / 2;
    cy = cy + context.canvas.height / 2 ;

    return new Vector( cx, cy );

}

Canvas.prototype.luminance = function( hex, lum ) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i*2,2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00"+c).substr(c.length);
    }

    return rgb;
}

Canvas.prototype.clearScreen = function() {
    this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
}