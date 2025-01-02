# Home Assistant's Scalable Picture Elements

## About
Scalable version of Home Assistant's [Picture Elements](https://www.home-assistant.io/dashboards/picture-elements/).

It scales the whole content, including inner elements, to fit both width and height into the parent container.

This library also contains some custom elements like door/window element to better visualize house state.


## Local development and debugging
### This requires to run HASS local dev environment
1. Follow: https://developers.home-assistant.io/docs/development_environment/
2. The dev container runs inside the WSL, therefore this repo should be also cloned inside the same WSL

### To properly develop and debug this repo inside HASS Dev Container, following steps are needed:

1. Modify **devcontainer.json** and add following while the source points to folder if this repository. For example:
    ```json
    "mounts": [
    "source=/mnt/d/hass-picture-elements-scalable,target=/workspaces/hass-core/config/www/hass-picture-elements-scalable,type=bind,consistency=cached"
    ]

2. Clone https://github.com/home-assistant/frontend to hass-frontend. It's in .gitignore, but it's needed as types are used from the official repo
3. Once you run the dev HASS, you also need to register appropriate resources (JS files)
   1. Goto settings -> Dashobards -> Three dots in upper right corner -> Resources -> + ADD RESOURCE
   2. Add required resource (e.g. /local/hass-picture-elements-scalable/dist/hass-picture-elements-scalable-dev.js?dummy=1).