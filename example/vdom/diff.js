import render from './render';

const diffAttrs = (oldAttrs, newAttrs) => {
    const patches = [];
    for (const [key, value] of Object.entries(newAttrs)) {
        patches.push(($node) => {
            $node.setAttribute(key, value);
            return $node;
        });
    }

    for (const [key] of Object.entries(oldAttrs)) {
        if(!(key in newAttrs)) {
            patches.push(($node) => {
                $node.removeAttribute(key);
                return $node;
            });
        }
    }
 
    return ($node) => {
        for(const patch of patches) {
            patch($node);
        }
        return $node;
    }
};

const diffChildrens= (oldVChildren, newVChildren) => {
    const patches = [];
    for (let index = 0; index < oldVChildren.length; index++) {
        const oldVChild = oldVChildren[index];
        const newVChild = newVChildren[index];
        patches.push(diff(oldVChild, newVChild))
    }

    const additionalPatches = [];
    for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
        additionalPatches.push(($node) => {
            $node.appendChild(render(additionalVChild));
            return $node;
        });
    };

    return ($parent) => {
        for (let index = 0; index < $parent.childNodes.length; index++) {
            patches[index]($parent.childNodes[index]);
        }

        for (const patch of additionalPatches) {
            patch($parent);
        }

        return $parent;
    }
};

const diff = (vOldNode, vNewNode) => {
    if(vNewNode === undefined) {
        return ($node) => {
            $node.remove();
            return undefined;
        };
    }

    if(typeof vOldNode === 'string' || typeof vNewNode === 'string') {
        if(vOldNode !== vNewNode) {
            return ($node) => {
                const $newNode = render(vNewNode);
                $node.replaceWith($newNode);
                return $newNode;
            }
        } else {
            return ($node) => undefined;
        }
    }

    if(vOldNode.tagName !== vNewNode.tagName) {
        return ($node) => {
            const $newNode = render(vNewNode);
            $node.replaceWith($newNode);
            return $newNode;
        };
    }

    const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs);
    const patchChildrens = diffChildrens(vOldNode.children, vNewNode.children);

    return ($node) => {
        patchAttrs($node);
        patchChildrens($node);
        return $node;
    };    
};



export default diff;