import { LitElement, TemplateResult, css, html, nothing } from "lit"
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../../../hass-frontend/src/types";
import "../../components/last-change-text";

import { AlarmoSensorAndArea, getAlarmoSensorAndArea, getAlarmoSensorState } from "../../utils/alarmo";
import type { HassEntity } from "home-assistant-js-websocket";

export interface ElementBaseConfig {
    entity: string;
    style: any;
    top: number;
    left: number;
}


export abstract class ElementBase<TConfig extends ElementBaseConfig = ElementBaseConfig> extends LitElement {
    @property({ attribute: false }) public hass?: HomeAssistant;

    @state() protected _config?: TConfig;

    static styles = css`
        :host {
            cursor: pointer;
        }
    `

    setConfig(config: TConfig) {
        if (!config.entity) {
            throw Error("Entity required");
        }
        this._config = config;

        if (config.style) {
            Object.keys(config.style).forEach((prop) => {
                this.style.setProperty(prop, config.style![prop]);
            });
        }

    }


    private _showMoreInfo() {
        const entityId = this._config?.entity;
        const event = new CustomEvent("hass-more-info", {
            detail: { entityId: entityId },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }

    protected render() {
        if (!this._config || !this.hass) {
            return nothing;
        }
        const entity = this.hass.states[this._config.entity]

        return html`
        <div @click=${this._showMoreInfo}>
            ${this.renderContent(entity)}
        </div>`
    }

    protected abstract renderContent(entity: HassEntity): TemplateResult | typeof nothing
}