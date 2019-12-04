// Create element
export let create = (target, type, id, style) => {

    let element = document.createElement(type);

    element.style.display = "block";
    element.style.position = "absolute";
    element.setAttribute("id", id);
    element.setAttribute("class", "box");

    Object.entries(style).map(entry => {
        let [ property, value ] = entry;
        element.style[property] = value;
    });

    target.appendChild(element);

    return element;
};