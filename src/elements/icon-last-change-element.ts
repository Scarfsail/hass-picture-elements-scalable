import { html } from "lit"
import { customElement } from "lit/decorators.js";
import { ElementEntityBase, ElementEntityBaseConfig } from "./base";
import { HassEntity } from "home-assistant-js-websocket";
import { ShortenNumberPrefixType } from "../utils";

interface IconLastChangeElementConfig extends ElementEntityBaseConfig {


}

@customElement("icon-last-change-element")
export class IconLastChangeElement extends ElementEntityBase<IconLastChangeElementConfig> {
    private element: any;    
    protected override renderEntityContent(entity: HassEntity) {

        if (!this.element)
            this.element = document.createElement('hui-state-icon-element') as any;

        this.element.setConfig(this._config)
        this.element.hass = this.hass;

        return html`
            ${this.element}
            <last-change-text .entity=${entity}></last-change-text>            
        `
    }
}