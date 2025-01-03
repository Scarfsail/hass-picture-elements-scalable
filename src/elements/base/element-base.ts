import { LitElement, TemplateResult, css, html, nothing } from "lit"
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../../../hass-frontend/src/types";
import type { HassEntity } from "home-assistant-js-websocket";

export interface ElementBaseConfig {
    style: any;
    top: number;
    left: number;
}


export abstract class ElementBase<TConfig extends ElementBaseConfig = ElementBaseConfig> extends LitElement {
    @property({ attribute: false }) public hass?: HomeAssistant;

    @state() protected _config?: TConfig;

    setConfig(config: TConfig) {
        this._config = config;

        if (config.style) {
            Object.keys(config.style).forEach((prop) => {
                this.style.setProperty(prop, config.style![prop]);
            });
        }

    }


    protected render() {
        if (!this._config || !this.hass) {
            return nothing;
        }

        return html`            
            ${this.renderContent()}
        `
    }

    protected abstract renderContent(): TemplateResult | typeof nothing
}