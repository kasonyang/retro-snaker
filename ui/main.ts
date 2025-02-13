import {DeftWindow} from "deft-react";
import React from "react";
import {App} from "./app";

function initWindow(): DeftWindow {
    return globalThis.mainWindow || (globalThis.mainWindow = new DeftWindow({
        title: '贪吃蛇',
        resizable: false,
        width: 400,
        height: 440,
    }));
}

function main() {
    const window = initWindow();
    window.newPage(React.createElement(App));
}

main();

/// Hot reload support
//@ts-ignore
module.hot && module.hot.accept();
