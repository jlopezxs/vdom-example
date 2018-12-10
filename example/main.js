import createElement from './vdom/createElement';
import render from './vdom/render';
import mount from './vdom/mount';
import diff from './vdom/diff';

const createVApp = (count) => createElement('div', {
    attrs: {
        id: 'app',
        dataCount: count,
    },
    children: [
        createElement('input', {
            attrs: {
                type: 'text',
            }
        }),
        String(count),
        ...Array.from({ length: count }, () => createElement('img', {
            attrs: {
                src: 'https://media.giphy.com/media/Vp4cpDCA4Pwm4/giphy.gif'
            }
        }))
    ]
});


let count = 0;
let vApp = createVApp(count);
const $app = render(vApp);

let $root = mount($app, document.getElementById('app'));

setInterval(() => {
    count ++;
    const vNewApp = createVApp(count);
    const patch = diff(vApp, vNewApp);

    $root = patch($root)
    vApp = vNewApp;
}, 1000);

console.log($root);

