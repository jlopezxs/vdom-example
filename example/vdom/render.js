const renderElement = (vNode) => {
    const $el = document.createElement(vNode.tagName);

    // Set Attributes
    for (const [key, value] of Object.entries(vNode.attrs)) {
        $el.setAttribute(key, value)
    }

    //Set Children
    for (const child of vNode.children) {
        const $child = render(child);
        $el.appendChild($child);
    }

    return $el;
}

const render = (vNode) => {
    if(typeof vNode === 'string') {
        return document.createTextNode(vNode)
    }

    return renderElement(vNode);
}

export default render;