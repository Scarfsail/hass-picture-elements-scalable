import { html, nothing } from "lit"
import { customElement } from "lit/decorators.js";
import "../components/last-change-text";

import { ElementEntityBaseConfig, ElementEntityArmableBase } from "./base/";
import type { HassEntity } from "home-assistant-js-websocket";

interface DoorWindowElementConfig extends ElementEntityBaseConfig {
    width: number;
    height: number;
}


@customElement("door-window-element")
export class DoorWindowElement extends ElementEntityArmableBase<DoorWindowElementConfig> {

    protected renderEntityContent(entity: HassEntity) {
        if (!this._config || !this.hass)
            return nothing;

        const opened = entity.state == "on";
        const svgPathArea = "M" + 0 + " " + 0 + " L" + 0 + " " + this._config.height + " L" + this._config.width + " " + this._config.height + " L" + this._config.width + " " + 0 + " Z";


        const alarmState = this.getAlarmoSensorState();
        const color = opened ? 'blue' : alarmState ? (alarmState.armed ? 'red' : 'green') : 'white'

        return html`
            <svg width="${this._config.width}px" height="${this._config.height}px">
                <path d=${svgPathArea} fill=${color} stroke=${color} strokeDasharray=0 strokeWidth=1 />
            </svg>
            <last-change-text .entity=${entity}></last-change-text>
            `
    }
}