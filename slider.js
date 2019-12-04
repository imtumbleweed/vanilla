import { create } from "./element.js";

export let HORIZONTAL = 0;
export let VERTICAL = 1;

export class Slider {

  constructor(view, mouse, target, specimen_id, id, name, array_xy_pos, direction,   width, height,     min, max, now,   show_value, show_name) {

    // root
    let root = document.getElementById("root");

    // id
    this.id = id;

    // the view
    this.view = view;

    // grab globally available mouse object
    this.mouse = mouse;

    // get element object of the container it will be embedded into
    this.container = document.getElementById( target );

    // store a reference to the object the values on this slider control will modify
    this.specimen = null;

    // The gradient preview in the main dashboard
    this.specimen_corners = null; // document.getElementById( "specimen_corners" );

    this.direction = direction;

    // width of the box where numeric value of this
    // slider is displayed (to the right of actual slider)
    // *not used if "show_value" argument is false or null
    this.value_width = 30;

    // Slider can be horizontal or vertical, horizontal is default, but flip axis if its vertical
    if (this.direction == VERTICAL) { let save = width; width = height; height = save; }

    this.width = width;
    this.height = height;
    this.min = 0;
    this.max = 100;
    this.now = now;
    this.background = { color : "#888" };

    if (this.direction == HORIZONTAL)
        this.scrubber = { x : 0, y : 0, width : 25, height: this.height, color : "silver" };

    if (this.direction == VERTICAL)
        this.scrubber = { x : 0, y : 0, height : 25, width: this.width, color : "silver" };

    this.canDrag = false;
    this.isDragging = false;
    this.memory = { x : 0, y : 0};
    this.name = name;

    this.val = null;

    // Main slider area
    // this.div = document.createElement("div");

    let x = array_xy_pos == null ? 0 : array_xy_pos[0];
    let y = array_xy_pos == null ? 0 : array_xy_pos[1];

    const { xx, yy } = [...array_xy_pos];

    let style = { left: array_xy_pos[0] + "px",
                  top: array_xy_pos[1] + "px",
                  width: this.width + "px",
                  height: this.height + "px", position: "absolute", display: "block"  };

                 // console.log(style)

    // Create slider container
    this.div = create(root, "div", "slider", style);

    this.div.style.marginTop = "8px";

    // if position is not provided, make this element "relative" (position works only with "absolute" display location)
    if (array_xy_pos == null) this.div.style.position = "relative";
    this.div.setAttribute("class", "noselect scrubber");
    this.div.style.background = this.background.color;
    this.div.style.color = "gray";

    if (show_name) // Print name of this control inside it
        this.div.innerHTML = "<div style = 'line-height: 100%; color: #0eb279; padding-left: 28px; width: 100%; display: inline-block; text-align: left;'>" + name + "</div>";

    // Determine color and font of the name displayed inside the element
    this.div.style.fontFamily = "Arial";
    this.div.style.fontSize = "14px";
    this.div.style.color = "white";
    // Match line height to the height of the element
    this.div.style.lineHeight = this.height + "px";
    // Add overflow hidden
    // this.div.style.overflow = "hidden";

    let style1 = { left     : this.scrubber.x + "px",
                   top      : this.scrubber.y + "px",
                   width    : this.scrubber.width + "px",
                   height   : this.scrubber.height + "px",
                   position : "absolute",
                   display  : "block" };

    // Create the draggable knob
    this.knob =  create(root, "div", id + "_knob", style1);

    this.knob.setAttribute("class", "scrubber-knob");
    this.knob.style.background = this.scrubber.color;
    this.knob.style.cursor = "hand";

    // Create value display <div> (if enabled)
    if (show_value) {

        let style2 = { left     : (width - this.scrubber.width) + "px",
                       top      : (-this.scrubber.height) + "px",
                       width    : this.scrubber.width + "px",
                       height   : this.scrubber.height + "px",
                       position : "absolute",
                       display  : "block",
                       backgroundColor : "transparent"};

         this.val =  create(root, "div", id + "_value", style2); // align to right side
         this.val.style.background = "transparent";
         this.val.style.border = "0";
         this.val.style.color = "#fff";
         this.val.style.fontFamily = "Arial";
         this.val.style.fontSize = "22px";
         this.val.style.paddingLeft = "10px";
         this.val.style.paddingTop = "2px";
         this.val.innerHTML = "0";
         this.val.value = this.now;
    }

    if (this.val) {
        // ////console.log("Nest value inside Slider container")
        this.div.appendChild( this.val );
    }

    // Nest the knob inside the container
    this.div.appendChild( this.knob );

    // //console.log("this.div = ", this.div);

    // Add the slider to target in the DOM
    this.container.appendChild( this.div );

    // Add mouse drag events
    this.events();
  }

