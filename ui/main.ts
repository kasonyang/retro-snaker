import React from "react";
import {App} from "./app";
import {render} from "deft-react";

function initWindow(): Window {
    return globalThis.mainWindow || (globalThis.mainWindow = new Window({
        title: '贪吃蛇',
        // resizable: false,
        width: 400,
        height: 440,
    }));
}

const window = initWindow();
render(window, React.createElement(App));

/// Hot reload support
//@ts-ignore
module.hot && module.hot.accept();
