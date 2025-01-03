import { html } from "lit"
import { customElement, property } from "lit/decorators.js";
import "../components/last-change-text";
import { ElementEntityBase, ElementEntityArmableBase } from "./base";
import { HassEntity } from "home-assistant-js-websocket";


@customElement("analog-element")
export class AnalogElement extends ElementEntityBase {
    protected override renderEntityContent(entity: HassEntity) {
        const units = entity.attributes.unit_of_measurement;
        return html`
            <span>${entity.state}<span style="font-size:50%">${units}</span></span>
        `
    }
}