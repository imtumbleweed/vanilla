// Create element
export let create = (target, type, id, style, classname, content) => {

    let element = document.createElement(type);

    element.style.display = "block";
    element.style.position = "absolute";
    element.setAttribute("id", id);
    element.setAttribute("class", "box");
    classname && (element.className = classname);
    content && (element.innerHTML = content);

    Object.entries(style).map(entry => {
        let [ property, value ] = entry;
        element.style[property] = value;
    });

    target.appendChild(element);

    return element;
};
