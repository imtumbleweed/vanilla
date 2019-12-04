// Mouse v. 12-04-2019
export class Mouse {
    constructor()  {
        this.current = {x: 0, y: 0};    // current mouse position on the screen, regardless of state
        this.memory = {x: 0, y: 0};     // memorized mouse position (for measuring dragging distance)
        this.difference = {x: 0, y: 0}; // difference between last click and current mouse position
        this.velocity = {x: 0, y: 0, vx: 0, vy: 0};   // same as above, except not reset after dragging stops
        this.inverse = {x: 0, y: 0};    // swapped
        this.dragging = false;
        this.trackVelocity = false;
        this.timer = null;
        this.disabled = false;
        // Mouse was pressed
        document.body.addEventListener("mousedown", (e) => {

            if (this.disabled)
                return;

            if (this.dragging == false) {
                this.dragging = true;
                this.memory.x = this.current.x;
                this.memory.y = this.current.y;
                this.inverse.x = this.memory.x;
                this.inverse.y = this.memory.y;
                this.startTrackingVelocity();
            }
        });
        // Mouse was released
        document.body.addEventListener("mouseup", (e) => {

            if (this.disabled)
                return;

            this.dragging = false;
            this.current.x = 0;
            this.current.y = 0;
            this.memory.x = 0;
            this.memory.y = 0;
            // this.difference.x = 0; // shouldn't reset them, get box() because builds css style from them
            // this.difference.y = 0;
            // this.inverse.x = 0;
            // this.inverse.y = 0;
            this.stopTrackingVelocity();
        });
        // Mouse is moving
        document.body.addEventListener("mousemove", (e) => {

            if (this.disabled)
                return;

            this.current.x = e.pageX;
            this.current.y = e.pageY;
            this.velocity.x = (this.velocity.x + Math.abs(this.difference.x)) / 2;
            this.velocity.y = (this.velocity.y + Math.abs(this.difference.y)) / 2;
            if (this.dragging) {
                this.difference.x = this.current.x - this.memory.x;
                this.difference.y = this.current.y - this.memory.y;
                if (this.current.x < this.memory.x) this.inverse.x = this.current.x;
                if (this.current.y < this.memory.y) this.inverse.y = this.current.y;
            }
        });
    }
    // calculate area created by click-and-dragging mouse as a css style
    get box() {
        // create style from inverse x/y
        this.style = { left: this.inverse.x + "px", top: this.inverse.y + "px" };
        // adjust width if horizontal difference is negative
        this.difference.x < 0 ? this.style.width = -this.difference.x + "px" : this.style.width = this.difference.x + "px";
        // adjust height if vertical difference is negative
        this.difference.y < 0 ? this.style.height = -this.difference.y + "px" : this.style.height = this.difference.y + "px";
        // return style object
        return this.style;
    }
    startTrackingVelocity() {
        this.trackVelocity = true;
        if (this.timer == null) {
            this.timer = setInterval(() => {
                let oldx = this.velocity.x;
                // this.velocity.x = this.current.x;
                // this.velocity.xv = (this.velocity.x - oldx) * 0.1;
            }, 35); // 35 is an ideal value, tried others doesn't work so well.
        }
    }
    stopTrackingVelocity() {
        if (this.timer != null) {
            // this.velocity = {x: 0, y: 0, vx: 0, vy: 0};
            clearInterval( this.timer );
            this.timer = null;
        }
        this.trackVelocity = false;
    }
};