  // 1. programatically sets slider to a value,
  // 2. updates visually in the UI,
  // 3. updates in preview element
  // 4. updates in currently selected element (if selected)
  force(val) {
      //console.log(`Called force(${val}) on `, this);
      // physically move slider knob to a value
      if (this.direction == HORIZONTAL) this.knob.style.left = val + "px"; else this.knob.style.top = val + "px";
      // if shadow, and if value is 0, disable this shadow slider
      if (val == 0 && this.name.match(/shadow_distance_\d/) != null) { // this is a shadow distance slider
          //console.log("value is 0 & this is a shadow distance slider! this.id = ", this.id);
      }
  }

  set(val) { // set slider to a value

      // //console.log("slider set(" + val + ")", this.id);

      if (this.direction == HORIZONTAL)
          this.knob.style.left = val + "px";
      else
          this.knob.style.top = val + "px";

      // update orc vars
      //if ()
      ////console.log("id=",this.id);

      // update the view
  }

  events() {

    //////console.log("Slider().events() for id = " + this.id);

    // knob
    this.knob.addEventListener("mousedown", e => {
      if (this.isDragging == false)
      {
        this.isDragging = true;
        this.memory.x = parseInt(this.knob.style.left);
        this.memory.y = parseInt(this.knob.style.top);
        // //console.log(this.memory);
      }
      // e.stopPropagation();
      e.preventDefault();
    });
    this.knob.addEventListener("mouseup", e => {
      this.isDragging = false;
    });

    // main events
    document.body.addEventListener("mousemove", e => {

      if (this.isDragging == true) {

        let val, bound; // Current value of this slider

        // Horizontal
        if (this.direction == HORIZONTAL) {
          val = this.memory.x + this.mouse.difference.x;
          bound = this.width - this.scrubber.width;
          if (val < 0) val = 0;
          if (val > bound) val = bound;
          this.knob.style.left = val + "px";

        // Must be vertical
        } else {
          val = this.memory.y + this.mouse.difference.y;
          bound = this.height - this.scrubber.height;
          if (val < 0) val = 0;
          if (val > bound) val = bound;
          this.knob.style.top = val + "px";
        }

        // Keep lime color if mouse is outside of the knob but still dragging
        this.knob.style.background = "lime";

        // Update new slider value in slider value display <div>
        if (this.val) this.val.innerHTML = val;





            // update currently selected element
            let element = document.querySelector(".selected");

            if (element) {

                let angle = element.getAttribute("data-angle");
                let skew = element.getAttribute("data-skew");
                let scale = element.getAttribute("data-scale");

                let combined = `rotate(${angle}deg) scale(${scale}) skewx(${skew}deg)`;

                // skew or scale changed (rotation is done separately)
                if (this.name == "skew") {
                    element.setAttribute("data-skew", parseInt(val * 0.1));
                    element.style.transform = combined;
                }

                if (this.name == "scale") {
                    element.setAttribute("data-scale", 1.0 + val * 0.01);
                    element.style.transform = combined;
                }
            }





        // old code below

        // Do something to the currently selected "specimen" element,
        // That this slider is supposed to change. This could be a color,
        // The size (width & height) or rotation angle of target element.

        this.specimen = window.selectedElement;

        // view zoom
        if (this.name == "zoom")
            document.getElementById("View").style.transform = "scale(" + (1.0 + (val * 0.001)) + ")";

        if (this.specimen) {

            let background = document.getElementById("specimen_corners").style.background;

            // update selected element
            this.specimen.style.background = background;








            if (this.name == "blur") this.specimen.style.filter = "blur(" + val + "px)";
            if (this.name == "opacity") this.specimen.style.opacity = 1.0 - ((val) * 0.004);
            if (this.name == "angle") {
                this.specimen.setAttribute("data-rotate", val);

                let scale = this.specimen.getAttribute("data-scale");

                let skewx = this.specimen.getAttribute("data-skewx");
                let skewy = this.specimen.getAttribute("data-skewy");
                let skews = [skewx, skewy];

                let T = `rotate(${val}deg) scale(${scale})`;
                if (skews[0] != null) T += ` skewx(${skews[0]}deg)`;
                if (skews[1] != null) T += ` skewy(${skews[1]}deg)`;

                // update selected element & preview
                this.specimen.style.transform = T;
                //document.getElementById("specimen_corners").style.transform = T;
            }
            if (this.name == "width") this.specimen.style.width = val + "px";
            if (this.name == "height") this.specimen.style.height = val + "px";
            if (this.name == "border") { this.specimen.style.borderWidth = val + "px"; }
        }
      }
    });
    document.body.addEventListener("mouseup", e => {
      this.isDragging = false;
      this.knob.style.background = this.scrubber.color;
    });
  }
}
