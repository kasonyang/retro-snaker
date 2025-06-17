#!/bin/bash
export EMCC_CFLAGS="-s MAX_WEBGL_VERSION=2 -s MODULARIZE=1 -s EXPORT_NAME=loadDeftApp -s EXPORTED_RUNTIME_METHODS=GL"
npm run build
export DEFT_JS_DIR=dist
cargo build --bins --target wasm32-unknown-emscripten $@