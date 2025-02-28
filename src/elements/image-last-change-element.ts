import { html } from "lit"
import { customElement } from "lit/decorators.js";
import { ElementEntityBase, ElementEntityBaseConfig } from "./base";
import { HassEntity } from "home-assistant-js-websocket";

interface ImageLastChangeElementConfig extends ElementEntityBaseConfig {
    size?: number;
}

@customElement("image-last-change-element")
export class ImageLastChangeElement extends ElementEntityBase<ImageLastChangeElementConfig> {
    private element: any;
    protected override renderEntityContent(entity: HassEntity) {

        if (!this.element) {
            this.element = document.createElement('hui-image-element') as any;
            const size = (this._config?.size || 50) + "px";
            this.element.style.width = size;
            this.element.style.height = size;

            // Apply circular styling
            this.element.style.borderRadius = "50%";
            this.element.style.overflow = "hidden";
        }

        this.element.setConfig(this._config)
        this.element.hass = this.hass;

        return html`
            ${this.element}
            <last-change-text .entity=${entity}></last-change-text>            
        `
    }
}