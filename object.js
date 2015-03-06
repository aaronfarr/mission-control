// =-=-=-=-=-=-=-=-=-=-=- Object -=-=-=-=-=-=-=-=-=-=-=
// Simple structure to store an object.
var Object = function( n, px, py, vx, vy, ax, ay, m, d, r, c ) {
    this.name = n;
    this.position = new Vector( px, py );
    this.velocity = new Vector( vx, vy );
    this.acceleration = new Vector( ax, ay );
    this.mass = m;
    this.density = d;
    this.radius = r;
    this.colour = c;
};